export const TABS = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'cours', label: 'Cours', icon: 'menu_book' },
    { id: 'exercices', label: 'Exercices', icon: 'edit_note' },
    { id: 'simulateur', label: 'Simulateur', icon: 'calculate', ariaLabel: 'Simulateur des notes' },
];

function createNavItem(tab, activeId, variant, onSelect) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `nav-item nav-item--${variant}` + (tab.id === activeId ? ' active' : '');
    btn.id = `tab-${variant}-${tab.id}`;
    btn.dataset.tab = tab.id;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', tab.id === activeId ? 'true' : 'false');
    btn.setAttribute('aria-controls', `panel-${tab.id}`);
    if (tab.ariaLabel) btn.setAttribute('aria-label', tab.ariaLabel);
    btn.tabIndex = tab.id === activeId ? 0 : -1;

    const iconSlot = document.createElement('span');
    iconSlot.className = 'nav-icon-slot';

    const indicator = document.createElement('span');
    indicator.className = 'nav-indicator';
    indicator.setAttribute('aria-hidden', 'true');

    const icon = document.createElement('span');
    icon.className = 'material-symbols-rounded nav-icon';
    icon.textContent = tab.icon;
    icon.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'nav-label';
    label.textContent = tab.label;

    iconSlot.append(indicator, icon);
    btn.append(iconSlot, label);
    btn.addEventListener('click', () => onSelect(tab.id));

    return btn;
}

function bindNavKeyboard(nav, buttons, onSelect) {
    nav.addEventListener('keydown', (ev) => {
        const current = buttons.findIndex((b) => b === document.activeElement);
        if (current < 0) return;

        const isVertical = nav.classList.contains('nav-rail');
        let next = current;

        if (isVertical) {
            if (ev.key === 'ArrowDown') next = (current + 1) % buttons.length;
            else if (ev.key === 'ArrowUp') next = (current - 1 + buttons.length) % buttons.length;
            else if (ev.key === 'Home') next = 0;
            else if (ev.key === 'End') next = buttons.length - 1;
            else return;
        } else {
            if (ev.key === 'ArrowRight') next = (current + 1) % buttons.length;
            else if (ev.key === 'ArrowLeft') next = (current - 1 + buttons.length) % buttons.length;
            else if (ev.key === 'Home') next = 0;
            else if (ev.key === 'End') next = buttons.length - 1;
            else return;
        }

        ev.preventDefault();
        buttons[next].focus();
        onSelect(buttons[next].dataset.tab);
    });
}

function createNav(variant, activeId, onSelect) {
    const nav = document.createElement('nav');
    nav.className = variant === 'rail' ? 'nav-rail' : 'bottom-nav';
    nav.setAttribute('role', 'tablist');
    nav.setAttribute('aria-label', 'Navigation principale');

    const buttons = TABS.map((tab) => createNavItem(tab, activeId, variant, onSelect));
    nav.append(...buttons);
    bindNavKeyboard(nav, buttons, onSelect);

    return nav;
}

export function createBottomNav(activeId, onSelect) {
    return createNav('bar', activeId, onSelect);
}

export function createNavRail(activeId, onSelect) {
    return createNav('rail', activeId, onSelect);
}

export function setActiveTab(nav, activeId) {
    nav.querySelectorAll('.nav-item').forEach((btn) => {
        const isActive = btn.dataset.tab === activeId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.tabIndex = isActive ? 0 : -1;
    });
}

export function setActiveTabs(navElements, activeId) {
    navElements.forEach((nav) => {
        if (nav) setActiveTab(nav, activeId);
    });
}
