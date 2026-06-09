import { createFocusTrap } from '../lib/focus-trap.js';

const PAGES = {
    help: {
        title: 'Aide et commentaires',
        content: `
            <p>Bac Tracker vous aide à préparer le baccalauréat en suivant vos notions, vos cours et vos notes.</p>
            <h3>Utilisation</h3>
            <ul>
                <li><strong><a href="#home">Accueil</a></strong> — Suivez votre progression et consultez les dates des épreuves.</li>
                <li><strong><a href="#cours">Cours</a></strong> — Accédez aux cours par matière (bientôt disponible).</li>
                <li><strong><a href="#exercices">Exercices</a></strong> — Entraînez-vous avec des exercices (bientôt disponible).</li>
                <li><strong><a href="#simulateur">Simulateur</a></strong> — Simulez votre moyenne au bac.</li>
            </ul>
            <p>Pour toute question ou suggestion, contactez-nous à <a href="mailto:feedback@bac-tracker.app">feedback@bac-tracker.app</a>.</p>
        `,
    },
    privacy: {
        title: 'Politique de confidentialité',
        content: `
            <p>Bac Tracker est une application locale. Vos données (progression, notes, profil) sont stockées uniquement dans le navigateur de votre appareil via <code>localStorage</code>.</p>
            <p>Aucune donnée personnelle n'est transmise à un serveur tiers, sauf les polices et bibliothèques chargées depuis des CDN (Google Fonts, MathJax) lorsque vous êtes en ligne.</p>
            <p>Vous pouvez exporter ou supprimer vos données à tout moment depuis les paramètres.</p>
        `,
    },
    terms: {
        title: "Conditions d'utilisation",
        content: `
            <p>Bac Tracker est fourni à titre informatif pour la préparation au baccalauréat. Les calculs de moyenne et les dates d'épreuves sont indicatifs et peuvent ne pas refléter les règles officielles de votre académie.</p>
            <p>L'application est fournie « en l'état », sans garantie. L'utilisateur est responsable de la sauvegarde de ses données.</p>
        `,
    },
};

let overlayEl = null;
let focusTrap = null;
let openTrigger = null;

function closeLegal() {
    focusTrap?.release();
    focusTrap = null;
    overlayEl?.classList.remove('open');
    document.body.classList.remove('legal-open');
    if (openTrigger?.focus) openTrigger.focus();
    openTrigger = null;
}

export function initLegalPages() {
    if (overlayEl) return;

    overlayEl = document.createElement('div');
    overlayEl.className = 'legal-overlay';
    overlayEl.innerHTML = `
        <div class="legal-panel" role="dialog" aria-modal="true" aria-labelledby="legal-title">
            <header class="legal-header">
                <button type="button" class="legal-back m3-state-layer" aria-label="Retour">
                    <span class="material-symbols-rounded">arrow_back</span>
                </button>
                <h2 class="legal-title" id="legal-title"></h2>
            </header>
            <div class="legal-body"></div>
        </div>
    `;
    document.body.append(overlayEl);

    const panel = overlayEl.querySelector('.legal-panel');

    overlayEl.querySelector('.legal-back').addEventListener('click', closeLegal);
    overlayEl.addEventListener('click', (ev) => {
        if (ev.target === overlayEl) closeLegal();
    });

    overlayEl.querySelector('.legal-body').addEventListener('click', (ev) => {
        const link = ev.target.closest('a[href^="#"]');
        if (!link) return;
        ev.preventDefault();
        const route = link.getAttribute('href').replace(/^#\/?/, '');
        closeLegal();
        location.hash = route;
    });

    window.addEventListener('open-legal-page', (ev) => {
        const page = PAGES[ev.detail];
        if (!page) return;
        openTrigger = document.activeElement;
        overlayEl.querySelector('.legal-title').textContent = page.title;
        overlayEl.querySelector('.legal-body').innerHTML = page.content;
        overlayEl.classList.add('open');
        document.body.classList.add('legal-open');
        focusTrap?.release();
        focusTrap = createFocusTrap(panel, {
            onEscape: closeLegal,
            initialFocus: overlayEl.querySelector('.legal-back'),
        });
    });
}
