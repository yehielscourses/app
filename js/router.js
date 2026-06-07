import { mountTracker } from './pages/tracker.js';
import { mountCours } from './pages/cours.js';
import { mountExercices } from './pages/exercices.js';
import { mountSimulateur } from './pages/simulateur.js';

const ROUTES = {
    tracker: mountTracker,
    cours: mountCours,
    exercices: mountExercices,
    simulateur: mountSimulateur,
};

const DEFAULT_ROUTE = 'tracker';

export function getRouteFromHash() {
    const hash = location.hash.replace(/^#\/?/, '');
    return ROUTES[hash] ? hash : DEFAULT_ROUTE;
}

export function navigate(route) {
    const target = ROUTES[route] ? route : DEFAULT_ROUTE;
    if (location.hash !== `#${target}`) {
        location.hash = target;
    }
    return target;
}

export async function renderRoute(route, container) {
    const target = ROUTES[route] ? route : DEFAULT_ROUTE;
    const mount = ROUTES[target];
    await mount(container);
    return target;
}
