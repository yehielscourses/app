# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

**Bac Tracker** is a vanilla HTML/CSS/JavaScript static SPA for French baccalaureate preparation (Tracker, Simulateur, Cours, Exercices tabs). There is no build step, package manager, or backend.

## Cursor Cloud specific instructions

### Dependencies

None. Python 3 is only used to serve static files locally. No `npm install`, virtualenv, or Docker is required.

### Running the app locally

A local HTTP server is **required** — `fetch()` for JSON under `data/` fails with the `file://` protocol. See `README.md`:

```bash
cd /workspace
python3 -m http.server 8000
```

Then open http://localhost:8000 in a browser.

Run the server in a tmux session so it stays up across agent commands:

```bash
SESSION_NAME="bac-tracker-server"
tmux -f /exec-daemon/tmux.portal.conf has-session -t "=$SESSION_NAME" 2>/dev/null || \
  tmux -f /exec-daemon/tmux.portal.conf new-session -d -s "$SESSION_NAME" -c "/workspace" -- "${SHELL:-bash}" -l
tmux -f /exec-daemon/tmux.portal.conf send-keys -t "$SESSION_NAME:0.0" 'python3 -m http.server 8000' C-m
```

Verify with: `curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8000/`

### Lint / test / build

| Task | Command | Notes |
|------|---------|-------|
| Lint | — | No linter configured |
| Test | — | No automated test suite |
| Build | — | Not applicable (static assets served as-is) |
| Deploy | GitHub Actions | `.github/workflows/deploy.yml` copies files to GitHub Pages on push to `main` |

### Optional external resources

MathJax and Google Fonts load from CDNs when online. The app works offline except formulas may show as raw LaTeX without MathJax.

### Key paths

- Entry: `index.html`
- Data: `data/*.json` (notions, coefficients, epreuves)
- App logic: `js/app.js`, `js/router.js`, `js/pages/`
- Persistence: browser `localStorage` (`bac-tracker-v2`, `bac-simulateur-v1`)
