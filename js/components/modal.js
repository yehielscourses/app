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
        cancelBtn.className = 'btn-modal btn-modal--cancel';
        cancelBtn.textContent = cancelLabel;

        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'btn-modal btn-modal--confirm' + (danger ? ' btn-modal--danger' : '');
        confirmBtn.textContent = confirmLabel;

        const close = (result) => {
            backdrop.remove();
            document.removeEventListener('keydown', onKey);
            resolve(result);
        };

        const onKey = (ev) => {
            if (ev.key === 'Escape') close(false);
        };

        cancelBtn.addEventListener('click', () => close(false));
        confirmBtn.addEventListener('click', () => close(true));
        backdrop.addEventListener('click', (ev) => {
            if (ev.target === backdrop) close(false);
        });
        document.addEventListener('keydown', onKey);

        actions.append(cancelBtn, confirmBtn);
        dialog.append(titleEl, messageEl, actions);
        backdrop.append(dialog);
        document.body.append(backdrop);
        confirmBtn.focus();
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

        const titleEl = document.createElement('h2');
        titleEl.className = 'modal-title';
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
        cancelBtn.className = 'btn-modal btn-modal--cancel';
        cancelBtn.textContent = 'Annuler';

        const confirmBtn = document.createElement('button');
        confirmBtn.type = 'button';
        confirmBtn.className = 'btn-modal btn-modal--confirm';
        confirmBtn.textContent = 'Appliquer';

        const close = (result) => {
            backdrop.remove();
            document.removeEventListener('keydown', onKey);
            resolve(result);
        };

        const onKey = (ev) => {
            if (ev.key === 'Escape') close(null);
            if (ev.key === 'Enter') close(input.value);
        };

        cancelBtn.addEventListener('click', () => close(null));
        confirmBtn.addEventListener('click', () => close(input.value));
        backdrop.addEventListener('click', (ev) => {
            if (ev.target === backdrop) close(null);
        });
        document.addEventListener('keydown', onKey);

        actions.append(cancelBtn, confirmBtn);
        dialog.append(titleEl, messageEl, field, actions);
        backdrop.append(dialog);
        document.body.append(backdrop);
        input.focus();
        input.select();
    });
}
