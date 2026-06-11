import { loadState, saveState, EXERCICES_STORAGE_KEY } from '../storage.js';

const PHILO_KEY = 'philo';

function emptyStats() {
    return { correct: 0, total: 0 };
}

function emptyPhiloState() {
    return {
        global: emptyStats(),
        themes: {},
        questions: {},
    };
}

export function loadPhiloState() {
    const all = loadState(EXERCICES_STORAGE_KEY);
    if (!all[PHILO_KEY]) return emptyPhiloState();
    return {
        global: { ...emptyStats(), ...all[PHILO_KEY].global },
        themes: { ...all[PHILO_KEY].themes },
        questions: { ...all[PHILO_KEY].questions },
    };
}

function persistPhiloState(philoState) {
    const all = loadState(EXERCICES_STORAGE_KEY);
    all[PHILO_KEY] = philoState;
    saveState(all, EXERCICES_STORAGE_KEY);
}

function ensureThemeStats(state, themeId) {
    if (!state.themes[themeId]) {
        state.themes[themeId] = emptyStats();
    }
    return state.themes[themeId];
}

function ensureQuestionStats(state, questionId) {
    if (!state.questions[questionId]) {
        state.questions[questionId] = emptyStats();
    }
    return state.questions[questionId];
}

export function recordAnswer(question, isCorrect) {
    const state = loadPhiloState();
    const delta = isCorrect ? 1 : 0;

    state.global.correct += delta;
    state.global.total += 1;

    const themeStats = ensureThemeStats(state, question.theme);
    themeStats.correct += delta;
    themeStats.total += 1;

    const qStats = ensureQuestionStats(state, question.id);
    qStats.correct += delta;
    qStats.total += 1;

    persistPhiloState(state);
    return state;
}

export function getAccuracy(stats) {
    if (!stats || !stats.total) return null;
    return Math.round((stats.correct / stats.total) * 100);
}

export function getThemeAccuracy(state, themeId) {
    return getAccuracy(state.themes[themeId]);
}

export function getGlobalAccuracy(state) {
    return getAccuracy(state.global);
}

function getQuestionWeight(question, state) {
    const importanceWeight = { 1: 1, 2: 2, 3: 3 }[question.importance] ?? 1;

    const themeStats = state.themes[question.theme];
    let themeWeakness = 2.5;
    if (themeStats?.total > 0) {
        const accuracy = themeStats.correct / themeStats.total;
        themeWeakness = 1 + (1 - accuracy) * 2;
    }

    const qStats = state.questions[question.id];
    let questionWeakness = 2;
    if (qStats?.total > 0) {
        const accuracy = qStats.correct / qStats.total;
        questionWeakness = 1 + (1 - accuracy) * 1.5;
    }

    return importanceWeight * themeWeakness * questionWeakness;
}

function weightedPick(questions, state) {
    const weights = questions.map((q) => getQuestionWeight(q, state));
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < questions.length; i++) {
        r -= weights[i];
        if (r <= 0) return questions[i];
    }
    return questions[questions.length - 1];
}

export function pickNextQuestion(questions, { mode, themeId, excludeIds = [] } = {}) {
    const exclude = new Set(excludeIds);
    let pool = questions.filter((q) => !exclude.has(q.id));

    if (mode === 'theme' && themeId) {
        pool = pool.filter((q) => q.theme === themeId);
    }

    if (!pool.length) return null;

    if (mode === 'unlimited') {
        const state = loadPhiloState();
        return weightedPick(pool, state);
    }

    return pool[Math.floor(Math.random() * pool.length)];
}

export function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export function buildThemeSeries(questions, themeId) {
    return shuffleArray(questions.filter((q) => q.theme === themeId));
}

export function getThemeLabel(themes, themeId) {
    return themes.find((t) => t.id === themeId)?.label ?? themeId;
}

export function groupThemesByPerspective(themes, perspectives) {
    const groups = new Map();
    perspectives.forEach((p) => groups.set(p.label, []));
    groups.set('Transversal', []);

    themes.forEach((theme) => {
        const key = theme.perspective ?? 'Transversal';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(theme);
    });

    return groups;
}
