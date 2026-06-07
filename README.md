# Bac Tracker

Application web vanilla pour préparer le baccalauréat : suivi des notions, cours, exercices et simulation de moyenne.

**Profil cible initial :** Bac général Maths & Physique-Chimie (candidat libre).

## Fonctionnalités

| Onglet | Description |
|--------|-------------|
| **Tracker** | Cocher les notions maîtrisées, progression globale et par section |
| **Cours** | Parcourir les cours par matière et chapitre |
| **Exercices** | Consulter et filtrer les exercices par matière |
| **Simulateur** | Estimer sa moyenne au bac selon les coefficients officiels |

## Stack

- HTML, CSS et JavaScript vanilla — aucune dépendance de build
- Données statiques en JSON (`data/`)
- Persistance locale via `localStorage` (progression du tracker, notes du simulateur)
- [MathJax](https://www.mathjax.org/) (CDN) pour les formules mathématiques

## Lancement en local

Un serveur HTTP local est nécessaire pour charger les fichiers JSON (`fetch`).

```bash
# Python
python -m http.server 8000

# ou Node (npx)
npx serve .
```

Puis ouvrir [http://localhost:8000](http://localhost:8000).

## Structure du projet

```
.
├── index.html              # Point d'entrée
├── README.md
│
├── assets/
│   ├── icons/              # Icônes SVG
│   └── images/             # Images optionnelles
│
├── css/
│   ├── variables.css       # Couleurs, espacements, typographie
│   ├── base.css            # Reset, layout global
│   ├── components.css      # Onglets, cartes, badges, barres de progression
│   └── pages.css           # Styles spécifiques par onglet
│
├── data/                   # Données statiques (chargées via fetch)
│   ├── matieres.json       # Liste des matières
│   ├── notions.json        # Notions par section / chapitre (tracker)
│   ├── cours.json          # Contenu des cours
│   ├── exercices.json      # Banque d'exercices
│   └── coefficients.json   # Coefficients officiels du bac
│
└── js/
    ├── app.js              # Initialisation de l'application
    ├── router.js           # Navigation entre onglets
    ├── storage.js          # Accès localStorage
    ├── components/
    │   ├── tabs.js         # Barre d'onglets
    │   ├── progress-bar.js # Barre de progression
    │   └── notion-card.js  # Carte notion (checkbox + label)
    └── pages/
        ├── tracker.js      # Onglet Tracker
        ├── cours.js        # Onglet Cours
        ├── exercices.js    # Onglet Exercices
        └── simulateur.js   # Onglet Simulateur
```

## Données

Les fichiers JSON dans `data/` sont la source de vérité pour le contenu pédagogique.

- `data/notions.json` — 39 notions Maths & PC en 8 sections (Phase 0 → Bloc 6 + transversales)
- La progression est sauvegardée dans `localStorage` (clé `bac-tracker-v2`, compatible avec l'ancien fichier HTML)

## Roadmap

- [x] Squelette HTML/CSS avec navigation par onglets
- [x] Migration du tracker vers `data/notions.json`
- [ ] Contenu cours et exercices
- [ ] Simulateur avec coefficients officiels
