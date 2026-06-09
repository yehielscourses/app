let toastRoot = null;

function ensureRoot() {
    if (!toastRoot) {
        toastRoot = document.createElement('div');
        toastRoot.className = 'toast-root';
        document.body.append(toastRoot);
    }
    return toastRoot;
}

export function showToast(message, { variant = 'info', duration = 5000 } = {}) {
    const root = ensureRoot();
    const el = document.createElement('div');
    el.className = `toast toast--${variant}`;
    el.setAttribute('role', variant === 'error' ? 'alert' : 'status');
    el.textContent = message;
    root.append(el);

    requestAnimationFrame(() => el.classList.add('toast--visible'));

    const remove = () => {
        el.classList.remove('toast--visible');
        setTimeout(() => el.remove(), 300);
    };

    const timer = setTimeout(remove, duration);
    el.addEventListener('click', () => {
        clearTimeout(timer);
        remove();
    });
}
