import { getProfile, getDisplayName, getAvatarUrl } from '../lib/profile.js';

function createAvatarButton(onOpenSettings) {
    const profile = getProfile();
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'top-bar-avatar m3-state-layer';
    btn.setAttribute('aria-label', 'Ouvrir les paramètres');

    const img = document.createElement('img');
    img.className = 'top-bar-avatar-img';
    img.alt = '';
    img.width = 32;
    img.height = 32;

    const fallback = document.createElement('span');
    fallback.className = 'top-bar-avatar-fallback';
    fallback.setAttribute('aria-hidden', 'true');

    const avatarUrl = getAvatarUrl(profile);
    const name = getDisplayName(profile);
    fallback.textContent = name.charAt(0).toUpperCase();

    if (avatarUrl) {
        img.src = avatarUrl;
        img.hidden = false;
        fallback.hidden = true;
    } else {
        img.hidden = true;
        fallback.hidden = false;
    }

    btn.append(img, fallback);
    btn.addEventListener('click', () => onOpenSettings(btn));
    return btn;
}

export function createTopBar(onOpenSettings) {
    const header = document.createElement('header');
    header.className = 'top-app-bar';

    const title = document.createElement('h1');
    title.className = 'top-app-bar-title';
    title.textContent = 'Bac Tracker';

    header.append(title, createAvatarButton(onOpenSettings));
    return header;
}

export function updateTopBarAvatar(header) {
    const btn = header.querySelector('.top-bar-avatar');
    if (!btn) return;

    const profile = getProfile();
    const img = btn.querySelector('.top-bar-avatar-img');
    const fallback = btn.querySelector('.top-bar-avatar-fallback');
    const avatarUrl = getAvatarUrl(profile);
    const name = getDisplayName(profile);

    fallback.textContent = name.charAt(0).toUpperCase();

    if (avatarUrl) {
        img.src = avatarUrl;
        img.hidden = false;
        fallback.hidden = true;
    } else {
        img.removeAttribute('src');
        img.hidden = true;
        fallback.hidden = false;
    }
}
