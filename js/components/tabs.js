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

    TABS.forEach((tab) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'app-tab' + (tab.id === activeId ? ' active' : '');
        btn.dataset.tab = tab.id;
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', tab.id === activeId ? 'true' : 'false');
        btn.textContent = `${tab.icon} ${tab.label}`;
        btn.addEventListener('click', () => onSelect(tab.id));
        nav.append(btn);
    });

    return nav;
}

export function setActiveTab(nav, activeId) {
    nav.querySelectorAll('.app-tab').forEach((btn) => {
        const isActive = btn.dataset.tab === activeId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
}
