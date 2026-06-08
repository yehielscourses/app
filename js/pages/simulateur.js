import { loadState, saveState, SIMULATOR_STORAGE_KEY, didLastSaveFail } from '../storage.js';
import { normalizeNotes } from '../lib/notes.js';
import { applyProfileToCoefficients, getProfile, buildSimulatorSubline } from '../lib/profile.js';
import {
    computeAllAverages,
    getMention,
    findNextExam,
    formatDateFr,
    formatTimeUntil,
    findRattrapageCandidates,
    mapExamToSimulatorId,
    SCENARIOS,
} from '../lib/grade-calculator.js';
import { showPrompt } from '../components/modal.js';
import { showToast } from '../components/toast.js';

const GROUP_LABELS = {
    controle_continu: { short: 'CO', full: 'Contrôle continu', class: 'sim-group-co' },
    epreuves_finales: { short: 'ÉPREUVES FINALES', full: 'Épreuves finales', class: 'sim-group-finales' },
};

let coefficientsData = null;
let epreuvesData = null;

function clampNote(value) {
    if (value === '' || value === null || value === undefined) return '';
    const n = parseFloat(value);
    if (Number.isNaN(n)) return '';
    return Math.min(20, Math.max(0, n));
}

function noteFieldValue(notes, id, field) {
    const entry = notes[id];
    if (!entry) return '';
    return entry[field] !== undefined && entry[field] !== '' ? entry[field] : '';
}

function renderNoteFields(epreuve, notes) {
    const fields = ['reelle', 'min', 'max'];
    const labels = { reelle: 'Réelle', min: 'Min', max: 'Max' };
    return fields.map((field) => {
        const value = noteFieldValue(notes, epreuve.id, field);
        return `
            <div class="sim-note-field">
                <span class="sim-note-field-label">${labels[field]}</span>
                <input
                    type="number"
                    class="sim-note-input"
                    data-id="${epreuve.id}"
                    data-field="${field}"
                    min="0"
                    max="20"
                    step="0.25"
                    placeholder="—"
                    value="${value}"
                    aria-label="${labels[field]} — ${epreuve.label}"
                >
            </div>`;
    }).join('');
}

function renderEpreuveRow(epreuve, notes, groupMeta, isFirst, rowSpan) {
    const required = epreuve.required;
    const groupCell = isFirst
        ? `<td class="sim-group-label ${groupMeta.class}" rowspan="${rowSpan}">
                <span class="sim-group-short">${groupMeta.short}</span>
           </td>`
        : '';

    return `
        <tr class="sim-row${required ? '' : ' sim-row--optional'}" data-sim-id="${epreuve.id}">
            ${groupCell}
            <td class="sim-cell-label">
                ${required ? '<span class="sim-required">*</span>' : ''}
                ${epreuve.label}
            </td>
            <td class="sim-cell-coef">${epreuve.coefficient}</td>
            <td class="sim-cell-notes"><div class="sim-note-fields">${renderNoteFields(epreuve, notes)}</div></td>
        </tr>`;
}

function renderEpreuveCard(epreuve, notes, groupMeta) {
    const required = epreuve.required;
    return `
        <article class="sim-card${required ? '' : ' sim-card--optional'}" data-sim-id="${epreuve.id}">
            <div class="sim-card-header">
                <span class="sim-card-group ${groupMeta.class}">${groupMeta.full}</span>
                <span class="sim-card-coef">Coef. ${epreuve.coefficient}</span>
            </div>
            <h3 class="sim-card-title">
                ${required ? '<span class="sim-required">*</span>' : ''}
                ${epreuve.label}
            </h3>
            <div class="sim-card-notes">${renderNoteFields(epreuve, notes)}</div>
        </article>`;
}

function isMobileLayout() {
    return window.matchMedia('(max-width: 720px)').matches;
}

function renderGroupTables(groupKey, epreuves, notes) {
    const meta = GROUP_LABELS[groupKey];
    const mobile = isMobileLayout();

    if (mobile) {
        const cards = epreuves.map((e) => renderEpreuveCard(e, notes, meta)).join('');
        return `<div class="sim-block" data-group="${groupKey}"><div class="sim-cards">${cards}</div></div>`;
    }

    const rows = epreuves.map((e, i) => renderEpreuveRow(e, notes, meta, i === 0, epreuves.length)).join('');
    return `
        <div class="sim-block" data-group="${groupKey}">
            <div class="sim-table-wrap">
                <table class="sim-table">
                    <thead>
                        <tr>
                            <th class="sim-th-group"></th>
                            <th class="sim-th-label">Matière</th>
                            <th class="sim-th-coef">Coef.</th>
                            <th class="sim-th-note">Réelle · Min · Max</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>`;
}

function formatMoyenne(value) {
    if (value === null || Number.isNaN(value)) return '—';
    return value.toFixed(2);
}

