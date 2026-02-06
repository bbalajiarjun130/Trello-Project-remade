# Trello Project Remade

Minimal React + Vite starter for the Trello-style board app in this repository.

## About

This project uses Vite as the build tool and React for the UI. The repository contains a mix of `.jsx` components and a `main.tsx` entry — TypeScript is used for the Vite entry point while most components remain JSX.

## Requirements

- Node.js (16+ recommended)
- npm (or `yarn` / `pnpm` if you prefer)

## Quick Start

Install dependencies and run the dev server from the project root:

```bash
npm install
npm run dev
```

Or with `yarn`:

```bash
yarn
yarn dev
```

Or with `pnpm`:

```bash
pnpm install
pnpm dev
```

## Available Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build for production (`tsc -b && vite build`)
- `npm run preview` — locally preview built site
- `npm run lint` — run ESLint
- `npm test` — run tests (Jest)

These are defined in `package.json`.

## Project Structure (high level)

- `index.html` — Vite entry HTML
- `src/main.tsx` — application entry
- `src/App.jsx` — main app component
- `src/components/` — UI components
- `src/hooks/` — custom hooks used in the app

## Notes

- The repo currently includes `@vitejs/plugin-react` and React 19 in `devDependencies`/`dependencies`.
- The `build` script runs TypeScript's `tsc -b` before `vite build`; if you don't use TypeScript for all files you can adjust the build pipeline or add `skipLibCheck` / appropriate `tsconfig` settings.

## Next Steps

- Install dependencies if you haven't: `npm install`
- Start the dev server: `npm run dev`
- If you want, I can run these steps for you now or add a `CONTRIBUTING.md` with setup notes.
