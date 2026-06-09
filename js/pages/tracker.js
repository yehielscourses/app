import { createNotionItem } from '../components/notion-card.js';
import { createProgressSection, updateProgressBar } from '../components/progress-bar.js';
import { createDifficultyDots } from '../components/difficulty.js';
import { loadState, saveState, clearState, pruneState, didLastSaveFail } from '../storage.js';
import { getProfile } from '../lib/profile.js';
import { showConfirm } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { createExamSection, loadEpreuves } from '../components/exam-calendar.js';
import { openSettingsSheet } from '../components/settings-sheet.js';

const COLLAPSE_STORAGE_KEY = 'bac-tracker-collapse-v1';

let data = null;

function getAllNotionIds(sections) {
    const map = {};
    const all = [];
    sections.forEach((section) => {
        const ids = [];
        section.subsections.forEach((sub) => {
            sub.notions.forEach((n) => {
                ids.push(n.id);
                all.push(n.id);
            });
        });
        map[section.id] = ids;
    });
    return { map, all };
}

function getTotalCount(sectionMap) {
    return Object.values(sectionMap).reduce((sum, ids) => sum + ids.length, 0);
}

function collectCheckedState(root) {
    const state = {};
    root.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
        if (cb.id && !cb.id.startsWith('filter-')) state[cb.id] = cb.checked;
    });
    return state;
}

function applyState(root, state) {
    Object.entries(state).forEach(([id, checked]) => {
        const cb = root.querySelector(`#${CSS.escape(id)}`);
        if (cb) cb.checked = checked;
    });
}

function loadCollapseState() {
    try {
        return JSON.parse(localStorage.getItem(COLLAPSE_STORAGE_KEY) || '{}');
    } catch {
        return {};
    }
}

function saveCollapseState(state) {
    try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
}

function updateTrackerUI(root, sectionMap, total, completionMessage) {
    let checkedAll = 0;
    const filterUnchecked = root.querySelector('#filter-unchecked')?.checked ?? true;

    for (const [secId, ids] of Object.entries(sectionMap)) {
        let secChecked = 0;
        let visibleInSection = 0;

        ids.forEach((id) => {
            const cb = root.querySelector(`#${CSS.escape(id)}`);
            const li = root.querySelector(`#li-${CSS.escape(id)}`);
            if (!cb || !li) return;

            if (cb.checked) {
                checkedAll++;
                secChecked++;
                li.classList.add('done');
            } else {
                li.classList.remove('done');
            }

            const hide = filterUnchecked && cb.checked;
            li.classList.toggle('notion-hidden', hide);
            if (!hide) visibleInSection++;
        });

        const badge = root.querySelector(`#badge-${secId}`);
        if (badge) {
            badge.textContent = `${secChecked} / ${ids.length}`;
            badge.classList.toggle('done', secChecked === ids.length);
        }

        const sectionEl = root.querySelector(`#section-${secId}`);
        if (sectionEl) {
            sectionEl.classList.toggle('section-empty-filtered', filterUnchecked && visibleInSection === 0);
        }
    }

    const progressSection = root.querySelector('.progress-section');
    if (progressSection) {
        updateProgressBar(progressSection, { checked: checkedAll, total, completionMessage });
    }
}

async function typesetMath(container) {
    container.classList.add('math-pending');
    if (window.MathJax?.typesetPromise) {
        try {
            await MathJax.typesetPromise([container]);
        } finally {
            container.classList.remove('math-pending');
        }
    } else {
        container.classList.remove('math-pending');
    }
}

function renderSection(section, collapseState) {
    const details = document.createElement('details');
    details.className = 'tracker-section';
    details.id = `section-${section.id}`;
    details.open = collapseState[section.id] !== false;

    const summary = document.createElement('summary');
    summary.className = 'tracker-section-summary';

    const titleWrap = document.createElement('span');
    titleWrap.className = 'tracker-section-summary-title';

    const expandIcon = document.createElement('span');
    expandIcon.className = 'material-symbols-rounded tracker-section-expand-icon';
    expandIcon.setAttribute('aria-hidden', 'true');
    expandIcon.textContent = 'expand_more';

    const title = document.createElement('span');
    title.className = 'h2-title';
    title.textContent = section.title;

    titleWrap.append(expandIcon, title);

    const meta = document.createElement('span');
    meta.className = 'h2-meta';

    if (section.difficulty) {
        meta.append(createDifficultyDots(section.difficulty));
    }

    const badge = document.createElement('span');
    badge.className = 'sec-badge';
    badge.id = `badge-${section.id}`;
    badge.textContent = `0 / ${section.subsections.reduce((n, s) => n + s.notions.length, 0)}`;
    meta.append(badge);

    summary.append(titleWrap, meta);
    details.append(summary);

    section.subsections.forEach((sub) => {
        const block = document.createElement('div');
        block.className = 'sub-section';

        if (sub.title) {
            const h3 = document.createElement('h3');
            h3.textContent = sub.title;
            block.append(h3);
        }

        const ul = document.createElement('ul');
        ul.className = 'notion-list';
        sub.notions.forEach((notion) => ul.append(createNotionItem(notion)));
        block.append(ul);
        details.append(block);
    });

    details.addEventListener('toggle', () => {
        const state = loadCollapseState();
        state[section.id] = details.open;
        saveCollapseState(state);
    });

    return details;
}

async function loadData() {
    if (data) return data;
    const res = await fetch(new URL('data/notions.json', document.baseURI));
    if (!res.ok) throw new Error('Impossible de charger les notions');
    data = await res.json();
    return data;
}

