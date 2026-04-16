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

### Routing

| Route | Rendering | Description |
|---|---|---|
| `/` | Static | Landing page with CTA to launches |
| `/launches` | Client | Paginated list with filters, search, infinite scroll (react-window) |
| `/launches/[id]` | Server | Fetches launch + rocket + launchpad server-side |
| `/charts` | Client | Aggregated bar/line charts (recharts) |
| `/favorites` | Client | Reads from localStorage, grid layout |

### API Layer (`src/lib/spacex-api.ts`)

All API calls go through a centralized `spacexFetch` wrapper that:

1. Sends requests to the [SpaceX REST API v4](https://api.spacexdata.com/v4)
2. Validates every response with a Zod schema (`safeParse`)
3. Throws `SpaceXValidationError` with human-readable issue details on schema mismatch
4. Throws `SpaceXApiError` on non-2xx status codes

Key endpoints:

- `POST /launches/query` — server-side pagination, filtering, sorting, field projection
- `GET /launches/:id` — single launch
- `GET /rockets/:id` — rocket details
- `GET /launchpads/:id` — launchpad details

### Data Flow

- **Server components** fetch data directly via `spacexFetch` and pass it down as props
- **Client components** use TanStack Query (`useQuery` / `useInfiniteQuery`) with stale-time and retry config from `src/lib/query-client.ts`
- Query keys are co-located in `src/lib/query-client.ts` for cache invalidation

### Type Safety

Every API response shape is defined as a Zod schema in `src/types/` (`launch.ts`, `rocket.ts`, `launchpad.ts`, `api.ts`). TypeScript types are inferred via `z.infer<>`. This catches API contract changes at runtime before they reach the UI.

### State Management

- **Server state** — TanStack Query (caching, background refetch, deduplication)
- **URL state** — Next.js `useSearchParams` for filters/sort/pagination (deep-linkable)
- **Local state** — `useLocalStorage` hook for favorites persistence

## Performance Notes

- **Virtualized list** (`react-window`) — only renders visible rows in the launches list
- **Infinite scroll** — paginated fetching via `useInfiniteQuery` with `IntersectionObserver`
- **Field projection** — charts fetch only `date_utc`, `success`, `upcoming` via `select` option to minimize payload
- **Stale time** — 10-minute stale time on queries to avoid redundant refetches
- **Code splitting** — each route is a separate chunk via Next.js App Router

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
- [x] Polish error/loading states
- [ ] Accessibility pass (ARIA, focus management)
- [ ] SSR/SSG for launch detail pre-rendering
- [ ] Offline support / service worker
- [ ] Compare launches side-by-side
