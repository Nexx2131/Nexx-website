# NEXX website

The public website for **NEXX Bot** and **NEXX Farm**: what the apps do, tutorials, downloads and NEXX coins.

Plain HTML, CSS and JavaScript. No build step and no packages: GitHub Pages serves these files as they are.

| File | What |
|---|---|
| `index.html`, `nexx-bot.html`, `nexx-farm.html`, `coins.html`, `tutorials.html`, `downloads.html` | The six pages |
| `assets/data.js` | Every link, price and coin rate. Change things here first |
| `assets/style.css` | The look, the animations, and the phone layout |
| `assets/app.js` | Header and footer, coin tables, packs, demo checkout, live downloads, tutorial filter, animations |

- **Downloads** read the newest version from the public NEXX update files each time the page opens, so nothing needs editing after a release.
- **Buying coins is a demo.** The prices are samples, and the checkout sends nothing and charges nothing.

To see it on a PC before publishing, run `node server.js` in the folder above this one (it serves this folder at http://localhost:5500).
