import {
    findNextExam,
    formatDateFr,
    formatTimeUntil,
    mapExamToSimulatorId,
} from '../lib/grade-calculator.js';
import { navigate } from '../router.js';

function renderNextExam(epreuve) {
    if (!epreuve) {
        return `
            <div class="home-next-exam home-next-exam--done">
                <span class="material-symbols-rounded home-next-exam-icon" aria-hidden="true">event_available</span>
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
        <div class="home-next-exam" data-exam-id="${epreuve.id}">
            <span class="material-symbols-rounded home-next-exam-icon" aria-hidden="true">event</span>
            <div class="home-next-exam-body">
                <span class="home-next-exam-label">Prochaine épreuve — ${countdown.label}</span>
                <strong class="home-next-exam-title">${epreuve.nom}</strong>
                <p class="home-next-exam-meta">
                    ${formatDateFr(epreuve.date)} à ${epreuve.heure_debut}
                    ${epreuve.duree ? ` · ${epreuve.duree.replace(':', 'h')}` : ''}
                </p>
                ${epreuve.adresse ? `
                <p class="home-next-exam-location">
                    <span class="material-symbols-rounded" aria-hidden="true">location_on</span>
                    <span>${epreuve.adresse}</span>
                </p>` : ''}
            </div>
        </div>`;
}

function renderCalendarList(epreuves, nextExam) {
    return `
        <ul class="home-calendar-list">
            ${epreuves.map((e) => {
                const simId = mapExamToSimulatorId(e);
                const isNext = nextExam && e.id === nextExam.id;
                const isPast = new Date(`${e.date}T${e.heure_debut}:00`) < new Date();
                return `
                <li class="home-calendar-item${isNext ? ' home-calendar-item--next' : ''}${isPast ? ' home-calendar-item--past' : ''}"
                    ${simId ? `data-sim-target="${simId}" tabindex="0" role="button"` : ''}>
                    <time datetime="${e.date}">${formatDateFr(e.date)}</time>
                    <span class="home-calendar-time">${e.heure_debut}</span>
                    <span class="home-calendar-name">${e.nom}</span>
                    ${simId ? '<span class="home-calendar-link-hint">Saisir les notes</span>' : ''}
                </li>`;
            }).join('')}
        </ul>`;
}

export function createExamSection(epreuves) {
    const section = document.createElement('section');
    section.className = 'home-exams';
    section.setAttribute('aria-label', 'Calendrier des épreuves');

    const nextExam = findNextExam(epreuves);
    section.innerHTML = `
        <h2 class="home-section-title">
            <span class="material-symbols-rounded" aria-hidden="true">calendar_month</span>
            Épreuves
        </h2>
        ${renderNextExam(nextExam)}
        <details class="home-calendar">
            <summary>Calendrier complet (${epreuves.length} épreuves)</summary>
            ${renderCalendarList(epreuves, nextExam)}
        </details>
    `;

    section.querySelectorAll('.home-calendar-item[data-sim-target]').forEach((item) => {
        const go = () => {
            navigate('simulateur');
            window.dispatchEvent(new CustomEvent('navigate-sim-row', { detail: item.dataset.simTarget }));
        };
        item.addEventListener('click', go);
        item.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                go();
            }
        });
    });

    return section;
}

export async function loadEpreuves() {
    const res = await fetch(new URL('data/epreuves.json', document.baseURI));
    if (!res.ok) throw new Error('Impossible de charger les épreuves');
    return res.json();
}
