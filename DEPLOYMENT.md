# Recovered build: GitHub Pages handoff

The `gh-pages` branch contains the original recovered production build, packaged for the `/hogwat-3d/` URL prefix. The original game source and original `dist` were not changed. The package was tested in Chromium at that URL prefix: WebGL rendered and all assets loaded without errors.

[View the prepared hosting branch](https://github.com/thietvedan-dotcom/hogwat-3d/tree/gh-pages)

## Public site status

Public activation and the live playable URL are **not verified**. The recovery environment's network proxy blocks `api.github.com` and `thietvedan-dotcom.github.io`. A successful Git push alone does not establish that GitHub Pages has published the site.

To enable hosting, open [repository Pages settings](https://github.com/thietvedan-dotcom/hogwat-3d/settings/pages), select **Deploy from a branch**, choose **gh-pages** and **/ (root)**, and save. If these are already selected, check the Pages deployment status instead of changing them.

Expected URL after successful publication: https://thietvedan-dotcom.github.io/hogwat-3d/

To let Codex finish verification, allow `api.github.com` and `thietvedan-dotcom.github.io` in the cloud environment's Internet settings. These additions have been saved in the environment configuration draft; they do not take effect merely because the draft was saved. Review and save the settings, and publish the updated environment configuration as required by the environment UI.

## Reproduce the hosting package

For the recovered existing build:

```sh
node scripts/prepare-pages.mjs /tmp/nocturne-pages-next
```

The destination must be empty. The script copies the existing `dist`, adjusts only generated asset URLs for the GitHub project-site prefix, and adds `.nojekyll`. It never changes the original game source or original `dist`.

For later development changes, first run the usual `npm ci` and `npm run build`, then package the resulting `dist`. Keep deployment history when updating `gh-pages`; do not force-push over other changes.
