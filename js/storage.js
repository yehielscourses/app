export const TRACKER_STORAGE_KEY = 'bac-tracker-v2';
export const SIMULATOR_STORAGE_KEY = 'bac-simulateur-v1';

export function loadState(key = TRACKER_STORAGE_KEY) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export function saveState(state, key = TRACKER_STORAGE_KEY) {
    try {
        localStorage.setItem(key, JSON.stringify(state));
    } catch { /* quota exceeded or private mode */ }
}

export function clearState(key = TRACKER_STORAGE_KEY) {
    try {
        localStorage.removeItem(key);
    } catch { /* ignore */ }
}
