/**
 * Normalise la structure des notes du simulateur.
 * Ancien format : { "ct-spe-1": "15" }
 * Nouveau format : { "ct-spe-1": { reelle: "15", min: "12", max: "17" } }
 */
export function normalizeNoteEntry(raw) {
    if (raw === null || raw === undefined || raw === '') {
        return { reelle: '', min: '', max: '' };
    }
    if (typeof raw === 'string' || typeof raw === 'number') {
        return { reelle: String(raw), min: '', max: '' };
    }
    return {
        reelle: raw.reelle ?? '',
        min: raw.min ?? '',
        max: raw.max ?? '',
    };
}

export function normalizeNotes(stored) {
    const out = {};
    for (const [id, raw] of Object.entries(stored ?? {})) {
        out[id] = normalizeNoteEntry(raw);
    }
    return out;
}

export function parseNoteValue(raw) {
    if (raw === undefined || raw === null || raw === '') return null;
    const n = parseFloat(raw);
    return Number.isNaN(n) ? null : n;
}
