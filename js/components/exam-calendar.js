import {
    findNextExam,
    formatDateFr,
    mapExamToSimulatorId,
} from '../lib/grade-calculator.js';
import { navigate } from '../router.js';
import { renderNextExamCard } from './next-exam.js';
import { showToast } from './toast.js';

function renderCalendarList(epreuves, nextExam) {
    return `
        <ul class="home-calendar-list">
            ${epreuves.map((e) => {
                const simId = mapExamToSimulatorId(e);
                const isNext = nextExam && e.id === nextExam.id;
                const isPast = new Date(`${e.date}T${e.heure_debut}:00`) < new Date();
                const ariaLabel = simId
                    ? `Saisir les notes pour ${e.nom}, ${formatDateFr(e.date)}`
                    : undefined;
                return `
                <li class="home-calendar-item${isNext ? ' home-calendar-item--next' : ''}${isPast ? ' home-calendar-item--past' : ''}"
                    ${simId ? `data-sim-target="${simId}" tabindex="0" role="button"` : ''}
                    ${ariaLabel ? `aria-label="${ariaLabel.replace(/"/g, '&quot;')}"` : ''}>
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
        ${renderNextExamCard(nextExam)}
        <details class="home-calendar">
            <summary>Calendrier complet (${epreuves.length} épreuves)</summary>
            ${renderCalendarList(epreuves, nextExam)}
        </details>
    `;

    section.querySelectorAll('.home-calendar-item[data-sim-target]').forEach((item) => {
        const go = () => {
            navigate('simulateur');
            window.dispatchEvent(new CustomEvent('navigate-sim-row', { detail: item.dataset.simTarget }));
            showToast('Épreuve sélectionnée — saisissez vos notes ci-dessous.');
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
