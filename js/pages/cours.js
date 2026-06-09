export function mountCours(container) {
    container.classList.add('page-cours');
    container.innerHTML = `
        <div class="page-placeholder">
            <span class="material-symbols-rounded page-placeholder-icon">menu_book</span>
            <h2>Cours par matière</h2>
            <p>Les cours organisés par matière et chapitre arriveront ici.</p>
        </div>
    `;
}
