import { loadState, saveState, clearState, PROFILE_STORAGE_KEY } from '../storage.js';
import { DEFAULT_PROFILE, getProfile, getDisplayName, getAvatarUrl } from '../lib/profile.js';
import { getThemeMode, setThemeMode, getThemeModeLabel } from '../theme.js';
import { downloadExport, readImportFile, importBundle } from '../lib/import-export.js';
import { showConfirm } from './modal.js';
import { showToast } from './toast.js';
import {
    TRACKER_STORAGE_KEY,
    SIMULATOR_STORAGE_KEY,
    SETTINGS_STORAGE_KEY,
} from '../storage.js';

let sheetEl = null;
let backdropEl = null;

function esc(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
}

function closeSheet() {
    if (!sheetEl) return;
    sheetEl.classList.remove('open');
    backdropEl?.classList.remove('open');
    document.body.classList.remove('settings-open');
    sheetEl.setAttribute('aria-hidden', 'true');
}

function openLegalPage(page) {
    closeSheet();
    window.dispatchEvent(new CustomEvent('open-legal-page', { detail: page }));
}

function renderProfileHeader(profile) {
    const name = getDisplayName(profile);
    const avatarUrl = getAvatarUrl(profile);
    return `
        <div class="settings-profile">
            <div class="settings-avatar-wrap">
                <div class="settings-avatar" id="settings-avatar-preview">
                    ${avatarUrl
                        ? `<img src="${esc(avatarUrl)}" alt="" class="settings-avatar-img">`
                        : `<span class="settings-avatar-fallback">${esc(name.charAt(0).toUpperCase())}</span>`}
                </div>
                <label class="settings-avatar-edit" aria-label="Changer la photo de profil">
                    <span class="material-symbols-rounded">photo_camera</span>
                    <input type="file" id="settings-avatar-input" accept="image/*" hidden>
                </label>
            </div>
            <p class="settings-greeting">Bonjour, ${esc(name)} !</p>
            <label class="settings-display-name-field">
                <span class="settings-display-name-label">Nom d'affichage</span>
                <input type="text" id="settings-display-name" value="${esc(name)}" maxlength="40">
            </label>
        </div>`;
}

function renderThemeSection() {
    const current = getThemeMode();
    const modes = ['system', 'light', 'dark'];
    return `
        <div class="settings-card">
            <h2 class="settings-card-title">Apparence</h2>
            <div class="settings-theme-options" role="radiogroup" aria-label="Thème">
                ${modes.map((mode) => `
                    <label class="settings-theme-option">
                        <input type="radio" name="theme-mode" value="${mode}" ${mode === current ? 'checked' : ''}>
                        <span class="material-symbols-rounded settings-theme-icon" aria-hidden="true">${
                            mode === 'system' ? 'brightness_auto' : mode === 'light' ? 'light_mode' : 'dark_mode'
                        }</span>
                        <span>${getThemeModeLabel(mode)}</span>
                    </label>
                `).join('')}
            </div>
        </div>`;
}

function renderSubjectsSection(profile) {
    return `
        <div class="settings-card">
            <h2 class="settings-card-title">Matières et coefficients</h2>
            <form class="settings-subjects-form" id="settings-subjects-form">
                <label class="settings-field">
                    <span class="settings-field-label">Statut</span>
                    <input type="text" id="settings-candidat" value="${esc(profile.candidat)}">
                </label>
                <label class="settings-field">
                    <span class="settings-field-label">Filière</span>
                    <input type="text" id="settings-filiere" value="${esc(profile.filiere)}">
                </label>
                <label class="settings-field">
                    <span class="settings-field-label">Cycle</span>
                    <input type="text" id="settings-cycle" value="${esc(profile.cycle)}">
                </label>
                <label class="settings-field">
                    <span class="settings-field-label">Spécialité 1</span>
                    <input type="text" id="settings-spe1" value="${esc(profile.specialites?.[0] ?? '')}">
                </label>
                <label class="settings-field">
                    <span class="settings-field-label">Spécialité 2</span>
                    <input type="text" id="settings-spe2" value="${esc(profile.specialites?.[1] ?? '')}">
                </label>
                <label class="settings-field">
                    <span class="settings-field-label">Spécialité abandonnée</span>
                    <input type="text" id="settings-spe-abandon" value="${esc(profile.specialite_abandonnee)}">
                </label>
                <label class="settings-field">
                    <span class="settings-field-label">LVA</span>
                    <input type="text" id="settings-lva" value="${esc(profile.langues?.lva ?? '')}">
                </label>
                <label class="settings-field">
                    <span class="settings-field-label">LVB</span>
                    <input type="text" id="settings-lvb" value="${esc(profile.langues?.lvb ?? '')}">
                </label>
                <button type="submit" class="btn-primary settings-save-btn">Enregistrer le parcours</button>
            </form>
        </div>`;
}

