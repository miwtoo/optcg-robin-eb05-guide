# Robin EB-05 deck guide

A static Astro site with MDX content.

## Edit the guide

- `src/content/guide.mdx`: guide text, sources, card choices, and lesson steps.
- `src/components/`: card diagrams, filters, reference list, and test log.
- `src/scripts/guide.ts`: interactive controls.
- `src/styles/guide.css`: layout and visual styles.
- `AGENTS.md`: writing, card accuracy, and implementation rules.

Edit source files, not `dist/`. Run `npm run build` before pushing.

## Local development

Use Node.js 24 (`.nvmrc`).

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys on pushes to `main` and on manual runs. It does not deploy pull requests. The workflow infers the GitHub Pages site and base path from `GITHUB_REPOSITORY`, including project-site subpaths.

Before the first deployment:

1. Push this repository to GitHub and use `main` as its default branch.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. Make sure repository or organization policies allow GitHub Actions and Pages deployment. The workflow declares its required permissions.
4. Run the workflow or push to `main`.

For a custom domain, add repository Actions variables `ASTRO_SITE` (for example, `https://cards.example.com`) and `ASTRO_BASE` (usually `/`). These variables override the inferred URL and base path. Local builds use the root base path unless these variables are set.
