# 🤖 Copilot Instructions for HRIS CMLABS

## Project Overview
- **HRIS CMLABS** is a modular, modern HR system built with React, Vite, and Tailwind CSS.
- The codebase is organized by feature (see `src/features/`) and shared UI (see `src/components/`).
- State is managed with Context API or Zustand (`src/app/store/`).
- Routing uses React Router DOM (`src/app/routes/AppRouter.jsx`).
- Design system and branding assets are in `src/assets/` and `src/styles/`.

## Key Architectural Patterns
- **Feature Folders:** Each HR module (auth, attendance, employees, etc.) is isolated in its own folder under `src/features/`, with subfolders for `pages/`, `components/`, and `logic/`.
- **Reusable UI:** Common UI elements (tables, cards, notifications, charts) are in `src/components/ui/` and `src/components/charts/`.
- **Layouts:** Top-level layouts for admin, user, and auth flows are in `src/app/layouts/`.
- **API Layer:** All API calls are abstracted in `src/app/services/` (e.g., `auth.api.js`, `employee.api.js`).
- **Config & Constants:** Environment, roles, and other constants are in `src/app/config/`.
- **Assets:** Images, icons, and branding are in `src/assets/`.

## Developer Workflows
- **Install dependencies:** `npm install` or `pnpm install`
- **Start dev server:** `npm run dev` (Vite, HMR enabled)
- **If HMR issues:**
  - `rm -rf node_modules && npm install && npm run dev`
  - `rm -rf .vite && npm run dev`
- **Linting:** ESLint is configured via `eslint.config.js` (run `npx eslint .`)
- **Testing:** See `TESTING_REPORT.md` for tested components and manual QA notes. Automated tests are not yet standard.

## Project-Specific Conventions
- **Imports:** Use `@/` alias for `src/` (see `vite.config.js`).
- **Component Structure:** Prefer function components, hooks, and colocated helpers. Use PropTypes for public components.
- **Styling:** Use Tailwind CSS utility classes. Custom colors and typography in `src/assets/branding/` and `src/styles/`.
- **Form Handling:** Auth forms use local state and validation logic in `logic/` subfolders.
- **Notifications:** Use the `Notification` component for user feedback.
- **Navigation:** Use `useNavigate` from React Router for redirects.
- **Data Flow:** API services return promises; handle loading and error states in the page/component.

## Integration & Cross-Component Patterns
- **Authentication:** State managed in `authStore.js`, consumed via `useAuth` hook.
- **Attendance & Employee Data:** CRUD flows are split between `pages/` (UI), `logic/` (data/validation), and `services/` (API).
- **Charts:** Data for charts is hardcoded or fetched, then passed to chart components in `src/components/charts/`.
- **Environment:** Use `.env.local` for secrets and API URLs.

## References
- [README.md](../README.md): Project intro, tech stack, structure, and setup.
- [TESTING_REPORT.md](../TESTING_REPORT.md): Manual QA, bugfixes, and dev tips.
- [vite.config.js](../vite.config.js): Build config, aliases, HMR tweaks.
- [eslint.config.js](../eslint.config.js): Linting rules and ignores.

---

**For AI agents:**
- Follow the feature folder structure for new modules.
- Use existing UI and service patterns for consistency.
- Reference the README and TESTING_REPORT for up-to-date workflows and troubleshooting.
- When in doubt, prefer colocating logic and UI within the relevant feature folder.