function renderScenarioCard(scenario, averages, totalCoef) {
    const { id, label, hint, mentionAllowed } = scenario;
    let scoreHtml;
    let mentionHtml = '';

    if (id === 'fourchette') {
        const { low, high, filledCoef } = averages.fourchette;
        const lowStr = formatMoyenne(low);
        const highStr = formatMoyenne(high);
        scoreHtml = low !== null && high !== null
            ? `<span class="sim-scenario-range">${lowStr} — ${highStr}</span>`
            : '<span class="sim-scenario-range">—</span>';
        const progress = totalCoef > 0 ? Math.round((filledCoef / totalCoef) * 100) : 0;
        return `
            <div class="sim-scenario-card" data-scenario="${id}">
                <span class="sim-scenario-label">${label}</span>
                <span class="sim-scenario-score">${scoreHtml}<span class="sim-summary-unit">/20</span></span>
                <span class="sim-scenario-meta">${filledCoef} / ${totalCoef} coef. (${progress} %)</span>
                <p class="sim-scenario-hint">${hint}</p>
            </div>`;
    }

    const result = averages[id];
    const moyenne = result.moyenne;
    const filledCoef = result.filledCoef;
    const progress = totalCoef > 0 ? Math.round((filledCoef / totalCoef) * 100) : 0;
    const complete = filledCoef === totalCoef && totalCoef > 0;

    if (mentionAllowed && moyenne !== null && complete) {
        const mention = getMention(moyenne);
        if (mention) mentionHtml = `<span class="sim-mention ${mention.class}">${mention.label}</span>`;
    } else if (mentionAllowed && moyenne !== null && !complete) {
        mentionHtml = '<span class="sim-mention sim-mention--partial">Partielle</span>';
    }

    return `
        <div class="sim-scenario-card" data-scenario="${id}">
            <span class="sim-scenario-label">${label}</span>
            <span class="sim-scenario-score">${formatMoyenne(moyenne)}<span class="sim-summary-unit">/20</span></span>
            ${mentionHtml}
            <span class="sim-scenario-meta">${filledCoef} / ${totalCoef} coef. (${progress} %)</span>
            <p class="sim-scenario-hint">${hint}</p>
        </div>`;
}

function renderSummary(averages) {
    const totalCoef = averages.min.totalCoef;
    const scenarios = SCENARIOS.map((s) => renderScenarioCard(s, averages, totalCoef)).join('');

    return `
        <div class="sim-summary">
            <p class="sim-summary-intro">
                Plusieurs moyennes sont affichées : les notes <strong>réelles</strong> (si connues),
                les scénarios <strong>pessimiste</strong> et <strong>optimiste</strong> (fourchette auto-évaluée),
                et la <strong>fourchette probable</strong> entre ces deux bornes.
            </p>
            <div class="sim-scenarios">${scenarios}</div>
            <p class="sim-summary-footer">Total bac : ${totalCoef} coef. — Les mentions ne s'affichent que si toutes les notes du scénario sont renseignées.</p>
        </div>`;
}

function renderDisclaimer() {
    return `
        <div class="sim-disclaimer" role="note">
            <strong>Résultat indicatif</strong> — Ce simulateur ne remplace pas le calcul officiel du jury.
            Les règles d'obtention du bac (moyenne générale, éliminations par épreuve) peuvent varier.
        </div>`;
}

function renderRattrapageBanner(candidates) {
    if (!candidates.length) return '';
    const list = candidates.map((c) => `${c.label} (${c.note.toFixed(2)}/20)`).join(', ');
    return `
        <div class="sim-rattrapage" role="status">
            <strong>Épreuve(s) de rattrapage possible(s)</strong>
            <p>Note réelle entre 8 et 10 pour : ${list}. Une seconde session peut être organisée selon les règles de l'académie.</p>
        </div>`;
}

function renderNextExam(epreuve) {
    if (!epreuve) {
        return `
            <div class="sim-next-exam sim-next-exam--done">
                <span class="sim-next-exam-icon">✓</span>
                <div>
                    <strong>Toutes les épreuves sont passées</strong>
                    <p>Bon courage pour les résultats !</p>
                </div>
            </div>`;
    }

    const now = new Date();
    const datetime = new Date(`${epreuve.date}T${epreuve.heure_debut}:00`);
    const countdown = formatTimeUntil(datetime, now);

    return `
        <div class="sim-next-exam" data-exam-id="${epreuve.id}">
            <span class="sim-next-exam-icon">📅</span>
            <div class="sim-next-exam-body">
                <span class="sim-next-exam-label">Prochaine épreuve — ${countdown.label}</span>
                <strong class="sim-next-exam-title">${epreuve.nom}</strong>
                <p class="sim-next-exam-meta">
                    ${formatDateFr(epreuve.date)} à ${epreuve.heure_debut}
                    ${epreuve.duree ? ` · ${epreuve.duree.replace(':', 'h')}` : ''}
                </p>
                ${epreuve.adresse ? `
                <p class="sim-next-exam-location">
                    <span class="sim-next-exam-location-icon" aria-hidden="true">📍</span>
                    <span>${epreuve.adresse}</span>
                </p>` : ''}
            </div>
        </div>`;
}

