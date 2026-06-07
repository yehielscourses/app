import { createNotionItem } from '../components/notion-card.js';
import { createProgressSection, updateProgressBar } from '../components/progress-bar.js';
import { createDifficultyDots } from '../components/difficulty.js';
import { loadState, saveState, clearState } from '../storage.js';

let data = null;

function getAllNotionIds(sections) {
    const map = {};
    sections.forEach((section) => {
        const ids = [];
        section.subsections.forEach((sub) => {
            sub.notions.forEach((n) => ids.push(n.id));
        });
        map[section.id] = ids;
    });
    return map;
}

function getTotalCount(sectionMap) {
    return Object.values(sectionMap).reduce((sum, ids) => sum + ids.length, 0);
}

function collectCheckedState(root) {
    const state = {};
    root.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
        if (cb.id) state[cb.id] = cb.checked;
    });
    return state;
}

function applyState(root, state) {
    Object.entries(state).forEach(([id, checked]) => {
        const cb = root.querySelector(`#${CSS.escape(id)}`);
        if (cb) cb.checked = checked;
    });
}

function updateTrackerUI(root, sectionMap, total, completionMessage) {
    let checkedAll = 0;

    for (const [secId, ids] of Object.entries(sectionMap)) {
        let secChecked = 0;

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
        });

        const badge = root.querySelector(`#badge-${secId}`);
        if (badge) {
            badge.textContent = `${secChecked} / ${ids.length}`;
            badge.classList.toggle('done', secChecked === ids.length);
        }
    }

    const progressSection = root.querySelector('.progress-section');
    if (progressSection) {
        updateProgressBar(progressSection, { checked: checkedAll, total, completionMessage });
    }
}

async function typesetMath(container) {
    if (window.MathJax?.typesetPromise) {
        await MathJax.typesetPromise([container]);
    }
}

function renderSection(section) {
    const h2 = document.createElement('h2');

    const title = document.createElement('span');
    title.className = 'h2-title';
    title.textContent = section.title;

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

    h2.append(title, meta);

    const fragment = document.createDocumentFragment();
    fragment.append(h2);

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
        fragment.append(block);
    });

    return fragment;
}

async function loadData() {
    if (data) return data;
    const res = await fetch('data/notions.json');
    if (!res.ok) throw new Error('Impossible de charger les notions');
    data = await res.json();
    return data;
}

export async function mountTracker(container) {
    const notions = await loadData();
    const sectionMap = getAllNotionIds(notions.sections);
    const total = getTotalCount(sectionMap);
    const storageKey = notions.storageKey;

    container.innerHTML = '';
    container.className = 'container page-tracker';

    const h1 = document.createElement('h1');
    h1.textContent = notions.title;
    container.append(h1);

    const profile = document.createElement('div');
    profile.className = 'profile-box';
    profile.innerHTML = `
        <p>${notions.profile.headline}</p>
        <p>${notions.profile.objective}</p>
    `;
    container.append(profile);

    const progressSection = createProgressSection();
    container.append(progressSection);

    const actions = document.createElement('div');
    actions.className = 'actions';
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn-reset';
    resetBtn.textContent = '↺ Réinitialiser tout';
    actions.append(resetBtn);
    container.append(actions);

    notions.sections.forEach((section) => {
        container.append(renderSection(section));
    });

    applyState(container, loadState(storageKey));
    updateTrackerUI(container, sectionMap, total, notions.completionMessage);
    await typesetMath(container);

    function onChange() {
        saveState(collectCheckedState(container), storageKey);
        updateTrackerUI(container, sectionMap, total, notions.completionMessage);
    }

    container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
        cb.addEventListener('change', onChange);
    });

    resetBtn.addEventListener('click', () => {
        if (!confirm('Réinitialiser toute la progression ?\nCette action est irréversible.')) return;
        container.querySelectorAll('input[type="checkbox"]').forEach((cb) => { cb.checked = false; });
        clearState(storageKey);
        updateTrackerUI(container, sectionMap, total, notions.completionMessage);
    });
}
