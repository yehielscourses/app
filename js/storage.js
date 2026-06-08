export const TRACKER_STORAGE_KEY = 'bac-tracker-v2';
export const SIMULATOR_STORAGE_KEY = 'bac-simulateur-v1';
export const SETTINGS_STORAGE_KEY = 'bac-settings-v1';
export const PROFILE_STORAGE_KEY = 'bac-profile-v1';

let lastSaveFailed = false;

export function didLastSaveFail() {
    return lastSaveFailed;
}

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
        lastSaveFailed = false;
        return true;
    } catch {
        lastSaveFailed = true;
        return false;
    }
}

export function clearState(key = TRACKER_STORAGE_KEY) {
    try {
        localStorage.removeItem(key);
        lastSaveFailed = false;
        return true;
    } catch {
        lastSaveFailed = true;
        return false;
    }
}

/**
 * Ne conserve que les clés valides (ex. ids de notions).
 */
export function pruneState(state, validIds) {
    const valid = new Set(validIds);
    const pruned = {};
    for (const [id, value] of Object.entries(state)) {
        if (valid.has(id)) pruned[id] = value;
    }
    return pruned;
}
