import { showLoading } from '../components/loading.js';
import { getRouteFromHash } from '../router.js';
import { showToast } from '../components/toast.js';
import {
    loadPhiloState,
    recordAnswer,
    getGlobalAccuracy,
    getThemeAccuracy,
    pickNextQuestion,
    buildThemeSeries,
    getThemeLabel,
    groupThemesByPerspective,
} from '../lib/philo-qcm.js';

const matiereCache = new Map();
let exercicesIndex = null;
let exercicesContainer = null;
let hashListenerAttached = false;

function getExercicesSubPath() {
    const hash = location.hash.replace(/^#\/?/, '');
    const parts = hash.split('/');
    if (parts[0] !== 'exercices') return '';
    return parts.slice(1).join('/');
}

function setExercicesHash(subPath) {
    const hash = subPath ? `exercices/${subPath}` : 'exercices';
    if (location.hash.replace(/^#\/?/, '') !== hash) {
        location.hash = hash;
    }
}

async function loadExercicesIndex() {
    const res = await fetch(new URL('data/exercices.json', document.baseURI));
    if (!res.ok) throw new Error('Impossible de charger les exercices');
    return res.json();
}

async function loadMatiereData(matiere) {
    if (matiereCache.has(matiere.id)) return matiereCache.get(matiere.id);
    const res = await fetch(new URL(`data/${matiere.dataFile}`, document.baseURI));
    if (!res.ok) throw new Error(`Impossible de charger ${matiere.label}`);
    const data = await res.json();
    matiereCache.set(matiere.id, data);
    return data;
}

function createBackButton(label, subPath) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'exercices-back m3-state-layer';
    btn.innerHTML = `<span class="material-symbols-rounded" aria-hidden="true">arrow_back</span><span>${label}</span>`;
    btn.addEventListener('click', () => setExercicesHash(subPath));
    return btn;
}

function renderScoreRing(pct, size = 'lg') {
    const value = pct ?? 0;
    const hasData = pct !== null;
    const dash = hasData ? (value / 100) * 264 : 0;
    return `
        <div class="exercices-score-ring exercices-score-ring--${size}" aria-hidden="true">
            <svg viewBox="0 0 100 100">
                <circle class="exercices-score-ring-track" cx="50" cy="50" r="42" />
                <circle class="exercices-score-ring-fill" cx="50" cy="50" r="42"
                    stroke-dasharray="${dash} 264" />
            </svg>
            <span class="exercices-score-ring-value">${hasData ? `${value}%` : '—'}</span>
        </div>`;
}

function renderMatiereList(container, matieres) {
    container.innerHTML = `
        <h1 class="page-title">Exercices</h1>
        <p class="exercices-intro">Révisez par matière avec des QCM adaptés au programme du bac.</p>
        <div class="exercices-matiere-grid" role="list"></div>
    `;

    const grid = container.querySelector('.exercices-matiere-grid');
    matieres.forEach((matiere) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'exercices-matiere-card m3-state-layer';
        card.setAttribute('role', 'listitem');
        card.innerHTML = `
            <span class="material-symbols-rounded exercices-matiere-icon" aria-hidden="true">${matiere.icon}</span>
            <span class="exercices-matiere-label">${matiere.label}</span>
            <span class="exercices-matiere-desc">${matiere.description}</span>
            <span class="material-symbols-rounded exercices-matiere-chevron" aria-hidden="true">chevron_right</span>
        `;
        card.addEventListener('click', () => setExercicesHash(matiere.id));
        grid.append(card);
    });
}

