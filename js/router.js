import { mountTracker, invalidateTrackerCache } from './pages/tracker.js';
import { mountCours } from './pages/cours.js';
import { mountExercices } from './pages/exercices.js';
import { mountSimulateur, invalidateSimulateurCache } from './pages/simulateur.js';
import { mountSettings } from './pages/settings.js';
import { showLoading } from './components/loading.js';

const ROUTES = {
    tracker: mountTracker,
    cours: mountCours,
    exercices: mountExercices,
    simulateur: mountSimulateur,
    settings: mountSettings,
};

const DEFAULT_ROUTE = 'tracker';

const mounted = new Set();
const panels = new Map();
let parentEl = null;
let activeRoute = null;

export function getRouteFromHash() {
    const hash = location.hash.replace(/^#\/?/, '');
    if (hash === 'settings') return 'settings';
    return ROUTES[hash] ? hash : DEFAULT_ROUTE;
}

export function navigate(route) {
    const target = ROUTES[route] ? route : (route === 'settings' ? 'settings' : DEFAULT_ROUTE);
    const hash = target === 'settings' ? 'settings' : target;
    if (location.hash !== `#${hash}`) {
        location.hash = hash;
    }
    return target;
}

export function invalidateRoute(route) {
    mounted.delete(route);
}

function getOrCreatePanel(route) {
    if (panels.has(route)) return panels.get(route);

    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.id = `panel-${route}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${route}`);
    panel.hidden = true;
    panel.tabIndex = 0;
    parentEl.append(panel);
    panels.set(route, panel);
    return panel;
}

export async function renderRoute(route, container) {
    parentEl = container;
    const target = ROUTES[route] ? route : (route === 'settings' ? 'settings' : DEFAULT_ROUTE);

    for (const [name, panel] of panels) {
        panel.hidden = name !== target;
    }

    const panel = getOrCreatePanel(target);

    if (!mounted.has(target)) {
        showLoading(panel);
        try {
            await ROUTES[target](panel);
            mounted.add(target);
        } catch (err) {
            console.error(err);
            panel.innerHTML = `
                <div class="page-placeholder">
                    <div class="page-placeholder-icon">⚠️</div>
                    <h2>Erreur</h2>
                    <p>Une erreur est survenue lors du chargement de cette page.</p>
                </div>`;
        }
    }

    panel.hidden = false;
    activeRoute = target;
    return target;
}

export function openSettings() {
    return renderRoute('settings', parentEl).then(() => {
        if (location.hash !== '#settings') location.hash = 'settings';
        return 'settings';
    });
}

async function refreshDataRoutes() {
    invalidateSimulateurCache();
    invalidateTrackerCache();
    for (const route of ['simulateur', 'tracker']) {
        if (!mounted.has(route)) continue;
        invalidateRoute(route);
        if (activeRoute === route && parentEl) {
            await renderRoute(route, parentEl);
        }
    }
}

window.addEventListener('profile-updated', () => {
    refreshDataRoutes();
});