function renderCycleTerminale(epreuvesData, notes) {
    const blocks = ['controle_continu', 'epreuves_finales']
        .map((key) => renderGroupTables(key, epreuvesData[key], notes))
        .join('');

    const profile = getProfile();
    return `
        <section class="sim-niveau" data-cycle="terminale">
            <h2 class="sim-niveau-title">Cycle terminale</h2>
            <p class="sim-cycle-hint">${profile.cycleHint}</p>
            ${blocks}
        </section>`;
}

function renderCalendar(epreuves, nextExam) {
    return `
        <details class="sim-calendar">
            <summary>Calendrier complet des épreuves (${epreuves.length})</summary>
            <ul class="sim-calendar-list">
                ${epreuves.map((e) => {
                    const simId = mapExamToSimulatorId(e);
                    const isNext = nextExam && e.id === nextExam.id;
                    return `
                    <li class="sim-calendar-item${isNext ? ' sim-calendar-item--next' : ''}"
                        ${simId ? `data-sim-target="${simId}" tabindex="0" role="button"` : ''}>
                        <time datetime="${e.date}">${formatDateFr(e.date)}</time>
                        <span class="sim-calendar-time">${e.heure_debut}</span>
                        <span class="sim-calendar-name">${e.nom}</span>
                        ${simId ? '<span class="sim-calendar-link-hint">↗ Saisir les notes</span>' : ''}
                        ${e.adresse ? `<span class="sim-calendar-address">📍 ${e.adresse}</span>` : ''}
                    </li>`;
                }).join('')}
            </ul>
        </details>`;
}

function updateSummary(root, coefficients, notes) {
    const averages = computeAllAverages(coefficients, notes);
    const summaryEl = root.querySelector('.sim-summary');
    if (summaryEl) summaryEl.outerHTML = renderSummary(averages);

    const rattrapageEl = root.querySelector('.sim-rattrapage');
    const candidates = findRattrapageCandidates(coefficients, notes);
    const newRattrapage = renderRattrapageBanner(candidates);
    if (rattrapageEl) {
        rattrapageEl.outerHTML = newRattrapage || '<div class="sim-rattrapage sim-rattrapage--empty" hidden></div>';
    }
}

function collectNotes(root) {
    const notes = {};
    root.querySelectorAll('.sim-note-input').forEach((input) => {
        const id = input.dataset.id;
        const field = input.dataset.field;
        if (!notes[id]) notes[id] = { reelle: '', min: '', max: '' };
        notes[id][field] = input.value;
    });
    return notes;
}

function scrollToSimRow(root, simId) {
    const target = root.querySelector(`[data-sim-id="${simId}"]`);
    if (!target) return;
    target.classList.add('sim-highlight');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const input = target.querySelector('.sim-note-input[data-field="reelle"]')
        || target.querySelector('.sim-note-input');
    if (input) input.focus();
    setTimeout(() => target.classList.remove('sim-highlight'), 2000);
}

function persistNotes(root, coefficients) {
    const notes = collectNotes(root);
    if (!saveState(notes, SIMULATOR_STORAGE_KEY)) {
        showToast('Impossible de sauvegarder vos notes (stockage local indisponible ou plein).', { variant: 'error', duration: 8000 });
    }
    updateSummary(root, coefficients, notes);
    return notes;
}

async function loadData() {
    const [coefRes, eprRes] = await Promise.all([
        fetch(new URL('data/coefficients.json', document.baseURI)),
        fetch(new URL('data/epreuves.json', document.baseURI)),
    ]);
    if (!coefRes.ok || !eprRes.ok) throw new Error('Chargement impossible');
    coefficientsData = applyProfileToCoefficients(await coefRes.json(), getProfile());
    epreuvesData = await eprRes.json();
    return { coefficients: coefficientsData, epreuves: epreuvesData };
}

export function invalidateSimulateurCache() {
    coefficientsData = null;
}

function handleNoteInput(container, coefficients, input) {
    const clamped = clampNote(input.value);
    if (clamped !== '' && String(clamped) !== input.value) {
        input.value = clamped;
    }
    persistNotes(container, coefficients);
}

