# Arsene Karema — Portfolio

Next.js (App Router) + TypeScript + Tailwind CSS v4. Fully static.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
npm run lint
npm run typecheck
npm run test:e2e   # builds, starts the site and runs the Playwright suite (desktop + mobile)
```

The end-to-end tests use your installed Google Chrome (`channel: "chrome"`), so no browser download is needed. On CI, run `npx playwright install chrome` first.

Set `NEXT_PUBLIC_SITE_URL` (e.g. `https://yourdomain.com`) in production so canonical URLs, the sitemap and social cards use the real domain.

- Content lives in `src/data/` (projects, experience, stack layers, about, site/contact info).
- Sections are in `src/components/sections/`; interactive pieces are small client components in `src/components/ui/` and `src/components/animations/`.
- The accent colour is `--accent` / `--accent-rgb` in `src/app/globals.css`.
