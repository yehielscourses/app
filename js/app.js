import { createBottomNav, createNavRail, setActiveTabs } from './components/app-nav.js';
import { createTopBar, updateTopBarAvatar } from './components/top-bar.js';
import { getRouteFromHash, navigate, renderRoute } from './router.js';
import { initTheme } from './theme.js';
import { openSettingsSheet } from './components/settings-sheet.js';
import { initLegalPages } from './pages/legal.js';

const app = document.getElementById('app');
const shell = document.createElement('div');
shell.className = 'app-shell';

const main = document.createElement('div');
main.className = 'app-main';

const content = document.createElement('main');
content.id = 'page-content';
content.className = 'app-content';
content.setAttribute('role', 'presentation');

let bottomNav = null;
let navRail = null;
let topBar = null;

async function showPage(route) {
    const active = navigate(route);
    setActiveTabs([bottomNav, navRail], active);
    await renderRoute(active, content);
}

function init() {
    initTheme();
    initLegalPages();

    topBar = createTopBar(() => openSettingsSheet());
    bottomNav = createBottomNav(getRouteFromHash(), showPage);
    navRail = createNavRail(getRouteFromHash(), showPage);

    main.append(topBar, content);
    shell.append(navRail, main, bottomNav);
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
