# Prediction Market Client Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a hard-coded React, TypeScript, and Tailwind prediction-market operations UI without touching the API.

**Architecture:** A Vite SPA in `client/` renders static reference data through route-sized React components. Local React state handles navigation, dialogs, selected market outcomes, and visual-only completion messages; it never performs a fetch or imports server code.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Lucide React, Bun test runner.

**Spec:** `docs/superpowers/specs/2026-10-29-prediction-market-client-design.md`

## Global Constraints

- Create or modify only `client/` for product code; do not alter `server/`.
- Do not make network/API calls from the browser.
- Dark mode is mandatory; colours are charcoal-forward with semantic-only accents.
- Use accessible semantic controls, labels, focus treatments, and reduced-motion support.

## Review Focus

- The navigation must reach each visual-only API workflow without a request being fired.
- Form submissions should show a local confirmation instead of navigating/reloading.
- The mobile menu must remain usable and dismissible without affecting desktop navigation.
- Tables should preserve columns using horizontal overflow on small screens.
- Keyboard focus must remain visible on every interactive control.

---

### Task 1: Set up the React client shell

**Files:**
- Create: `client/package.json`
- Create: `client/tsconfig.json`
- Create: `client/vite.config.ts`
- Create: `client/index.html`
- Create: `client/src/main.tsx`
- Create: `client/src/App.tsx`
- Test: `client/src/App.test.tsx`

**Interfaces:**
- Produces: `App`, the renderable client root used by Vite and the visual smoke test.

- [ ] Write the static-render smoke test for the primary console labels and workflow actions.
- [ ] Run `bun test` in `client/` and verify it fails because `App` is missing.
- [ ] Add the Vite/React bootstrap and minimal `App` implementation.
- [ ] Run `bun test` and `bun run build`; verify both pass.

### Task 2: Build reusable console primitives and dark tokens

**Files:**
- Create: `client/src/index.css`
- Create: `client/src/data.ts`
- Modify: `client/src/App.tsx`

**Interfaces:**
- Consumes: `App` from Task 1.
- Produces: typed hard-coded market data and reusable panel, metric, badge, button, and input styles.

- [ ] Expand the smoke test to require a market title and a Wallet action.
- [ ] Verify the test fails before the console content is added.
- [ ] Add the dark token palette, static dashboard data, compact panels, metrics, table frame, and visible focus/reduced-motion styles.
- [ ] Run the test and production build successfully.

### Task 3: Implement hard-coded workflow views and local interactions

**Files:**
- Modify: `client/src/App.tsx`
- Modify: `client/src/index.css`
- Test: `client/src/App.test.tsx`

**Interfaces:**
- Consumes: local data and primitives from Task 2.
- Produces: dashboard, markets, market detail, wallet, access, create-market, order, and resolve-market UI flows.

- [ ] Expand the test for signup, signin, create market, place order, add demo funds, and resolve market labels.
- [ ] Verify the test fails before the workflow views exist.
- [ ] Add route-local state, forms with `preventDefault`, success toasts, chooser buttons, and the desktop/mobile shell.
- [ ] Run the client test suite and production build successfully.

### Task 4: Verify the visual system

**Files:**
- Modify: `client/src/App.tsx`
- Modify: `client/src/index.css`

**Interfaces:**
- Consumes: completed client from Tasks 1–3.
- Produces: a responsive, cohesive operations console.

- [ ] Run a type/build check and inspect the served UI at desktop and mobile widths.
- [ ] Correct only observed layout, overflow, focus, or accessibility defects.
- [ ] Run `bun test`, `bun run build`, and the existing server tests successfully.
