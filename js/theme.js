import { loadState, saveState } from './storage.js';

export const SETTINGS_STORAGE_KEY = 'bac-settings-v1';

export function getTheme() {
    const settings = loadState(SETTINGS_STORAGE_KEY);
    return settings.theme === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme) {
    const settings = loadState(SETTINGS_STORAGE_KEY);
    settings.theme = theme;
    saveState(settings, SETTINGS_STORAGE_KEY);
    applyTheme(theme);
}

export function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}

export function toggleTheme() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
}

export function initTheme() {
    applyTheme(getTheme());
}

export function createThemeToggle() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Basculer le mode sombre');

    function updateLabel(theme) {
        const isDark = theme === 'dark';
        btn.textContent = isDark ? '☀️ Clair' : '🌙 Sombre';
        btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }

    updateLabel(getTheme());
    btn.addEventListener('click', () => updateLabel(toggleTheme()));

    return btn;
}
