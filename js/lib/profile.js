import { loadState, PROFILE_STORAGE_KEY } from '../storage.js';

export const DEFAULT_PROFILE = {
    displayName: 'Élève',
    avatarUrl: '',
    candidat: 'libre',
    filiere: 'general',
    cycle: 'terminale',
    specialites: ['Mathématiques', 'Physique-chimie'],
    specialite_abandonnee: 'NSI',
    langues: { lva: 'Anglais', lvb: 'Hébreu' },
    headline: 'Profil : Candidat Libre — Parcours adapté Post-5e',
    objective: "Objectif : lire la fiche cours, parcourir le mode Apprendre, puis valider les QCM — précision avant vitesse.",
    apprentissage: {
        label: 'Parcours adapté (bilan neuropsy)',
        forces: ['Raisonnement logique et plans structurés', 'Analyse de problèmes nouveaux'],
        adaptations: [
            'Contenus par catégories explicites',
            'Pas de chronomètre — prendre le temps de développer',
            'Mode Apprendre avant les QCM',
        ],
    },
    simulatorHeadline: 'Bac général — Candidat libre, cycle terminale',
    simulatorSubline: 'Spécialités : Mathématiques & Physique-chimie · NSI abandonnée · Sans matière optionnelle',
    cycleHint: 'Candidat libre — toutes les épreuves en une session (40 % ponctuelles · 60 % finales)',
};

export function getProfile() {
    const stored = loadState(PROFILE_STORAGE_KEY);
    return { ...DEFAULT_PROFILE, ...stored, langues: { ...DEFAULT_PROFILE.langues, ...stored.langues } };
}

export function getDisplayName(profile = getProfile()) {
    return (profile.displayName || DEFAULT_PROFILE.displayName).trim() || DEFAULT_PROFILE.displayName;
}

export function getAvatarUrl(profile = getProfile()) {
    return profile.avatarUrl || '';
}

export function buildEpreuveLabels(profile) {
    const lva = profile.langues?.lva || 'LVA';
    const lvb = profile.langues?.lvb || 'LVB';
    const spe1 = profile.specialites?.[0] || 'Spécialité 1';
    const spe2 = profile.specialites?.[1] || 'Spécialité 2';
    const abandon = profile.specialite_abandonnee || 'Spécialité abandonnée';

    return {
        'ct-hg': 'Histoire-géographie',
        'ct-emc': 'EMC',
        'ct-lva': `LVA — ${lva}`,
        'ct-lvb': `LVB — ${lvb}`,
        'ct-ens-sci': 'Ens. scientifique',
        'ct-eps': 'EPS',
        'ct-spe-abandon': `Spécialité abandonnée — ${abandon}`,
        'ct-fr-ecrit': 'Français écrit',
        'ct-fr-oral': 'Français oral',
        'ct-spe-1': `Spécialité 1 — ${spe1}`,
        'ct-spe-2': `Spécialité 2 — ${spe2}`,
        'ct-philo': 'Philosophie',
        'ct-grand-oral': 'Grand oral',
    };
}

export function applyProfileToCoefficients(coefficients, profile) {
    const labels = buildEpreuveLabels(profile);
    const epreuves = structuredClone(coefficients.epreuves ?? coefficients.niveaux);

    for (const group of Object.values(epreuves)) {
        for (const e of group) {
            if (labels[e.id]) e.label = labels[e.id];
        }
    }

    return { ...coefficients, epreuves };
}

export function buildSimulatorSubline(profile) {
    const specs = profile.specialites?.join(' & ') || '';
    const abandon = profile.specialite_abandonnee
        ? `${profile.specialite_abandonnee} abandonnée`
        : 'sans spécialité abandonnée';
    return `Spécialités : ${specs} · ${abandon} · Sans matière optionnelle`;
}
