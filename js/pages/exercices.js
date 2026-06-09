export function mountExercices(container) {
    container.classList.add('page-exercices');
    container.innerHTML = `
        <div class="page-placeholder">
            <span class="material-symbols-rounded page-placeholder-icon">edit_note</span>
            <h2>Exercices</h2>
            <p>La banque d'exercices filtrable par matière sera disponible prochainement.</p>
        </div>
    `;
}
