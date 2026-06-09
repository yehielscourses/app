const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container) {
    return [...container.querySelectorAll(FOCUSABLE)].filter(
        (el) => !el.hidden && el.getAttribute('aria-hidden') !== 'true',
    );
}

export function createFocusTrap(container, { onEscape, initialFocus } = {}) {
    const previouslyFocused = document.activeElement;

    function handleKeyDown(ev) {
        if (ev.key === 'Escape') {
            onEscape?.();
            return;
        }
        if (ev.key !== 'Tab') return;

        const items = getFocusable(container);
        if (!items.length) return;

        const first = items[0];
        const last = items[items.length - 1];

        if (ev.shiftKey && document.activeElement === first) {
            ev.preventDefault();
            last.focus();
        } else if (!ev.shiftKey && document.activeElement === last) {
            ev.preventDefault();
            first.focus();
        }
    }

    document.addEventListener('keydown', handleKeyDown);

    const target = initialFocus ?? getFocusable(container)[0];
    target?.focus();

    return {
        release() {
            document.removeEventListener('keydown', handleKeyDown);
            if (previouslyFocused?.focus) previouslyFocused.focus();
        },
    };
}
