export function mountSimulateur(container) {
    container.className = 'container page-simulateur';
    container.innerHTML = `
        <div class="page-placeholder">
            <div class="page-placeholder-icon">📊</div>
            <h2>Simulateur de note</h2>
            <p>Estime ta moyenne au bac selon les coefficients officiels — bientôt disponible.</p>
        </div>
    `;
}
