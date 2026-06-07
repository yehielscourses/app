export function createProgressSection() {
    const section = document.createElement('div');
    section.className = 'progress-section';
    section.innerHTML = `
        <div class="progress-header">
            <span>📊 Progression globale</span>
            <span>
                <span class="progress-label">0 / 0</span>
                &nbsp;—&nbsp;
                <span class="progress-pct">0 %</span>
            </span>
        </div>
        <div class="bar-track">
            <div class="bar-fill" style="width:0%"></div>
        </div>
        <div class="completion-msg"></div>
    `;
    return section;
}

export function updateProgressBar(section, { checked, total, completionMessage }) {
    const pct = total ? Math.round((checked / total) * 100) : 0;

    section.querySelector('.progress-label').textContent = `${checked} / ${total}`;
    section.querySelector('.progress-pct').textContent = `${pct} %`;

    const bar = section.querySelector('.bar-fill');
    bar.style.width = `${pct}%`;
    bar.classList.toggle('complete', pct === 100);

    const msg = section.querySelector('.completion-msg');
    msg.textContent = completionMessage;
    msg.classList.toggle('show', pct === 100);
}
