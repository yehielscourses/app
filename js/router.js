import { TAB_LABELS } from './components/app-nav.js';
import { mountTracker, invalidateTrackerCache } from './pages/tracker.js';
import { mountCours } from './pages/cours.js';
import { mountExercices } from './pages/exercices.js';
import { mountSimulateur, invalidateSimulateurCache } from './pages/simulateur.js';
import { showLoading } from './components/loading.js';

const ROUTES = {
    home: mountTracker,
    tracker: mountTracker,
    cours: mountCours,
    exercices: mountExercices,
    simulateur: mountSimulateur,
};

const DEFAULT_ROUTE = 'home';

const mounted = new Set();
const panels = new Map();
let parentEl = null;
let activeRoute = null;

function normalizeRoute(hash) {
    if (hash === 'tracker') return 'home';
    return ROUTES[hash] ? hash : DEFAULT_ROUTE;
}

export function getRouteFromHash() {
    const hash = location.hash.replace(/^#\/?/, '');
    const top = hash.split('/')[0] || '';
    return normalizeRoute(top);
}

export function navigate(route) {
    const target = normalizeRoute(route);
    const current = location.hash.replace(/^#\/?/, '');
    const [currentTop, ...subParts] = current.split('/');

    if (currentTop === target && subParts.length > 0) {
        return target;
    }

    if (current !== target) {
        location.hash = target;
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
    panel.setAttribute('aria-label', TAB_LABELS[route] ?? route);
    panel.hidden = true;
    panel.tabIndex = 0;
    parentEl.append(panel);
    panels.set(route, panel);
    return panel;
}

export async function renderRoute(route, container) {
    parentEl = container;
    const target = normalizeRoute(route);

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
                    <span class="material-symbols-rounded page-placeholder-icon">warning</span>
                    <h2>Erreur</h2>
                    <p>Une erreur est survenue lors du chargement de cette page.</p>
                </div>`;
        }
    }

    panel.hidden = false;
    activeRoute = target;
    return target;
}

async function refreshDataRoutes() {
    invalidateSimulateurCache();
    invalidateTrackerCache();
    for (const route of ['simulateur', 'home']) {
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
