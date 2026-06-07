import { createTabs, setActiveTab } from './components/tabs.js';
import { getRouteFromHash, navigate, renderRoute } from './router.js';

const app = document.getElementById('app');
const shell = document.createElement('div');
shell.className = 'app-shell';

const content = document.createElement('main');
content.id = 'page-content';

let tabsNav = null;

async function showPage(route) {
    const active = navigate(route);
    if (tabsNav) setActiveTab(tabsNav, active);
    await renderRoute(active, content);
}

function init() {
    tabsNav = createTabs(getRouteFromHash(), showPage);
    shell.append(tabsNav, content);
    app.append(shell);

    window.addEventListener('hashchange', () => {
        showPage(getRouteFromHash());
    });

    showPage(getRouteFromHash());
}

init();
