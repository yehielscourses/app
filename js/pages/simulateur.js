import { loadState, saveState, SIMULATOR_STORAGE_KEY } from '../storage.js';
import {
    computeAverage,
    getMention,
    collectSimulatorEntries,
    findNextExam,
    formatDateFr,
    daysUntil,
} from '../lib/grade-calculator.js';

const GROUP_LABELS = {
    controle_continu: { short: 'CO', full: 'Contrôle continu', class: 'sim-group-co' },
    epreuves_finales: { short: 'ÉPREUVES FINALES', full: 'Épreuves finales', class: 'sim-group-finales' },
};

function clampNote(value) {
    if (value === '' || value === null || value === undefined) return '';
    const n = parseFloat(value);
    if (Number.isNaN(n)) return '';
    return Math.min(20, Math.max(0, n));
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

    const days = daysUntil(epreuve.date);
    const countdown = days === 0
        ? "Aujourd'hui"
        : days === 1
            ? 'Demain'
            : `Dans ${days} jours`;

    return `
        <div class="sim-next-exam">
            <span class="sim-next-exam-icon">📅</span>
            <div class="sim-next-exam-body">
                <span class="sim-next-exam-label">Prochaine épreuve — ${countdown}</span>
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

function renderGroupTables(groupKey, epreuves, notes) {
    const meta = GROUP_LABELS[groupKey];
    const rows = epreuves.map((e) => {
        const required = e.required;
        const value = notes[e.id] !== undefined && notes[e.id] !== '' ? notes[e.id] : '';
        return `
            <tr class="sim-row${required ? '' : ' sim-row--optional'}">
                <td class="sim-cell-label">
                    ${required ? '<span class="sim-required">*</span>' : ''}
                    ${e.label}
                </td>
                <td class="sim-cell-coef">${e.coefficient}</td>
                <td class="sim-cell-note">
                    <input
                        type="number"
                        class="sim-note-input"
                        data-id="${e.id}"
                        min="0"
                        max="20"
                        step="0.25"
                        placeholder="—"
                        value="${value}"
                        aria-label="Note pour ${e.label}"
                    >
                </td>
            </tr>`;
    }).join('');

    return `
        <div class="sim-block">
            <table class="sim-table">
                <thead>
                    <tr>
                        <th class="sim-th-group"></th>
                        <th class="sim-th-label">Matière</th>
                        <th class="sim-th-coef">Coef.</th>
                        <th class="sim-th-note">Note / 20</th>
                    </tr>
                </thead>
                <tbody>
                    ${epreuves.map((e, i) => {
                        const required = e.required;
                        const value = notes[e.id] !== undefined && notes[e.id] !== '' ? notes[e.id] : '';
                        return `
                            <tr class="sim-row${required ? '' : ' sim-row--optional'}">
                                ${i === 0 ? `<td class="sim-group-label ${meta.class}" rowspan="${epreuves.length}">
                                    <span class="sim-group-short">${meta.short}</span>
                                </td>` : ''}
                                <td class="sim-cell-label">
                                    ${required ? '<span class="sim-required">*</span>' : ''}
                                    ${e.label}
                                </td>
                                <td class="sim-cell-coef">${e.coefficient}</td>
                                <td class="sim-cell-note">
                                    <input
                                        type="number"
                                        class="sim-note-input"
                                        data-id="${e.id}"
                                        min="0"
                                        max="20"
                                        step="0.25"
                                        placeholder="—"
                                        value="${value}"
                                        aria-label="Note pour ${e.label}"
                                    >
                                </td>
                            </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
}

function renderCycleTerminale(epreuvesData, notes) {
    const blocks = ['controle_continu', 'epreuves_finales']
        .map((key) => renderGroupTables(key, epreuvesData[key], notes))
        .join('');

    return `
        <section class="sim-niveau" data-cycle="terminale">
            <h2 class="sim-niveau-title">Cycle terminale</h2>
            <p class="sim-cycle-hint">Candidat libre — toutes les épreuves en une session (40 % ponctuelles · 60 % finales)</p>
            ${blocks}
        </section>`;
}

function renderSummary(moyenne, filledCoef, totalCoef) {
    const mention = getMention(moyenne);
    const moyenneStr = moyenne !== null ? moyenne.toFixed(2) : '—';
    const progress = totalCoef > 0 ? Math.round((filledCoef / totalCoef) * 100) : 0;

    return `
        <div class="sim-summary">
            <div class="sim-summary-main">
                <span class="sim-summary-label">Moyenne générale</span>
                <span class="sim-summary-score">${moyenneStr}<span class="sim-summary-unit">/20</span></span>
                ${mention ? `<span class="sim-mention ${mention.class}">${mention.label}</span>` : ''}
            </div>
            <div class="sim-summary-meta">
                <span>${filledCoef} / ${totalCoef} coef. renseignés (${progress} %)</span>
                <span class="sim-summary-hint">Total bac : 100 coef.</span>
            </div>
        </div>`;
}

function updateSummary(root, coefficients, notes) {
    const entries = collectSimulatorEntries(coefficients, notes);
    const { moyenne, totalCoef, filledCoef } = computeAverage(entries);
    const summaryEl = root.querySelector('.sim-summary');
    if (summaryEl) {
        summaryEl.outerHTML = renderSummary(moyenne, filledCoef, totalCoef);
    }
}

function collectNotes(root) {
    const notes = {};
    root.querySelectorAll('.sim-note-input').forEach((input) => {
        const id = input.dataset.id;
        notes[id] = input.value;
    });
    return notes;
}

export async function mountSimulateur(container) {
    container.className = 'container page-simulateur';

    let coefficients, epreuves;
    try {
        const [coefRes, eprRes] = await Promise.all([
            fetch(new URL('data/coefficients.json', document.baseURI)),
            fetch(new URL('data/epreuves.json', document.baseURI)),
        ]);
        if (!coefRes.ok || !eprRes.ok) throw new Error('Chargement impossible');
        coefficients = await coefRes.json();
        epreuves = await eprRes.json();
    } catch {
        container.innerHTML = `
            <div class="page-placeholder">
                <div class="page-placeholder-icon">⚠️</div>
                <h2>Erreur de chargement</h2>
                <p>Impossible de charger les données du simulateur.</p>
            </div>`;
        return;
    }

    const notes = loadState(SIMULATOR_STORAGE_KEY);
    const nextExam = findNextExam(epreuves);
    const entries = collectSimulatorEntries(coefficients, notes);
    const { moyenne, totalCoef, filledCoef } = computeAverage(entries);

    container.innerHTML = `
        <h1>Simulateur de note</h1>
        <div class="profile-box">
            <p>Bac général — Candidat libre, cycle terminale</p>
            <p>Spécialités : Mathématiques &amp; Physique-chimie · NSI abandonnée · Sans matière optionnelle</p>
        </div>
        ${renderNextExam(nextExam)}
        ${renderSummary(moyenne, filledCoef, totalCoef)}
        ${renderCycleTerminale(coefficients.epreuves, notes)}
        <details class="sim-calendar">
            <summary>Calendrier complet des épreuves (${epreuves.length})</summary>
            <ul class="sim-calendar-list">
                ${epreuves.map((e) => `
                    <li class="sim-calendar-item${nextExam && e.id === nextExam.id ? ' sim-calendar-item--next' : ''}">
                        <time datetime="${e.date}">${formatDateFr(e.date)}</time>
                        <span class="sim-calendar-time">${e.heure_debut}</span>
                        <span class="sim-calendar-name">${e.nom}</span>
                        ${e.adresse ? `<span class="sim-calendar-address">📍 ${e.adresse}</span>` : ''}
                    </li>
                `).join('')}
            </ul>
        </details>
    `;

    container.addEventListener('input', (ev) => {
        if (!ev.target.classList.contains('sim-note-input')) return;

        const clamped = clampNote(ev.target.value);
        if (clamped !== '' && String(clamped) !== ev.target.value) {
            ev.target.value = clamped;
        }

        const currentNotes = collectNotes(container);
        saveState(currentNotes, SIMULATOR_STORAGE_KEY);
        updateSummary(container, coefficients, currentNotes);
    });

    container.addEventListener('blur', (ev) => {
        if (!ev.target.classList.contains('sim-note-input')) return;
        const val = ev.target.value;
        if (val !== '' && !Number.isNaN(parseFloat(val))) {
            const n = parseFloat(val);
            ev.target.value = Number.isInteger(n) ? String(n) : n.toFixed(2);
        }
    }, true);
}
