import { createTabs, setActiveTab } from './components/tabs.js';
import { getRouteFromHash, navigate, renderRoute } from './router.js';
import { initTheme, createThemeToggle } from './theme.js';

const app = document.getElementById('app');
const shell = document.createElement('div');
shell.className = 'app-shell';

const header = document.createElement('div');
header.className = 'app-header';

const content = document.createElement('main');
content.id = 'page-content';

let tabsNav = null;

async function showPage(route) {
    const active = navigate(route);
    if (tabsNav) setActiveTab(tabsNav, active);
    await renderRoute(active, content);
}

function init() {
    initTheme();
    header.append(createThemeToggle());
    tabsNav = createTabs(getRouteFromHash(), showPage);
    shell.append(header, tabsNav, content);
    app.append(shell);

    window.addEventListener('hashchange', () => {
        showPage(getRouteFromHash());
    });

    showPage(getRouteFromHash());
}

init();
