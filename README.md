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

## E2E Testing with Playwright

This project includes comprehensive end-to-end tests using [Playwright](https://playwright.dev/). Tests cover all major functionality including task management, drag & drop, and responsive design.

### Test Scripts

- `npm run test:e2e` — Run all E2E tests headlessly
- `npm run test:e2e:headed` — Run tests with browser UI visible
- `npm run test:e2e:ui` — Run tests in Playwright's interactive UI mode
- `npm run test:e2e:prod` — Run tests against production URL
- `npm run test:e2e:report` — View last test run report

### Test Suites

| Test File                 | Coverage                                     |
| ------------------------- | -------------------------------------------- |
| `board-loading.spec.js`   | Page loading, columns display, initial state |
| `task-management.spec.js` | Task creation, deletion, validation          |
| `drag-and-drop.spec.js`   | Drag & drop workflows, movement restrictions |
| `responsive.spec.js`      | Mobile/tablet viewports, responsive design   |

### Running Tests

**Local Development:**

```bash
# Start dev server and run tests
npm run test:e2e

# Interactive mode for debugging
npm run test:e2e:ui
```

**Against Production:**

```bash
# Update the URL in package.json first
npm run test:e2e:prod
```

**Browser Setup:**

```bash
# Install Playwright browsers (one-time setup)
npx playwright install
```

### CI/CD Integration

E2E tests run automatically in GitHub Actions on:

- Push to `main` or `develop` branches
- Pull requests targeting these branches

Test results and videos are uploaded as artifacts when tests fail.

### Test Configuration

- **Configuration:** `playwright.config.js`
- **Test Directory:** `e2e/`
- **Browsers:** Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Reports:** HTML reports with screenshots and videos

## Next Steps

- Install dependencies if you haven't: `npm install`
- Start the dev server: `npm run dev`
- Run E2E tests: `npm run test:e2e`
- If you want, I can run these steps for you now or add a `CONTRIBUTING.md` with setup notes.
