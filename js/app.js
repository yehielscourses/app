import { createTabs, setActiveTab } from './components/tabs.js';
import { getRouteFromHash, navigate, renderRoute, openSettings } from './router.js';
import { initTheme, createThemeToggle } from './theme.js';

const app = document.getElementById('app');
const shell = document.createElement('div');
shell.className = 'app-shell';

const header = document.createElement('div');
header.className = 'app-header';

const content = document.createElement('main');
content.id = 'page-content';
content.setAttribute('role', 'presentation');

let tabsNav = null;

async function showPage(route) {
    const active = navigate(route);
    if (tabsNav && active !== 'settings') setActiveTab(tabsNav, active);
    await renderRoute(active, content);
}

function createProfileButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'profile-toggle';
    btn.setAttribute('aria-label', 'Paramètres du profil');
    btn.textContent = '👤';
    btn.addEventListener('click', () => openSettings());
    return btn;
}

function init() {
    initTheme();

    const headerActions = document.createElement('div');
    headerActions.className = 'app-header-actions';
    headerActions.append(createProfileButton(), createThemeToggle());
    header.append(headerActions);

    tabsNav = createTabs(getRouteFromHash(), showPage);
    shell.append(header, tabsNav, content);
    app.append(shell);

    window.addEventListener('hashchange', () => {
        showPage(getRouteFromHash());
    });

    showPage(getRouteFromHash());
}

init();
