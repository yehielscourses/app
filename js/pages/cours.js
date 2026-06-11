import { showLoading } from '../components/loading.js';
import { getRouteFromHash } from '../router.js';

const matiereCache = new Map();

function getCoursSubPath() {
    const hash = location.hash.replace(/^#\/?/, '');
    const parts = hash.split('/');
    if (parts[0] !== 'cours') return '';
    return parts.slice(1).join('/');
}

function setCoursHash(subPath) {
    const hash = subPath ? `cours/${subPath}` : 'cours';
    if (location.hash.replace(/^#\/?/, '') !== hash) {
        location.hash = hash;
    }
}

async function loadCoursIndex() {
    const res = await fetch(new URL('data/cours.json', document.baseURI));
    if (!res.ok) throw new Error('Impossible de charger les matières');
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

async function typesetMath(container) {
    container.classList.add('math-pending');
    if (window.MathJax?.typesetPromise) {
        try {
            await MathJax.typesetPromise([container]);
        } finally {
            container.classList.remove('math-pending');
        }
    } else {
        container.classList.remove('math-pending');
    }
}

function createBackButton(label, subPath) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cours-back m3-state-layer';
    btn.innerHTML = `<span class="material-symbols-rounded" aria-hidden="true">arrow_back</span><span>${label}</span>`;
    btn.addEventListener('click', () => setCoursHash(subPath));
    return btn;
}

function renderMatiereList(container, matieres) {
    container.innerHTML = `
        <h1 class="page-title">Cours par matière</h1>
        <p class="cours-intro">Choisissez une matière pour accéder aux fiches de révision.</p>
        <div class="cours-matiere-grid" role="list"></div>
    `;

    const grid = container.querySelector('.cours-matiere-grid');

    matieres.forEach((matiere) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'cours-matiere-card m3-state-layer';
        card.setAttribute('role', 'listitem');
        card.innerHTML = `
            <span class="material-symbols-rounded cours-matiere-icon" aria-hidden="true">${matiere.icon}</span>
            <span class="cours-matiere-label">${matiere.label}</span>
            <span class="cours-matiere-desc">${matiere.description}</span>
            <span class="material-symbols-rounded cours-matiere-chevron" aria-hidden="true">chevron_right</span>
        `;
        card.addEventListener('click', () => setCoursHash(matiere.id));
        grid.append(card);
    });
}

function renderNotionList(container, matiereMeta, matiereData) {
    container.innerHTML = '';
    container.append(createBackButton('Toutes les matières', ''));

    const header = document.createElement('div');
    header.className = 'cours-header';
    header.innerHTML = `
        <h1 class="page-title">${matiereData.label}</h1>
        <p class="cours-intro">${matiereData.description}</p>
    `;
    container.append(header);

    const methodBtn = document.createElement('button');
    methodBtn.type = 'button';
    methodBtn.className = 'cours-method-card m3-state-layer';
    methodBtn.innerHTML = `
        <span class="material-symbols-rounded cours-method-icon" aria-hidden="true">school</span>
        <span class="cours-method-text">
            <strong>${matiereData.methodologie.title}</strong>
            <span>Épreuve du bac, dissertation, explication de texte</span>
        </span>
        <span class="material-symbols-rounded cours-matiere-chevron" aria-hidden="true">chevron_right</span>
    `;
    methodBtn.addEventListener('click', () => setCoursHash(`${matiereMeta.id}/methodologie`));
    container.append(methodBtn);

    const perspectives = matiereData.perspectives ?? [];
    const grouped = new Map();
    perspectives.forEach((p) => grouped.set(p.label, []));

    matiereData.notions.forEach((notion) => {
        const key = notion.perspective ?? 'Autres';
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key).push(notion);
    });

    grouped.forEach((notions, perspective) => {
        if (!notions.length) return;

        const section = document.createElement('section');
        section.className = 'cours-perspective-section';
        section.innerHTML = `<h2 class="cours-perspective-title">${perspective}</h2>`;

        const list = document.createElement('div');
        list.className = 'cours-notion-list';
        list.setAttribute('role', 'list');

        notions.forEach((notion) => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'cours-notion-card m3-state-layer';
            item.setAttribute('role', 'listitem');
            item.innerHTML = `
                <span class="cours-notion-title">${notion.title}</span>
                <span class="cours-notion-summary">${notion.summary}</span>
                <span class="material-symbols-rounded cours-matiere-chevron" aria-hidden="true">chevron_right</span>
            `;
            item.addEventListener('click', () => setCoursHash(`${matiereMeta.id}/${notion.id}`));
            list.append(item);
        });

        section.append(list);
        container.append(section);
    });
}

async function renderFiche(container, matiereMeta, matiereData, notionId) {
    container.innerHTML = '';
    container.append(createBackButton(matiereData.label, matiereMeta.id));

    let title;
    let html;

    if (notionId === 'methodologie') {
        title = matiereData.methodologie.title;
        html = matiereData.methodologie.html;
    } else {
        const notion = matiereData.notions.find((n) => n.id === notionId);
        if (!notion) {
            container.innerHTML += `
                <div class="page-placeholder">
                    <span class="material-symbols-rounded page-placeholder-icon">search_off</span>
                    <h2>Fiche introuvable</h2>
                    <p>Cette notion n'existe pas dans le programme.</p>
                </div>`;
            return;
        }
        title = notion.title;
        html = notion.html;
        if (notion.perspective) {
            const badge = document.createElement('p');
            badge.className = 'cours-fiche-perspective';
            badge.textContent = notion.perspective;
            container.append(badge);
        }
    }

    const article = document.createElement('article');
    article.className = 'cours-fiche';
    article.innerHTML = `
        <h1 class="page-title cours-fiche-title">${title}</h1>
        <div class="cours-fiche-body">${html}</div>
    `;
    container.append(article);

    await typesetMath(article);
}

async function renderCoursView(container, index) {
    const sub = getCoursSubPath();
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
        renderNotionList(container, matiereMeta, matiereData);
        return;
    }

    await renderFiche(container, matiereMeta, matiereData, parts[1]);
}

let coursContainer = null;
let coursIndex = null;
let hashListenerAttached = false;

async function refreshCours() {
    if (!coursContainer) return;
    if (!coursIndex) {
        coursIndex = await loadCoursIndex();
    }
    await renderCoursView(coursContainer, coursIndex);
}

export function invalidateCoursCache() {
    coursIndex = null;
    matiereCache.clear();
}

export async function mountCours(container) {
    container.classList.add('page-cours');
    coursContainer = container;

    if (!hashListenerAttached) {
        hashListenerAttached = true;
        window.addEventListener('hashchange', () => {
            if (getRouteFromHash() === 'cours' && coursContainer) {
                refreshCours();
            }
        });
    }

    showLoading(container);
    try {
        coursIndex = await loadCoursIndex();
        await renderCoursView(container, coursIndex);
    } catch (err) {
        console.error(err);
        container.innerHTML = `
            <div class="page-placeholder">
                <span class="material-symbols-rounded page-placeholder-icon">warning</span>
                <h2>Erreur de chargement</h2>
                <p>Impossible de charger les cours. Vérifiez votre connexion et réessayez.</p>
            </div>`;
    }
}
