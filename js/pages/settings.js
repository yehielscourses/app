import { loadState, saveState, PROFILE_STORAGE_KEY, SETTINGS_STORAGE_KEY } from '../storage.js';
import { DEFAULT_PROFILE } from '../lib/profile.js';
import { downloadExport, readImportFile, importBundle } from '../lib/import-export.js';
import { showConfirm } from '../components/modal.js';
import { showToast } from '../components/toast.js';

function esc(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
}

function renderField(id, label, value, { type = 'text', hint } = {}) {
    return `
        <label class="settings-field" for="${id}">
            <span class="settings-field-label">${label}</span>
            ${hint ? `<span class="settings-field-hint">${hint}</span>` : ''}
            <input type="${type}" id="${id}" name="${id}" value="${esc(value)}">
        </label>`;
}

export async function mountSettings(container) {
    const profile = { ...DEFAULT_PROFILE, ...loadState(PROFILE_STORAGE_KEY), langues: { ...DEFAULT_PROFILE.langues, ...loadState(PROFILE_STORAGE_KEY).langues } };

    container.className = 'container page-settings';
    container.innerHTML = `
        <h1>Paramètres du profil</h1>
        <p class="settings-intro">Personnalisez votre parcours. Les libellés du simulateur et du tracker s'adaptent à ces informations.</p>

        <form class="settings-form" id="settings-form">
            <fieldset class="settings-section">
                <legend>Parcours</legend>
                ${renderField('candidat', 'Statut', profile.candidat)}
                ${renderField('filiere', 'Filière', profile.filiere)}
                ${renderField('cycle', 'Cycle', profile.cycle)}
                ${renderField('specialite-1', 'Spécialité 1', profile.specialites?.[0] ?? '')}
                ${renderField('specialite-2', 'Spécialité 2', profile.specialites?.[1] ?? '')}
                ${renderField('specialite-abandonnee', 'Spécialité abandonnée', profile.specialite_abandonnee)}
            </fieldset>

            <fieldset class="settings-section">
                <legend>Langues vivantes</legend>
                ${renderField('lva', 'LVA', profile.langues?.lva ?? '')}
                ${renderField('lvb', 'LVB', profile.langues?.lvb ?? '')}
            </fieldset>

            <fieldset class="settings-section">
                <legend>Textes affichés</legend>
                ${renderField('headline', 'Titre du tracker', profile.headline)}
                ${renderField('objective', 'Objectif du tracker', profile.objective)}
                ${renderField('simulator-headline', 'Titre simulateur', profile.simulatorHeadline)}
                ${renderField('cycle-hint', 'Indication cycle terminale', profile.cycleHint)}
            </fieldset>

            <div class="settings-actions">
                <button type="submit" class="btn-primary">Enregistrer</button>
                <button type="button" class="btn-reset" id="settings-reset">Réinitialiser le profil</button>
            </div>
        </form>

        <section class="settings-section settings-data">
            <h2>Données</h2>
            <p>Exportez ou importez votre progression, vos notes et vos paramètres.</p>
            <div class="settings-data-actions">
                <button type="button" class="btn-primary" id="export-data">Exporter (JSON)</button>
                <label class="btn-reset settings-import-label">
                    Importer (JSON)
                    <input type="file" id="import-data" accept="application/json,.json" hidden>
                </label>
            </div>
        </section>
    `;

    container.querySelector('#settings-form').addEventListener('submit', (ev) => {
        ev.preventDefault();
        const form = ev.target;
        const next = {
            candidat: form.querySelector('#candidat').value.trim(),
            filiere: form.querySelector('#filiere').value.trim(),
            cycle: form.querySelector('#cycle').value.trim(),
            specialites: [
                form.querySelector('#specialite-1').value.trim(),
                form.querySelector('#specialite-2').value.trim(),
            ].filter(Boolean),
            specialite_abandonnee: form.querySelector('#specialite-abandonnee').value.trim(),
            langues: {
                lva: form.querySelector('#lva').value.trim(),
                lvb: form.querySelector('#lvb').value.trim(),
            },
            headline: form.querySelector('#headline').value.trim(),
            objective: form.querySelector('#objective').value.trim(),
            simulatorHeadline: form.querySelector('#simulator-headline').value.trim(),
            cycleHint: form.querySelector('#cycle-hint').value.trim(),
        };
        next.simulatorSubline = `Spécialités : ${next.specialites.join(' & ')} · ${next.specialite_abandonnee ? next.specialite_abandonnee + ' abandonnée' : 'sans spécialité abandonnée'} · Sans matière optionnelle`;

        if (!saveState(next, PROFILE_STORAGE_KEY)) {
            showToast('Impossible de sauvegarder les paramètres.', { variant: 'error' });
            return;
        }

        window.dispatchEvent(new CustomEvent('profile-updated'));
        showToast('Paramètres enregistrés.');
    });

    container.querySelector('#settings-reset').addEventListener('click', async () => {
        const ok = await showConfirm({
            title: 'Réinitialiser le profil',
            message: 'Restaurer les valeurs par défaut du profil ? Vos notes et progression ne seront pas effacées.',
            confirmLabel: 'Réinitialiser',
            danger: true,
        });
        if (!ok) return;
        saveState(DEFAULT_PROFILE, PROFILE_STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('profile-updated'));
        await mountSettings(container);
        showToast('Profil réinitialisé.');
    });

    container.querySelector('#export-data').addEventListener('click', () => {
        downloadExport();
        showToast('Export téléchargé.');
    });

    container.querySelector('#import-data').addEventListener('change', async (ev) => {
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
            showToast('Import réussi.');
        } catch (err) {
            showToast(err.message || 'Import impossible.', { variant: 'error' });
        }
        ev.target.value = '';
    });
}
