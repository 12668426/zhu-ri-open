# ZhuRi — Interactive Desktop Wallpaper

**Turn your daily schedule into a wallpaper you can interact with.**

ZhuRi is a free, open-source **interactive desktop wallpaper** for macOS. It brings your schedule, current activity, live countdown, upcoming tasks and progress onto your desktop background instead of hiding them inside another app window.

Use [Plash](https://sindresorhus.com/plash) to display ZhuRi as a Mac wallpaper. The desktop stays usable as usual; when you want to edit the schedule or check off tasks, enable Plash's **Browsing Mode** to interact with the wallpaper directly. You can also open it in a regular browser.

![ZhuRi light wallpaper](assets/preview-light.webp)

## Wallpaper features

- **Always-visible daily timeline:** start, end, activity, category, subject/project and calculated duration.
- **Live focus at a glance:** current activity, second-by-second countdown, elapsed-time bar and the next event.
- **In-place interaction:** navigate plans, stages and tasks within the same card without navigating away from the desktop.
- **Room for desktop files:** adjust a blank area using a narrow draggable handle.
- **Native-feeling appearance:** automatically follows macOS light/dark mode and adapts to MacBook and external display widths.
- **Your own schedule:** customizable recurring time blocks, projects and task checklists.
- **Local-first data:** no account required; browser-local storage and JSON backup/restore.
- **Two deployment options:** offline-capable local HTTP service or your own GitHub Pages site.

## Installation and usage

**Recommended: local wallpaper (works without the Internet after setup).** Follow the [step-by-step Mac installation guide](docs/01-mac-local.md) for downloading Python, installing Plash, starting the local server, and setting up automatic login startup. The short server command from the project folder is:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Then add `http://127.0.0.1:8765/` to Plash.

**Online wallpaper:** Fork this project to **your own GitHub account**, enable **Settings → Pages** in **your own repository**, and add your own published URL to Plash. See the [GitHub Pages guide](docs/02-github-pages.md).

Further guides: [Using ZhuRi](docs/03-how-to-use.md) · [Troubleshooting](docs/04-troubleshooting.md) · [Data & privacy](docs/05-data-and-privacy.md) · [Screen adaptation](docs/06-screen-support.md).

## Notes

Plash uses Browsing Mode for interacting with the wallpaper. Offline startup for GitHub Pages' cached version has not been comprehensively verified in Plash; use a local HTTP server for dependable offline use. Browser storage is scoped to the app's origin and browser, so export a JSON backup before moving between Plash, Safari or different URLs.

MIT License · [Contributing](CONTRIBUTING.md)
