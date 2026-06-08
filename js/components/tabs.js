export const TABS = [
    { id: 'tracker', label: 'Tracker', icon: '🎯' },
    { id: 'cours', label: 'Cours', icon: '📚' },
    { id: 'exercices', label: 'Exercices', icon: '✏️' },
    { id: 'simulateur', label: 'Simulateur', icon: '📊' },
];

export function createTabs(activeId, onSelect) {
    const nav = document.createElement('nav');
    nav.className = 'app-tabs';
    nav.setAttribute('role', 'tablist');
    nav.setAttribute('aria-label', 'Navigation principale');

    const buttons = [];

    TABS.forEach((tab, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'app-tab' + (tab.id === activeId ? ' active' : '');
        btn.id = `tab-${tab.id}`;
        btn.dataset.tab = tab.id;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', tab.id === activeId ? 'true' : 'false');
        btn.setAttribute('aria-controls', `panel-${tab.id}`);
        btn.tabIndex = tab.id === activeId ? 0 : -1;
        btn.textContent = `${tab.icon} ${tab.label}`;
        btn.addEventListener('click', () => onSelect(tab.id));
        nav.append(btn);
        buttons.push(btn);
    });

    nav.addEventListener('keydown', (ev) => {
        const current = buttons.findIndex((b) => b === document.activeElement);
        if (current < 0) return;

        let next = current;
        if (ev.key === 'ArrowRight') next = (current + 1) % buttons.length;
        else if (ev.key === 'ArrowLeft') next = (current - 1 + buttons.length) % buttons.length;
        else if (ev.key === 'Home') next = 0;
        else if (ev.key === 'End') next = buttons.length - 1;
        else return;

        ev.preventDefault();
        buttons[next].focus();
        onSelect(buttons[next].dataset.tab);
    });

    return nav;
}

export function setActiveTab(nav, activeId) {
    nav.querySelectorAll('.app-tab').forEach((btn) => {
        const isActive = btn.dataset.tab === activeId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.tabIndex = isActive ? 0 : -1;
    });
}
