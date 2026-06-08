export function showLoading(container, message = 'Chargement…') {
    container.innerHTML = `
        <div class="page-loading" role="status" aria-live="polite">
            <div class="page-loading-spinner" aria-hidden="true"></div>
            <p>${message}</p>
        </div>`;
}
