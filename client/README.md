# Foretell UI

React + TypeScript + Tailwind CSS, served with Vite. All markets and account data are examples. The frontend makes no API requests.

```sh
bun install
bun run dev
```

Open the local URL printed by Vite.

## Pages

- `/` — landing page with interactive outcome preview, category filters, and FAQ.
- `/app` — existing command centre.
- `/app?view=markets` — market registry.
- `/app?market=india-cricket` — selected market details.
- `/app?market=india-cricket&side=no` — preview a No position in that market.
- `/app?auth=signin` or `/app?auth=signup` — existing account forms.
- `/app?create=1` — create-market form.

The landing page lives in `src/pages/landing/`. `src/Site.tsx` chooses the page and passes the initial selection into `src/App.tsx`. Ordinary links handle navigation and browser back/forward. The existing console still uses React state for its internal navigation.

Market examples are shared from `src/data.ts`. The featured chart is explicitly illustrative; it does not represent live prices. Forms only display local confirmations, and the server is not connected.

## Checks

```sh
bun test
bun run build
```

For static hosting, route `/app` to `index.html` (SPA fallback), as Vite already does in development.
