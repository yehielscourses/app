import { parseNoteValue } from './notes.js';

/**
 * Calcule une moyenne pondérée à partir de notes résolues.
 */
export function computeAverage(entries) {
    let weightedSum = 0;
    let totalCoef = 0;
    let filledCoef = 0;

    for (const { coefficient, note, included = true } of entries) {
        totalCoef += coefficient;
        if (!included || note === null || Number.isNaN(note)) continue;
        weightedSum += note * coefficient;
        filledCoef += coefficient;
    }

    if (filledCoef === 0) {
        return { moyenne: null, totalCoef, filledCoef };
    }

    return { moyenne: weightedSum / filledCoef, totalCoef, filledCoef };
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
 * Résout la note à utiliser selon le scénario.
 * - reelle : uniquement les notes réelles connues
 * - min : note réelle si connue, sinon auto-évaluation basse
 * - max : note réelle si connue, sinon auto-évaluation haute
 */
function resolveNoteForScenario(noteEntry, scenario) {
    const reelle = parseNoteValue(noteEntry.reelle);
    const min = parseNoteValue(noteEntry.min);
    const max = parseNoteValue(noteEntry.max);

    if (scenario === 'reelle') {
        return { note: reelle, included: reelle !== null };
    }
    if (scenario === 'min') {
        const note = reelle !== null ? reelle : min;
        return { note, included: note !== null };
    }
    if (scenario === 'max') {
        const note = reelle !== null ? reelle : max;
        return { note, included: note !== null };
    }
    return { note: null, included: false };
}

/**
 * Collecte les entrées du simulateur avec les trois types de notes.
 */
export function collectSimulatorEntries(coefficients, notes, scenario = 'min') {
    const entries = [];
    const groups = coefficients.epreuves ?? coefficients.niveaux;

    for (const group of Object.values(groups)) {
        for (const epreuve of group) {
            const noteEntry = notes[epreuve.id] ?? { reelle: '', min: '', max: '' };
            const { note, included } = resolveNoteForScenario(noteEntry, scenario);

            if (!epreuve.required && !included) continue;

            entries.push({
                id: epreuve.id,
                label: epreuve.label,
                coefficient: epreuve.coefficient,
                note,
                included,
                reelle: parseNoteValue(noteEntry.reelle),
                min: parseNoteValue(noteEntry.min),
                max: parseNoteValue(noteEntry.max),
            });
        }
    }

    return entries;
}

export const SCENARIOS = [
    {
        id: 'reelle',
        label: 'Moyenne sur notes réelles',
        hint: 'Uniquement les épreuves dont la note officielle ou connue est renseignée.',
        mentionAllowed: false,
    },
    {
        id: 'min',
        label: 'Moyenne pessimiste',
        hint: 'Note réelle si connue, sinon la fourchette basse auto-évaluée.',
        mentionAllowed: true,
    },
    {
        id: 'max',
        label: 'Moyenne optimiste',
        hint: 'Note réelle si connue, sinon la fourchette haute auto-évaluée.',
        mentionAllowed: true,
    },
    {
        id: 'fourchette',
        label: 'Fourchette probable',
        hint: 'Entre la moyenne pessimiste et la moyenne optimiste (auto-évaluation).',
        mentionAllowed: false,
    },
];

export function computeAllAverages(coefficients, notes) {
    const minResult = computeAverage(collectSimulatorEntries(coefficients, notes, 'min'));
    const maxResult = computeAverage(collectSimulatorEntries(coefficients, notes, 'max'));
    const reelleResult = computeAverage(collectSimulatorEntries(coefficients, notes, 'reelle'));

    return {
        min: minResult,
        max: maxResult,
        reelle: reelleResult,
        fourchette: {
            low: minResult.moyenne,
            high: maxResult.moyenne,
            filledCoef: Math.max(minResult.filledCoef, maxResult.filledCoef),
            totalCoef: minResult.totalCoef,
        },
    };
}

/**
 * Épreuves éligibles au rattrapage (note réelle entre 8 et 10 exclu).
 */
export function findRattrapageCandidates(coefficients, notes) {
    const candidates = [];
    const groups = coefficients.epreuves ?? coefficients.niveaux;

    for (const group of Object.values(groups)) {
        for (const epreuve of group) {
            const noteEntry = notes[epreuve.id] ?? {};
            const reelle = parseNoteValue(noteEntry.reelle);
            if (reelle !== null && reelle >= 8 && reelle < 10) {
                candidates.push({ label: epreuve.label, note: reelle });
            }
        }
    }

    return candidates;
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
 * Formate le délai jusqu'à une date/heure.
 */
export function formatTimeUntil(targetDatetime, now = new Date()) {
    const diffMs = targetDatetime - now;
    if (diffMs <= 0) return { label: "C'est maintenant", short: 'maintenant' };

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) {
        const hPart = hours > 0 ? ` et ${hours} h` : '';
        return { label: `Dans ${days} jour${days > 1 ? 's' : ''}${hPart}`, short: `${days}j` };
    }
    if (hours > 0) {
        const mPart = minutes > 0 ? ` et ${minutes} min` : '';
        return { label: `Dans ${hours} h${mPart}`, short: `${hours}h` };
    }
    return { label: `Dans ${minutes} min`, short: `${minutes}min` };
}

/**
 * @deprecated Utiliser formatTimeUntil
 */
export function daysUntil(targetDate) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(targetDate + 'T00:00:00');
    return Math.round((target - now) / (1000 * 60 * 60 * 24));
}

/**
 * Associe une épreuve du calendrier à un id simulateur.
 */
export function mapExamToSimulatorId(exam) {
    const map = {
        hg: 'ct-hg',
        emc: 'ct-emc',
        lva: 'ct-lva',
        lvb: 'ct-lvb',
        'ens-sci': 'ct-ens-sci',
        eps: 'ct-eps',
        'spe-abandonnee': 'ct-spe-abandon',
        'francais-ecrit': 'ct-fr-ecrit',
        'francais-oral': 'ct-fr-oral',
        'spe-1': 'ct-spe-1',
        'spe-2': 'ct-spe-2',
        philo: 'ct-philo',
        'grand-oral': 'ct-grand-oral',
    };
    return map[exam.matiere] ?? null;
}