export function invalidateTrackerCache() {
    data = null;
}

export async function mountTracker(container) {
    let notions;
    try {
        notions = await loadData();
    } catch {
        container.classList.add('page-home');
        container.innerHTML = `
            <div class="page-placeholder">
                <span class="material-symbols-rounded page-placeholder-icon">warning</span>
                <h2>Erreur de chargement</h2>
                <p>Impossible de charger les notions. Vérifiez votre connexion et réessayez.</p>
                <button type="button" class="btn-primary" id="tracker-retry">Réessayer</button>
            </div>`;
        container.querySelector('#tracker-retry')?.addEventListener('click', () => {
            data = null;
            mountTracker(container);
        });
        return;
    }

    const profile = getProfile();
    const { map: sectionMap, all: allIds } = getAllNotionIds(notions.sections);
    const total = getTotalCount(sectionMap);
    const storageKey = notions.storageKey;

    let saved = loadState(storageKey);
    const pruned = pruneState(saved, allIds);
    if (Object.keys(pruned).length !== Object.keys(saved).length) {
        saveState(pruned, storageKey);
    }
    saved = pruned;

    const collapseState = loadCollapseState();

    container.innerHTML = '';
    container.classList.add('page-home');

    try {
        const epreuves = await loadEpreuves();
        container.append(createExamSection(epreuves));
    } catch {
        const errSection = document.createElement('section');
        errSection.className = 'home-exams home-exams--error';
        errSection.innerHTML = '<p>Impossible de charger le calendrier des épreuves.</p>';
        container.append(errSection);
    }

    const trackerTitle = document.createElement('h2');
    trackerTitle.className = 'home-section-title';
    trackerTitle.innerHTML = `
        <span class="material-symbols-rounded" aria-hidden="true">checklist</span>
        ${notions.title}`;
    container.append(trackerTitle);

    const profileBox = document.createElement('div');
    profileBox.className = 'profile-box';
    profileBox.innerHTML = `
        <p>${profile.headline || notions.profile.headline}</p>
        <p>${profile.objective || notions.profile.objective}</p>
        <button type="button" class="profile-box-link m3-state-layer" id="tracker-edit-profile">
            <span class="material-symbols-rounded" aria-hidden="true">edit</span>
            Modifier le parcours
        </button>
    `;
    container.append(profileBox);
    profileBox.querySelector('#tracker-edit-profile')?.addEventListener('click', (ev) => {
        openSettingsSheet(ev.currentTarget);
    });

    const progressSection = createProgressSection();
    container.append(progressSection);

    const toolbar = document.createElement('div');
    toolbar.className = 'tracker-toolbar';
    toolbar.innerHTML = `
        <div class="tracker-toolbar-row">
            <label class="filter-unchecked-label">
                <input type="checkbox" id="filter-unchecked">
                Afficher uniquement les notions non cochées
            </label>
            <div class="tracker-toolbar-actions">
                <button type="button" class="btn-text m3-state-layer" id="tracker-expand-all">
                    <span class="material-symbols-rounded" aria-hidden="true">unfold_more</span>
                    Tout déplier
                </button>
                <button type="button" class="btn-text m3-state-layer" id="tracker-collapse-all">
                    <span class="material-symbols-rounded" aria-hidden="true">unfold_less</span>
                    Tout replier
                </button>
            </div>
        </div>
    `;
    container.append(toolbar);

    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.innerHTML = `
        <button type="button" class="btn-reset m3-state-layer" id="tracker-reset">
            <span class="material-symbols-rounded" aria-hidden="true">restart_alt</span>
            Réinitialiser la progression
        </button>
    `;
    container.append(actions);

    notions.sections.forEach((section) => {
        container.append(renderSection(section, collapseState));
    });

    applyState(container, saved);
    updateTrackerUI(container, sectionMap, total, notions.completionMessage);
    await typesetMath(container);

    function onChange() {
        if (!saveState(collectCheckedState(container), storageKey)) {
            showToast('Impossible de sauvegarder la progression.', { variant: 'error', duration: 8000 });
        }
        updateTrackerUI(container, sectionMap, total, notions.completionMessage);
    }

    container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
        cb.addEventListener('change', onChange);
    });

    container.querySelector('#tracker-expand-all')?.addEventListener('click', () => {
        container.querySelectorAll('.tracker-section').forEach((el) => { el.open = true; });
        const state = {};
        notions.sections.forEach((s) => { state[s.id] = true; });
        saveCollapseState(state);
    });

    container.querySelector('#tracker-collapse-all')?.addEventListener('click', () => {
        container.querySelectorAll('.tracker-section').forEach((el) => { el.open = false; });
        const state = {};
        notions.sections.forEach((s) => { state[s.id] = false; });
        saveCollapseState(state);
    });

    container.querySelector('#tracker-reset')?.addEventListener('click', async () => {
        const ok = await showConfirm({
            title: 'Réinitialiser la progression',
            message: 'Réinitialiser toute la progression du tracker ? Cette action est irréversible.',
            confirmLabel: 'Réinitialiser',
            danger: true,
        });
        if (!ok) return;
        container.querySelectorAll('.notion-list input[type="checkbox"]').forEach((cb) => { cb.checked = false; });
        if (!clearState(storageKey)) {
            showToast('Impossible d\'effacer la sauvegarde locale.', { variant: 'error' });
        }
        updateTrackerUI(container, sectionMap, total, notions.completionMessage);
        showToast('Progression réinitialisée.');
    });

    if (didLastSaveFail()) {
        showToast('Attention : la dernière sauvegarde a échoué.', { variant: 'error', duration: 8000 });
    }
}
