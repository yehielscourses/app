export function mountCours(container) {
    container.className = 'container page-cours';
    container.innerHTML = `
        <div class="page-placeholder">
            <div class="page-placeholder-icon">📚</div>
            <h2>Cours par matière</h2>
            <p>Les cours organisés par matière et chapitre arriveront ici.</p>
        </div>
    `;
}
