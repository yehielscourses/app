export const TABS = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'cours', label: 'Cours', icon: 'menu_book' },
    { id: 'exercices', label: 'Exercices', icon: 'edit_note' },
    { id: 'simulateur', label: 'Simulateur', icon: 'calculate', ariaLabel: 'Simulateur des notes' },
];

export function createBottomNav(activeId, onSelect) {
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.setAttribute('role', 'tablist');
    nav.setAttribute('aria-label', 'Navigation principale');

    const buttons = [];

    TABS.forEach((tab) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'bottom-nav-item' + (tab.id === activeId ? ' active' : '');
        btn.id = `tab-${tab.id}`;
        btn.dataset.tab = tab.id;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', tab.id === activeId ? 'true' : 'false');
        btn.setAttribute('aria-controls', `panel-${tab.id}`);
        if (tab.ariaLabel) btn.setAttribute('aria-label', tab.ariaLabel);
        btn.tabIndex = tab.id === activeId ? 0 : -1;

        const indicator = document.createElement('span');
        indicator.className = 'bottom-nav-indicator';
        indicator.setAttribute('aria-hidden', 'true');

        const icon = document.createElement('span');
        icon.className = 'material-symbols-rounded bottom-nav-icon';
        icon.textContent = tab.icon;
        icon.setAttribute('aria-hidden', 'true');

        const label = document.createElement('span');
        label.className = 'bottom-nav-label';
        label.textContent = tab.label;

        btn.append(indicator, icon, label);
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
    nav.querySelectorAll('.bottom-nav-item').forEach((btn) => {
        const isActive = btn.dataset.tab === activeId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.tabIndex = isActive ? 0 : -1;
    });
}
