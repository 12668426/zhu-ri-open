# ZhuRi — Desktop Planner

ZhuRi is a **local-first desktop schedule and time-management tool**, built for macOS with Plash and ordinary desktop browsers.

The open-source edition contains **no developer-specific timetable or personal study data**. First launch offers an empty plan or a generic example.

## Highlights
- Live clock, current task, second-level countdown, next task and time progress.
- Six-column schedule: start, end, activity, category, subject/project, duration.
- Recurring weekdays and overnight time blocks.
- In-card navigation for projects, stages and actionable checklists.
- Adjustable blank desktop region with a narrow draggable handle.
- Automatic macOS light/dark styling (no theme toggle).
- Browser-local persistence, JSON backup and import.

## Run offline

On a computer with Python 3:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/` in your browser or add it to Plash. On macOS, `scripts/install-mac-launch-agent.sh` can set up automatic startup; see the [Chinese README](README.md) for details.

GitHub Pages can host the same static files. A basic Service Worker is included, but offline startup in Plash has not been verified, so the local server remains the recommended option for dependable offline use.

The app does not send data to a server. Changes to origin/hostname/browser may mean different local storage, so always export a backup before switching deployment URLs.

MIT License. All major code paths are in `src/app.js`; no build step or mandatory JavaScript dependencies.
