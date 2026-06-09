import { createFocusTrap } from '../lib/focus-trap.js';

export function showConfirm({ title, message, confirmLabel = 'Confirmer', cancelLabel = 'Annuler', danger = false } = {}) {
    return new Promise((resolve) => {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.setAttribute('role', 'presentation');

        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog';
        dialog.setAttribute('role', 'alertdialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-labelledby', 'modal-title');
        dialog.setAttribute('aria-describedby', 'modal-message');

        const titleEl = document.createElement('h2');
        titleEl.className = 'modal-title';
        titleEl.id = 'modal-title';
        titleEl.textContent = title;

        const messageEl = document.createElement('p');
        messageEl.className = 'modal-message';
        messageEl.id = 'modal-message';
        messageEl.textContent = message;

        const actions = document.createElement('div');
        actions.className = 'modal-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn-modal btn-modal--cancel m3-state-layer';
        cancelBtn.textContent = cancelLabel;

        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'btn-modal btn-modal--confirm m3-state-layer' + (danger ? ' btn-modal--danger' : '');
        confirmBtn.textContent = confirmLabel;

        let trap = null;

        const close = (result) => {
            trap?.release();
            backdrop.remove();
            resolve(result);
        };

        cancelBtn.addEventListener('click', () => close(false));
        confirmBtn.addEventListener('click', () => close(true));
        backdrop.addEventListener('click', (ev) => {
            if (ev.target === backdrop) close(false);
        });

        actions.append(cancelBtn, confirmBtn);
        dialog.append(titleEl, messageEl, actions);
        backdrop.append(dialog);
        document.body.append(backdrop);

        trap = createFocusTrap(dialog, {
            onEscape: () => close(false),
            initialFocus: danger ? cancelBtn : confirmBtn,
        });
    });
}

export function showPrompt({ title, message, label, defaultValue = '', inputType = 'text', min, max, step } = {}) {
    return new Promise((resolve) => {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';

        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-labelledby', 'modal-prompt-title');

        const titleEl = document.createElement('h2');
        titleEl.className = 'modal-title';
        titleEl.id = 'modal-prompt-title';
        titleEl.textContent = title;

        const messageEl = document.createElement('p');
        messageEl.className = 'modal-message';
        messageEl.textContent = message;

        const field = document.createElement('label');
        field.className = 'modal-field';
        field.textContent = label;

        const input = document.createElement('input');
        input.type = inputType;
        input.className = 'modal-input';
        input.value = defaultValue;
        if (min !== undefined) input.min = min;
        if (max !== undefined) input.max = max;
        if (step !== undefined) input.step = step;
        field.append(input);

        const actions = document.createElement('div');
        actions.className = 'modal-actions';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn-modal btn-modal--cancel m3-state-layer';
        cancelBtn.textContent = 'Annuler';

        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'btn-modal btn-modal--confirm m3-state-layer';
        confirmBtn.textContent = 'Appliquer';

        let trap = null;

        const close = (result) => {
            trap?.release();
            backdrop.remove();
            resolve(result);
        };

        const onEnter = (ev) => {
            if (ev.key === 'Enter' && document.activeElement === input) {
                ev.preventDefault();
                close(input.value);
            }
        };

        cancelBtn.addEventListener('click', () => close(null));
        confirmBtn.addEventListener('click', () => close(input.value));
        backdrop.addEventListener('click', (ev) => {
            if (ev.target === backdrop) close(null);
        });
        input.addEventListener('keydown', onEnter);

        actions.append(cancelBtn, confirmBtn);
        dialog.append(titleEl, messageEl, field, actions);
        backdrop.append(dialog);
        document.body.append(backdrop);

        trap = createFocusTrap(dialog, {
            onEscape: () => close(null),
            initialFocus: input,
        });
        input.select();
    });
}
