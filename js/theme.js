import { loadState, saveState } from './storage.js';

export const SETTINGS_STORAGE_KEY = 'bac-settings-v1';

const THEME_MODES = ['system', 'light', 'dark'];

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getThemeMode() {
    const settings = loadState(SETTINGS_STORAGE_KEY);
    const mode = settings.themeMode ?? settings.theme;
    if (mode === 'dark' || mode === 'light') return mode;
    if (mode === 'system') return 'system';
    return 'system';
}

export function getResolvedTheme() {
    const mode = getThemeMode();
    return mode === 'system' ? getSystemTheme() : mode;
}

export function setThemeMode(mode) {
    if (!THEME_MODES.includes(mode)) return;
    const settings = loadState(SETTINGS_STORAGE_KEY);
    settings.themeMode = mode;
    delete settings.theme;
    saveState(settings, SETTINGS_STORAGE_KEY);
    applyTheme();
}

export function applyTheme() {
    document.documentElement.dataset.theme = getResolvedTheme();
}

export function initTheme() {
    applyTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (getThemeMode() === 'system') applyTheme();
    });
}

export function getThemeModeLabel(mode) {
    const labels = { system: 'Système', light: 'Clair', dark: 'Sombre' };
    return labels[mode] ?? mode;
}
