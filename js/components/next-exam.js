import { formatDateFr, formatTimeUntil } from '../lib/grade-calculator.js';

export function renderNextExamCard(epreuve, { cssPrefix = 'home-next-exam' } = {}) {
    if (!epreuve) {
        return `
            <div class="${cssPrefix} ${cssPrefix}--done">
                <span class="material-symbols-rounded ${cssPrefix}-icon" aria-hidden="true">event_available</span>
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
        <div class="${cssPrefix}" data-exam-id="${epreuve.id}">
            <span class="material-symbols-rounded ${cssPrefix}-icon" aria-hidden="true">event</span>
            <div class="${cssPrefix}-body">
                <span class="${cssPrefix}-label">Prochaine épreuve — ${countdown.label}</span>
                <strong class="${cssPrefix}-title">${epreuve.nom}</strong>
                <p class="${cssPrefix}-meta">
                    ${formatDateFr(epreuve.date)} à ${epreuve.heure_debut}
                    ${epreuve.duree ? ` · ${epreuve.duree.replace(':', 'h')}` : ''}
                </p>
                ${epreuve.adresse ? `
                <p class="${cssPrefix}-location">
                    <span class="material-symbols-rounded" aria-hidden="true">location_on</span>
                    <span>${epreuve.adresse}</span>
                </p>` : ''}
            </div>
        </div>`;
}