function renderPhiloHub(container, matiereMeta, matiereData) {
    const state = loadPhiloState();
    const globalPct = getGlobalAccuracy(state);
    const questionCount = matiereData.questions.length;

    container.innerHTML = '';
    container.append(createBackButton('Toutes les matières', ''));

    const header = document.createElement('div');
    header.className = 'exercices-header';
    header.innerHTML = `
        <h1 class="page-title">${matiereData.label}</h1>
        <p class="exercices-intro">${matiereData.description}</p>
    `;
    container.append(header);

    const scoreCard = document.createElement('section');
    scoreCard.className = 'exercices-score-card';
    scoreCard.innerHTML = `
        <div class="exercices-score-card-main">
            ${renderScoreRing(globalPct)}
            <div class="exercices-score-card-text">
                <h2>Score général</h2>
                <p>${state.global.total ? `${state.global.correct} bonnes réponses sur ${state.global.total}` : 'Aucune réponse pour l\'instant'}</p>
                <span class="exercices-score-card-meta">${questionCount} questions au programme</span>
            </div>
        </div>
    `;
    container.append(scoreCard);

    const unlimitedBtn = document.createElement('button');
    unlimitedBtn.type = 'button';
    unlimitedBtn.className = 'exercices-mode-card exercices-mode-card--primary m3-state-layer';
    unlimitedBtn.innerHTML = `
        <span class="material-symbols-rounded exercices-mode-icon" aria-hidden="true">all_inclusive</span>
        <span class="exercices-mode-text">
            <strong>Série illimitée</strong>
            <span>Questions adaptées à vos lacunes et aux notions essentielles</span>
        </span>
        <span class="material-symbols-rounded exercices-matiere-chevron" aria-hidden="true">play_arrow</span>
    `;
    unlimitedBtn.addEventListener('click', () => setExercicesHash(`${matiereMeta.id}/serie/illimitee`));
    container.append(unlimitedBtn);

    const themesTitle = document.createElement('h2');
    themesTitle.className = 'exercices-section-title';
    themesTitle.textContent = 'Séries par thème';
    container.append(themesTitle);

    const themesHint = document.createElement('p');
    themesHint.className = 'exercices-section-hint';
    themesHint.textContent = 'Choisissez un thème pour réviser une notion, la méthodologie ou les citations.';
    container.append(themesHint);

    const groups = groupThemesByPerspective(matiereData.themes, matiereData.perspectives ?? []);

    groups.forEach((themes, perspective) => {
        if (!themes.length) return;

        const section = document.createElement('section');
        section.className = 'exercices-theme-section';

        if (perspective !== 'Transversal' || groups.size > 1) {
            const title = document.createElement('h3');
            title.className = 'exercices-theme-perspective';
            title.textContent = perspective;
            section.append(title);
        }

        const grid = document.createElement('div');
        grid.className = 'exercices-theme-grid';
        grid.setAttribute('role', 'list');

        themes.forEach((theme) => {
            const themePct = getThemeAccuracy(state, theme.id);
            const themeQuestions = matiereData.questions.filter((q) => q.theme === theme.id).length;
            const themeStats = state.themes[theme.id];

            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'exercices-theme-card m3-state-layer';
            card.setAttribute('role', 'listitem');
            card.innerHTML = `
                <span class="material-symbols-rounded exercices-theme-icon" aria-hidden="true">${theme.icon}</span>
                <span class="exercices-theme-label">${theme.label}</span>
                <span class="exercices-theme-meta">${themeQuestions} questions</span>
                <span class="exercices-theme-score" aria-label="Score : ${themePct !== null ? `${themePct} pour cent` : 'aucune réponse'}">
                    ${themePct !== null ? `${themePct}%` : '—'}
                    ${themeStats ? `<span class="exercices-theme-score-detail">${themeStats.correct}/${themeStats.total}</span>` : ''}
                </span>
            `;
            card.addEventListener('click', () => setExercicesHash(`${matiereMeta.id}/serie/${theme.id}`));
            grid.append(card);
        });

        section.append(grid);
        container.append(section);
    });
}