function renderDataSection() {
    return `
        <div class="settings-card">
            <h2 class="settings-card-title">Données</h2>
            <p class="settings-card-desc">Exportez ou importez votre progression, vos notes et vos paramètres.</p>
            <div class="settings-data-actions">
                <button type="button" class="settings-list-btn" id="settings-export">
                    <span class="material-symbols-rounded">download</span>
                    Exporter (JSON)
                </button>
                <label class="settings-list-btn settings-import-label">
                    <span class="material-symbols-rounded">upload</span>
                    Importer (JSON)
                    <input type="file" id="settings-import" accept="application/json,.json" hidden>
                </label>
            </div>
        </div>`;
}

function renderLinksSection() {
    const links = [
        { id: 'help', icon: 'help', label: 'Aide et commentaires' },
        { id: 'privacy', icon: 'shield', label: 'Politique de confidentialité' },
        { id: 'terms', icon: 'description', label: "Conditions d'utilisation" },
    ];
    return `
        <div class="settings-card settings-card--links">
            ${links.map((link) => `
                <button type="button" class="settings-link-item" data-legal="${link.id}">
                    <span class="material-symbols-rounded">${link.icon}</span>
                    <span>${link.label}</span>
                    <span class="material-symbols-rounded settings-link-chevron">chevron_right</span>
                </button>
            `).join('')}
        </div>`;
}

function saveDisplayName(sheet) {
    const input = sheet.querySelector('#settings-display-name');
    if (!input) return;
    const profile = getProfile();
    profile.displayName = input.value.trim() || DEFAULT_PROFILE.displayName;
    saveState(profile, PROFILE_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('profile-updated'));
}

function saveSubjectsForm(sheet) {
    const profile = getProfile();
    const next = {
        ...profile,
        candidat: sheet.querySelector('#settings-candidat').value.trim(),
        filiere: sheet.querySelector('#settings-filiere').value.trim(),
        cycle: sheet.querySelector('#settings-cycle').value.trim(),
        specialites: [
            sheet.querySelector('#settings-spe1').value.trim(),
            sheet.querySelector('#settings-spe2').value.trim(),
        ].filter(Boolean),
        specialite_abandonnee: sheet.querySelector('#settings-spe-abandon').value.trim(),
        langues: {
            lva: sheet.querySelector('#settings-lva').value.trim(),
            lvb: sheet.querySelector('#settings-lvb').value.trim(),
        },
    };
    next.simulatorSubline = `Spécialités : ${next.specialites.join(' & ')} · ${next.specialite_abandonnee ? next.specialite_abandonnee + ' abandonnée' : 'sans spécialité abandonnée'} · Sans matière optionnelle`;

    if (!saveState(next, PROFILE_STORAGE_KEY)) {
        showToast('Impossible de sauvegarder les paramètres.', { variant: 'error' });
        return;
    }
    window.dispatchEvent(new CustomEvent('profile-updated'));
    showToast('Parcours enregistré.');
}

