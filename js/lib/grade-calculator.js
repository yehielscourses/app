/**
 * Calcule la moyenne pondérée à partir des notes saisies.
 * @param {Array<{ coefficient: number, note: number|null }>} entries
 * @returns {{ moyenne: number|null, totalCoef: number, filledCoef: number }}
 */
export function computeAverage(entries) {
    let weightedSum = 0;
    let totalCoef = 0;
    let filledCoef = 0;

    for (const { coefficient, note } of entries) {
        totalCoef += coefficient;
        if (note !== null && note !== '' && !Number.isNaN(note)) {
            weightedSum += note * coefficient;
            filledCoef += coefficient;
        }
    }

    if (filledCoef === 0) {
        return { moyenne: null, totalCoef, filledCoef };
    }

    return {
        moyenne: weightedSum / filledCoef,
        totalCoef,
        filledCoef,
    };
}

/**
 * Retourne la mention correspondant à une moyenne /20.
 */
export function getMention(moyenne) {
    if (moyenne === null || Number.isNaN(moyenne)) return null;
    if (moyenne >= 16) return { label: 'Très bien', class: 'mention-tb' };
    if (moyenne >= 14) return { label: 'Bien', class: 'mention-b' };
    if (moyenne >= 12) return { label: 'Assez bien', class: 'mention-ab' };
    if (moyenne >= 10) return { label: 'Passable', class: 'mention-p' };
    return { label: 'Insuffisant', class: 'mention-i' };
}

/**
 * Collecte toutes les épreuves du simulateur (hors options non renseignées).
 */
export function collectSimulatorEntries(coefficients, notes) {
    const entries = [];

    for (const niveau of Object.values(coefficients.niveaux)) {
        for (const group of Object.values(niveau)) {
            for (const epreuve of group) {
                const raw = notes[epreuve.id];
                const note = raw === undefined || raw === '' ? null : parseFloat(raw);
                if (!epreuve.required && (note === null || Number.isNaN(note))) continue;
                entries.push({ coefficient: epreuve.coefficient, note });
            }
        }
    }

    return entries;
}

/**
 * Trouve la prochaine épreuve à venir.
 */
export function findNextExam(epreuves, now = new Date()) {
    const upcoming = epreuves
        .filter((e) => e.date && e.heure_debut)
        .map((e) => ({
            ...e,
            datetime: new Date(`${e.date}T${e.heure_debut}:00`),
        }))
        .filter((e) => e.datetime >= now)
        .sort((a, b) => a.datetime - b.datetime);

    return upcoming[0] ?? null;
}

/**
 * Formate une date en français.
 */
export function formatDateFr(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

/**
 * Calcule le délai jusqu'à une date.
 */
export function daysUntil(targetDate) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(targetDate + 'T00:00:00');
    return Math.round((target - now) / (1000 * 60 * 60 * 24));
}
