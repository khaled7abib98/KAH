# KAH — Khaled Habib Portfolio

Static site. No build step needed. It runs as-is on GitHub Pages.

## Publishing on GitHub Pages
1. Upload everything in this folder (index.html, styles.css, app.js, data.js, assets/, vendor/) to the root of the `KAH` repo, replacing the old files.
2. In the repo, go to Settings → Pages → Deploy from branch → `main` / root.
3. Wait about a minute, then open https://khaledhabib-gd.github.io/KAH/

## Adding or editing a project
Everything lives in `data.js`:
- `url`: the Behance project link
- `cover`: the cover file name from Behance
- `images`: image file names from the project. Open the project on Behance, right-click an image, choose Copy image address, and keep only the part after the last `/`.
- `cats`: branding / social / advertising (these control the filters)

To change the 5 big stacked case cards in "Selected work", edit the `FEAT` list in `app.js` (project id + card colours). The hero carousel order is the `ARC` list.

A direct link to any project works too: `.../KAH/#project-osool`