function wireSheetEvents(sheet) {
    sheet.querySelector('.settings-close')?.addEventListener('click', closeSheet);

    sheet.querySelector('#settings-display-name')?.addEventListener('change', () => saveDisplayName(sheet));

    sheet.querySelector('#settings-avatar-input')?.addEventListener('change', (ev) => {
        const file = ev.target.files?.[0];
        if (!file) return;
        if (file.size > 500_000) {
            showToast('Image trop volumineuse (max 500 Ko).', { variant: 'error' });
            ev.target.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const profile = getProfile();
            profile.avatarUrl = reader.result;
            saveState(profile, PROFILE_STORAGE_KEY);
            window.dispatchEvent(new CustomEvent('profile-updated'));
            refreshSheetContent();
            showToast('Photo de profil mise à jour.');
        };
        reader.readAsDataURL(file);
        ev.target.value = '';
    });

    sheet.querySelectorAll('input[name="theme-mode"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                setThemeMode(radio.value);
                showToast(`Thème : ${getThemeModeLabel(radio.value)}.`);
            }
        });
    });

    sheet.querySelector('#settings-subjects-form')?.addEventListener('submit', (ev) => {
        ev.preventDefault();
        saveSubjectsForm(sheet);
    });

    sheet.querySelector('#settings-export')?.addEventListener('click', () => {
        downloadExport();
        showToast('Export téléchargé.');
    });

    sheet.querySelector('#settings-import')?.addEventListener('change', async (ev) => {
        const file = ev.target.files?.[0];
        if (!file) return;
        try {
            const bundle = await readImportFile(file);
            const ok = await showConfirm({
                title: 'Importer les données',
                message: 'Les données du fichier vont remplacer votre progression et vos notes actuelles. Continuer ?',
                confirmLabel: 'Importer',
                danger: true,
            });
            if (!ok) return;
            importBundle(bundle, { saveState });
            window.dispatchEvent(new CustomEvent('profile-updated'));
            refreshSheetContent();
            showToast('Import réussi.');
        } catch (err) {
            showToast(err.message || 'Import impossible.', { variant: 'error' });
        }
        ev.target.value = '';
    });

    sheet.querySelectorAll('[data-legal]').forEach((btn) => {
        btn.addEventListener('click', () => openLegalPage(btn.dataset.legal));
    });

    sheet.querySelector('#settings-logout')?.addEventListener('click', async () => {
        const ok = await showConfirm({
            title: 'Se déconnecter',
            message: 'Toutes vos données locales (progression, notes, paramètres) seront effacées. Continuer ?',
            confirmLabel: 'Se déconnecter',
            danger: true,
        });
        if (!ok) return;
        [TRACKER_STORAGE_KEY, SIMULATOR_STORAGE_KEY, SETTINGS_STORAGE_KEY, PROFILE_STORAGE_KEY].forEach(clearState);
        localStorage.removeItem('bac-tracker-collapse-v1');
        closeSheet();
        window.location.reload();
    });
}

function refreshSheetContent() {
    if (!sheetEl) return;
    const profile = getProfile();
    const scrollTop = sheetEl.querySelector('.settings-sheet-body')?.scrollTop ?? 0;
    const body = sheetEl.querySelector('.settings-sheet-body');
    if (!body) return;
    body.innerHTML = `
        ${renderProfileHeader(profile)}
        ${renderThemeSection()}
        ${renderSubjectsSection(profile)}
        ${renderDataSection()}
        ${renderLinksSection()}
        <div class="settings-card settings-card--logout">
            <button type="button" class="settings-logout-btn" id="settings-logout">
                <span class="material-symbols-rounded">logout</span>
                Se déconnecter
            </button>
        </div>
    `;
    body.scrollTop = scrollTop;
    wireSheetEvents(sheetEl);
}

function createSheet() {
    backdropEl = document.createElement('div');
    backdropEl.className = 'settings-backdrop';
    backdropEl.addEventListener('click', closeSheet);

    sheetEl = document.createElement('aside');
    sheetEl.className = 'settings-sheet';
    sheetEl.setAttribute('aria-label', 'Paramètres');
    sheetEl.setAttribute('aria-hidden', 'true');
    sheetEl.innerHTML = `
        <div class="settings-sheet-header">
            <button type="button" class="settings-close" aria-label="Fermer">
                <span class="material-symbols-rounded">close</span>
            </button>
        </div>
        <div class="settings-sheet-body"></div>
    `;

    document.body.append(backdropEl, sheetEl);
    refreshSheetContent();

    window.addEventListener('profile-updated', () => {
        if (sheetEl?.classList.contains('open')) refreshSheetContent();
    });

    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && sheetEl?.classList.contains('open')) closeSheet();
    });
}

export function initSettingsSheet() {
    if (!sheetEl) createSheet();
}

export function openSettingsSheet() {
    initSettingsSheet();
    refreshSheetContent();
    sheetEl.classList.add('open');
    backdropEl.classList.add('open');
    document.body.classList.add('settings-open');
    sheetEl.setAttribute('aria-hidden', 'false');
    sheetEl.querySelector('.settings-close')?.focus();
}

export function isSettingsOpen() {
    return sheetEl?.classList.contains('open') ?? false;
}
