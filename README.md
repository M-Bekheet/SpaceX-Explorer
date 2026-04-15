# SpaceX Explorer

A Next.js frontend for browsing SpaceX launches, rockets, and launchpads. Built with TypeScript, TanStack Query, Tailwind CSS, and shadcn/ui.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **TanStack Query** — data fetching, caching, deduplication
- **Zod** — runtime API response validation
- **Tailwind CSS** + **shadcn/ui** — styling & components
- **react-window** — list virtualization
- **recharts** — charts (launches per year / success rate)
- **next-themes** — dark mode

## Architecture

- Homepage (`/`) — landing page with CTA to launches
- `/launches` — client-side paginated list with filters, search, infinite scroll
- `/launches/[id]` — server component fetching launch + rocket + launchpad
- `/favorites` — client component backed by localStorage

API data comes from [SpaceX REST API v4](https://api.spacexdata.com/v4) via `POST /launches/query` for paginated filtering and `GET` endpoints for rockets/launchpads. All API responses are validated at runtime with Zod schemas to guard against contract changes.

## TODOs

- [x] Types & API layer (launches, rockets, launchpads, query types)
- [x] Zod runtime validation for all API responses
- [x] Query client with retry/backoff for 429/5xx
- [x] useLocalStorage hook
- [x] Navbar + Footer layout
- [x] Homepage landing page
- [x] LaunchCard, LaunchFilters, LaunchSearch, LaunchList, LaunchSkeleton
- [x] Launches list page with infinite scroll + virtualization
- [x] Launch detail page (server component)
- [x] FavoriteButton component
- [x] Favorites page
- [x] Charts (launches per year / success rate)
- [ ] Polish error/loading states
- [ ] Accessibility pass (ARIA, focus management)
- [ ] SSR/SSG for launch detail pre-rendering
- [ ] Offline support / service worker
