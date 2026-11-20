# Repository instructions for Codex

## Project
Personal portfolio for Isaías Frutos, deployed at https://isaiasfrutos.dev.
Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, GSAP, Lenis.
GitHub repository: Isaias-Web/isaiah-portfolio. Vercel deploys `main` to production.

## Workflow
- Work on a task branch; do not push directly to `main`.
- Keep changes small and scoped to the user's request.
- Read existing components, hooks, and animation configuration before changing architecture.
- Do not merge PRs, modify production settings, remove features, or introduce paid services without explicit approval.
- For updates, describe the impact and include a concise verification summary.

## Public activity publishing (cross-chat protocol)
- If the user asks to log, update, close or publish work on their portfolio, read `docs/RECENT_ACTIVITY_PROTOCOL.md` and `docs/RECENT_ACTIVITY_PUBLISHING.md` first.
- Keep the public activity feed separate from the private source project: publish only sanitized, verified and explicitly authorized information.
- Keep one stable activity ID across preregistration, progress updates and completion, even if the source work spans multiple chats or clients.
- Do not auto-publish on normal requests such as "start working"; publishing requires a specific approval. Never simulate stages or claim deployment without checking.
- Update only `src/data/recentActivity.ts` for routine new entries or status changes; use a feature branch, PR, CI and Vercel verification.

## Commands
- Install: `npm ci`
- Develop: `npm run dev`
- Lint: `npm run lint`
- Type-check: `npx tsc --noEmit`
- Build: `npm run build`
Run lint, type-check, and build when relevant. Report failures and never imply tests passed unless actually run.

## Site architecture
- `src/app/`: App Router layout, home page, metadata, global styles.
- `src/sections/`: Hero, Manifesto, WhoAmI, ProjectsRail, RightNow, OpenChannel.
- `src/components/`: shared UI, cursor, preloader, smooth scroll.
- `src/hooks/` and `src/animations/`: GSAP hooks and timeline helpers.
- `public/`: static assets.

## Design and behavior
- Preserve the editorial dark UI, orange accent, typography, project rail, custom cursor, existing responsive layouts and intentional animation behavior unless the task asks for redesign.
- Treat GSAP/ScrollTrigger and Lenis integration as sensitive: check cleanup, re-renders, scrolling and mobile behavior.
- Prefer semantic, accessible markup, visible keyboard focus, reduced-motion handling and correct image alternatives.
- Optimize performance without trading away core site functionality.
- Do not hide the actual page content from search crawlers or assistive technology behind a JavaScript-only gate. Investigate preloader behavior before refactoring it.

## SEO and content
- Canonical production origin: https://isaiasfrutos.dev
- Primary language: Spanish (Mexico), `es-MX`.
- Preserve existing legitimate outbound links; replace legacy portfolio-domain references when necessary.
- Keep metadata, robots and sitemap consistent with the production origin.
- Do not fabricate professional experience, project outcomes, client relationships, credentials, metrics or links.
- Avoid introducing `og:image` unless the image asset actually exists.

## Security
- Never commit secrets, tokens, environment credentials or private personal information.
- Avoid changing Vercel or GitHub access permissions automatically.
- Use a preview deployment and PR review before publishing changes to production.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