function createQcmSession(container, matiereMeta, matiereData, mode, themeId) {
    const session = {
        mode,
        themeId,
        questions: matiereData.questions,
        themes: matiereData.themes,
        current: null,
        answered: false,
        selectedIndex: null,
        sessionCorrect: 0,
        sessionTotal: 0,
        recentIds: [],
        themeQueue: mode === 'theme' ? buildThemeSeries(matiereData.questions, themeId) : [],
        themeIndex: 0,
    };

    function getModeLabel() {
        if (mode === 'unlimited') return 'Série illimitée';
        return getThemeLabel(matiereData.themes, themeId);
    }

    function loadNextQuestion() {
        if (mode === 'theme') {
            if (session.themeIndex >= session.themeQueue.length) {
                renderSessionEnd();
                return;
            }
            session.current = session.themeQueue[session.themeIndex];
            session.themeIndex += 1;
        } else {
            session.current = pickNextQuestion(session.questions, {
                mode: 'unlimited',
                excludeIds: session.recentIds.slice(-3),
            });
        }

        session.answered = false;
        session.selectedIndex = null;
        renderQuestion();
    }

    function renderQuestion() {
        const q = session.current;
        if (!q) {
            renderSessionEnd();
            return;
        }

        const progressLabel = mode === 'theme'
            ? `Question ${session.themeIndex} / ${session.themeQueue.length}`
            : `Question ${session.sessionTotal + 1}`;

        container.innerHTML = '';
        container.append(createBackButton(getModeLabel(), matiereMeta.id));

        const header = document.createElement('div');
        header.className = 'exercices-qcm-header';
        header.innerHTML = `
            <span class="exercices-qcm-badge">${getThemeLabel(matiereData.themes, q.theme)}</span>
            <span class="exercices-qcm-progress">${progressLabel}</span>
        `;
        container.append(header);

        if (mode === 'unlimited') {
            const sessionBar = document.createElement('div');
            sessionBar.className = 'exercices-session-bar';
            sessionBar.innerHTML = `
                <span class="exercices-session-stat">
                    <span class="material-symbols-rounded" aria-hidden="true">check_circle</span>
                    ${session.sessionCorrect} / ${session.sessionTotal}
                </span>
            `;
            container.append(sessionBar);
        }

        const card = document.createElement('article');
        card.className = 'exercices-qcm-card';
        card.innerHTML = `
            <h2 class="exercices-qcm-prompt">${q.prompt}</h2>
            <div class="exercices-qcm-choices" role="radiogroup" aria-label="Choix de réponse"></div>
            <div class="exercices-qcm-feedback" hidden></div>
            <div class="exercices-qcm-actions">
                <button type="button" class="btn-primary exercices-qcm-next" disabled>
                    Question suivante
                    <span class="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
                </button>
            </div>
        `;
        container.append(card);

        const choicesEl = card.querySelector('.exercices-qcm-choices');
        const feedbackEl = card.querySelector('.exercices-qcm-feedback');
        const nextBtn = card.querySelector('.exercices-qcm-next');

        q.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'exercices-qcm-choice m3-state-layer';
            btn.setAttribute('role', 'radio');
            btn.setAttribute('aria-checked', 'false');
            btn.innerHTML = `
                <span class="exercices-qcm-choice-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</span>
                <span class="exercices-qcm-choice-text">${choice}</span>
            `;
            btn.addEventListener('click', () => selectAnswer(index));
            choicesEl.append(btn);
        });

        function selectAnswer(index) {
            if (session.answered) return;
            session.answered = true;
            session.selectedIndex = index;
            session.sessionTotal += 1;

            const isCorrect = index === q.correct;
            if (isCorrect) session.sessionCorrect += 1;

            recordAnswer(q, isCorrect);
            session.recentIds.push(q.id);

            choicesEl.querySelectorAll('.exercices-qcm-choice').forEach((btn, i) => {
                btn.disabled = true;
                btn.setAttribute('aria-checked', i === index ? 'true' : 'false');
                if (i === q.correct) btn.classList.add('exercices-qcm-choice--correct');
                else if (i === index) btn.classList.add('exercices-qcm-choice--incorrect');
                else btn.classList.add('exercices-qcm-choice--dimmed');
            });

            feedbackEl.hidden = false;
            feedbackEl.className = `exercices-qcm-feedback exercices-qcm-feedback--${isCorrect ? 'correct' : 'incorrect'}`;
            feedbackEl.innerHTML = `
                <span class="material-symbols-rounded" aria-hidden="true">${isCorrect ? 'check_circle' : 'cancel'}</span>
                <div>
                    <strong>${isCorrect ? 'Bonne réponse !' : 'Pas tout à fait…'}</strong>
                    <p>${q.explanation}</p>
                </div>
            `;

            nextBtn.disabled = false;
            nextBtn.focus();

            if (isCorrect) {
                showToast('Bonne réponse !', { variant: 'info', duration: 2000 });
            }
        }

        nextBtn.addEventListener('click', () => loadNextQuestion());
    }

    function renderSessionEnd() {
        const pct = session.sessionTotal
            ? Math.round((session.sessionCorrect / session.sessionTotal) * 100)
            : 0;

        container.innerHTML = '';
        container.append(createBackButton(getModeLabel(), matiereMeta.id));

        const end = document.createElement('section');
        end.className = 'exercices-session-end';
        end.innerHTML = `
            ${renderScoreRing(pct)}
            <h2>${mode === 'theme' ? 'Série terminée !' : 'Session terminée'}</h2>
            <p class="exercices-session-end-score">
                ${session.sessionCorrect} / ${session.sessionTotal} bonnes réponses
            </p>
            <div class="exercices-session-end-actions">
                <button type="button" class="btn-primary exercices-restart">
                    <span class="material-symbols-rounded" aria-hidden="true">replay</span>
                    Recommencer
                </button>
                <button type="button" class="btn-outlined exercices-back-hub">
                    Retour au menu
                </button>
            </div>
        `;
        container.append(end);

        end.querySelector('.exercices-restart').addEventListener('click', () => {
            session.sessionCorrect = 0;
            session.sessionTotal = 0;
            session.recentIds = [];
            if (mode === 'theme') {
                session.themeQueue = buildThemeSeries(matiereData.questions, themeId);
                session.themeIndex = 0;
            }
            loadNextQuestion();
        });

        end.querySelector('.exercices-back-hub').addEventListener('click', () => {
            setExercicesHash(matiereMeta.id);
        });
    }

    loadNextQuestion();
}

