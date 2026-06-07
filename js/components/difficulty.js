export function createDifficultyDots(level) {
    const wrap = document.createElement('span');
    wrap.className = 'difficulty';
    wrap.title = `Difficulté ${level}/6`;

    for (let i = 1; i <= 6; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i <= level ? ' on' : '');
        wrap.append(dot);
    }

    return wrap;
}
