import { TRACKER_STORAGE_KEY, SIMULATOR_STORAGE_KEY, SETTINGS_STORAGE_KEY, PROFILE_STORAGE_KEY } from '../storage.js';

export const EXPORT_VERSION = 1;

export function buildExportBundle() {
    const bundle = {
        version: EXPORT_VERSION,
        exportedAt: new Date().toISOString(),
        data: {},
    };

    for (const key of [TRACKER_STORAGE_KEY, SIMULATOR_STORAGE_KEY, SETTINGS_STORAGE_KEY, PROFILE_STORAGE_KEY]) {
        const raw = localStorage.getItem(key);
        if (raw) {
            try {
                bundle.data[key] = JSON.parse(raw);
            } catch {
                bundle.data[key] = raw;
            }
        }
    }

    return bundle;
}

export function downloadExport() {
    const bundle = buildExportBundle();
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bac-tracker-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export function importBundle(bundle, { saveState } = {}) {
    if (!bundle || typeof bundle !== 'object') {
        throw new Error('Fichier invalide');
    }

    const data = bundle.data ?? bundle;
    const allowed = new Set([
        TRACKER_STORAGE_KEY,
        SIMULATOR_STORAGE_KEY,
        SETTINGS_STORAGE_KEY,
        PROFILE_STORAGE_KEY,
    ]);

    let count = 0;
    for (const [key, value] of Object.entries(data)) {
        if (!allowed.has(key)) continue;
        saveState(value, key);
        count++;
    }

    if (count === 0) {
        throw new Error('Aucune donnée reconnue dans ce fichier');
    }

    return count;
}

export function readImportFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                resolve(JSON.parse(reader.result));
            } catch {
                reject(new Error('JSON invalide'));
            }
        };
        reader.onerror = () => reject(new Error('Lecture du fichier impossible'));
        reader.readAsText(file);
    });
}
