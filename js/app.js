import { createBottomNav, setActiveTab } from './components/bottom-nav.js';
import { createTopBar, updateTopBarAvatar } from './components/top-bar.js';
import { getRouteFromHash, navigate, renderRoute } from './router.js';
import { initTheme } from './theme.js';
import { openSettingsSheet } from './components/settings-sheet.js';
import { initLegalPages } from './pages/legal.js';

const app = document.getElementById('app');
const shell = document.createElement('div');
shell.className = 'app-shell';

const content = document.createElement('main');
content.id = 'page-content';
content.className = 'app-content';
content.setAttribute('role', 'presentation');

let bottomNav = null;
let topBar = null;

async function showPage(route) {
    const active = navigate(route);
    if (bottomNav) setActiveTab(bottomNav, active);
    await renderRoute(active, content);
}

function init() {
    initTheme();
    initLegalPages();

    topBar = createTopBar(() => openSettingsSheet());
    bottomNav = createBottomNav(getRouteFromHash(), showPage);

    shell.append(topBar, content, bottomNav);
    app.append(shell);

    window.addEventListener('hashchange', () => {
        showPage(getRouteFromHash());
    });

    window.addEventListener('profile-updated', () => {
        if (topBar) updateTopBarAvatar(topBar);
    });

    window.addEventListener('navigate-sim-row', async (ev) => {
        await showPage('simulateur');
        window.dispatchEvent(new CustomEvent('scroll-sim-row', { detail: ev.detail }));
    });

    showPage(getRouteFromHash());
}

init();
