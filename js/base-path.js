(function () {
    if (!location.hostname.endsWith('github.io')) return;

    const segments = location.pathname.split('/').filter(Boolean);
    const repo = segments[0];
    if (!repo) return;

    if (!location.pathname.endsWith('/')) {
        location.replace(`${location.pathname}/${location.search}${location.hash}`);
        return;
    }

    const base = document.createElement('base');
    base.href = `/${repo}/`;
    document.head.prepend(base);
})();
