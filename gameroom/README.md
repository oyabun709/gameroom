# GAMEROOM

Single-app TypeScript `Next.js 16` prototype for the GAMEROOM home screen and mini games.

## Scope

- Home screen in `src/app/page.tsx`
- Playable Number Blast in `src/app/number-blast/page.tsx`
- Shared layout and UI pieces in `src/components/`
- Shared game metadata in `src/lib/games.ts`

Placeholder routes such as `progress`, `trophies`, and `games/[slug]` are kept because they are part of the current navigation flow and home-screen game links.

## Tech

- Next.js App Router
- TypeScript only for app source
- Tailwind CSS v4
- No backend
- No auth
- No database

## Local Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run build
npm run lint
```

## App Structure

```text
src/
  app/
    games/[slug]/page.tsx
    number-blast/page.tsx
    page.tsx
    progress/page.tsx
    trophies/page.tsx
  components/
    bottom-nav.tsx
    game-card.tsx
    mascot-placeholder.tsx
    number-blast-game.tsx
    screen-shell.tsx
    wordmark.tsx
  lib/
    games.ts
```