export async function mountSimulateur(container) {
    if (container._simCleanup) container._simCleanup();
    if (container._simAbort) container._simAbort.abort();

    const abort = new AbortController();
    container._simAbort = abort;

    container.className = 'container page-simulateur';
    container.dataset.layout = isMobileLayout() ? 'mobile' : 'desktop';

    let coefficients, epreuves;
    try {
        ({ coefficients, epreuves } = await loadData());
    } catch {
        container.innerHTML = `
            <div class="page-placeholder">
                <div class="page-placeholder-icon">⚠️</div>
                <h2>Erreur de chargement</h2>
                <p>Impossible de charger les données du simulateur.</p>
            </div>`;
        return;
    }

    const notes = normalizeNotes(loadState(SIMULATOR_STORAGE_KEY));
    const profile = getProfile();
    const nextExam = findNextExam(epreuves);
    const averages = computeAllAverages(coefficients, notes);
    const rattrapage = findRattrapageCandidates(coefficients, notes);

    container.innerHTML = `
        <h1>Simulateur de note</h1>
        <div class="profile-box">
            <p>${profile.simulatorHeadline}</p>
            <p>${buildSimulatorSubline(profile)}</p>
        </div>
        ${renderDisclaimer()}
        ${renderRattrapageBanner(rattrapage)}
        ${renderNextExam(nextExam)}
        ${renderSummary(averages)}
        ${renderCycleTerminale(coefficients.epreuves, notes)}
        ${renderCalendar(epreuves, nextExam)}
        <div class="sim-actions">
            <button type="button" class="btn-reset" id="sim-reset-notes">↺ Remplir toutes les notes…</button>
        </div>
    `;

    const onNoteEdit = (ev) => {
        if (!ev.target.classList.contains('sim-note-input')) return;
        handleNoteInput(container, coefficients, ev.target);
    };

    container.addEventListener('input', onNoteEdit, { signal: abort.signal });
    container.addEventListener('change', onNoteEdit, { signal: abort.signal });

    container.addEventListener('blur', (ev) => {
        if (!ev.target.classList.contains('sim-note-input')) return;
        const val = ev.target.value;
        if (val !== '' && !Number.isNaN(parseFloat(val))) {
            const n = parseFloat(val);
            ev.target.value = Number.isInteger(n) ? String(n) : n.toFixed(2);
        }
        handleNoteInput(container, coefficients, ev.target);
    }, { capture: true, signal: abort.signal });

    container.querySelectorAll('.sim-calendar-item[data-sim-target]').forEach((item) => {
        const go = () => scrollToSimRow(container, item.dataset.simTarget);
        item.addEventListener('click', go);
        item.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                go();
            }
        });
    });

    container.querySelector('#sim-reset-notes')?.addEventListener('click', async () => {
        const value = await showPrompt({
            title: 'Remplir toutes les notes',
            message: 'Cette action remplace toutes les notes (réelle, min et max) par la valeur choisie.',
            label: 'Note / 20',
            defaultValue: '10',
            inputType: 'number',
            min: 0,
            max: 20,
            step: 0.25,
        });
        if (value === null) return;
        const clamped = clampNote(value);
        if (clamped === '') {
            showToast('Valeur invalide.', { variant: 'error' });
            return;
        }
        const str = String(clamped);
        const allIds = Object.values(coefficients.epreuves).flat().map((e) => e.id);
        const newNotes = {};
        for (const id of allIds) {
            newNotes[id] = { reelle: str, min: str, max: str };
        }
        saveState(newNotes, SIMULATOR_STORAGE_KEY);
        await mountSimulateur(container);
        showToast(`Toutes les notes ont été définies à ${str}/20.`);
    });

    if (didLastSaveFail()) {
        showToast('Attention : la dernière sauvegarde a échoué. Vérifiez l\'espace de stockage du navigateur.', { variant: 'error', duration: 8000 });
    }

    let examRefreshTimer = null;
    const scheduleExamRefresh = () => {
        if (!nextExam) return;
        const datetime = new Date(`${nextExam.date}T${nextExam.heure_debut}:00`);
        const ms = datetime - new Date() + 1000;
        if (ms > 0 && ms < 24 * 60 * 60 * 1000) {
            examRefreshTimer = setTimeout(() => {
                const el = container.querySelector('.sim-next-exam');
                if (el) el.outerHTML = renderNextExam(findNextExam(epreuves));
            }, ms);
        }
    };
    scheduleExamRefresh();

    const layoutMq = window.matchMedia('(max-width: 720px)');
    const onLayoutChange = () => {
        const mode = layoutMq.matches ? 'mobile' : 'desktop';
        if (container.dataset.layout !== mode) {
            saveState(collectNotes(container), SIMULATOR_STORAGE_KEY);
            mountSimulateur(container);
        }
    };
    layoutMq.addEventListener('change', onLayoutChange);

    container._simCleanup = () => {
        clearTimeout(examRefreshTimer);
        layoutMq.removeEventListener('change', onLayoutChange);
        abort.abort();
    };
}
