export function mountExercices(container) {
    container.className = 'container page-exercices';
    container.innerHTML = `
        <div class="page-placeholder">
            <div class="page-placeholder-icon">✏️</div>
            <h2>Exercices</h2>
            <p>La banque d'exercices filtrable par matière sera disponible prochainement.</p>
        </div>
    `;
}