async function renderExercicesView(container, index) {
    const sub = getExercicesSubPath();
    const parts = sub.split('/').filter(Boolean);

    if (parts.length === 0) {
        renderMatiereList(container, index.matieres);
        return;
    }

    const matiereMeta = index.matieres.find((m) => m.id === parts[0]);
    if (!matiereMeta) {
        container.innerHTML = `
            <div class="page-placeholder">
                <span class="material-symbols-rounded page-placeholder-icon">warning</span>
                <h2>Matière introuvable</h2>
                <p>Cette matière n'est pas encore disponible.</p>
            </div>`;
        return;
    }

    const matiereData = await loadMatiereData(matiereMeta);

    if (parts.length === 1) {
        renderPhiloHub(container, matiereMeta, matiereData);
        return;
    }

    if (parts[1] === 'serie' && parts[2]) {
        const themeOrMode = parts[2];
        if (themeOrMode === 'illimitee') {
            createQcmSession(container, matiereMeta, matiereData, 'unlimited');
            return;
        }

        const themeExists = matiereData.themes.some((t) => t.id === themeOrMode);
        if (!themeExists) {
            container.innerHTML = `
                <div class="page-placeholder">
                    <span class="material-symbols-rounded page-placeholder-icon">search_off</span>
                    <h2>Thème introuvable</h2>
                    <p>Ce thème n'existe pas dans le programme.</p>
                </div>`;
            return;
        }

        createQcmSession(container, matiereMeta, matiereData, 'theme', themeOrMode);
        return;
    }

    container.innerHTML = `
        <div class="page-placeholder">
            <span class="material-symbols-rounded page-placeholder-icon">warning</span>
            <h2>Page introuvable</h2>
            <p>Cette section n'existe pas.</p>
        </div>`;
}

async function refreshExercices() {
    if (!exercicesContainer) return;
    if (!exercicesIndex) {
        exercicesIndex = await loadExercicesIndex();
    }
    await renderExercicesView(exercicesContainer, exercicesIndex);
}

export function invalidateExercicesCache() {
    exercicesIndex = null;
    matiereCache.clear();
}

export async function mountExercices(container) {
    container.classList.add('page-exercices');
    exercicesContainer = container;

    if (!hashListenerAttached) {
        hashListenerAttached = true;
        window.addEventListener('hashchange', () => {
            if (getRouteFromHash() === 'exercices' && exercicesContainer) {
                refreshExercices();
            }
        });
    }

    showLoading(container);
    try {
        exercicesIndex = await loadExercicesIndex();
        await renderExercicesView(container, exercicesIndex);
    } catch (err) {
        console.error(err);
        container.innerHTML = `
            <div class="page-placeholder">
                <span class="material-symbols-rounded page-placeholder-icon">warning</span>
                <h2>Erreur de chargement</h2>
                <p>Impossible de charger les exercices. Vérifiez votre connexion et réessayez.</p>
            </div>`;
    }
}
