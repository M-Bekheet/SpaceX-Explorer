# SpaceX Explorer

A Next.js frontend for browsing SpaceX launches, rockets, and launchpads. Built with TypeScript, TanStack Query, Tailwind CSS, and shadcn/ui.

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **TanStack Query** - data fetching, caching, deduplication
- **Zod** - runtime API response validation
- **Tailwind CSS** + **shadcn/ui** - styling & components
- **react-window** - list virtualization
- **recharts** - charts (launches per year / success rate)
- **next-themes** - dark mode

## Architecture Decisions

### App Router over Pages Router

Chose the App Router for server components - the launch detail page (`/launches/[id]`) fetches launch + rocket + launchpad data entirely on the server, meaning no loading flash and a fully populated HTML response. The launches list uses client components because it relies on `useSearchParams` for deep-linkable filter/sort state and `useInfiniteQuery` for scroll-driven pagination.

### TanStack Query over SWR or custom fetchers

TanStack Query provides `useInfiniteQuery` which maps naturally to the SpaceX API's paginated `/launches/query` endpoint. It handles deduplication, background refetch, and cache management out of the box. The query key factory in `src/lib/query-client.ts` keeps keys predictable and typed.

### Zod Runtime Validation

Every API response is validated with `safeParse` against a Zod schema before reaching any component. This is a defensive measure - the SpaceX API is third-party and could change without notice. If a response doesn't match the expected shape, a `SpaceXValidationError` is thrown with a readable message rather than a cryptic undefined-property crash in the UI.

### URL as State for Filters/Sort

Filters (upcoming/past, success/failure, date range), sort field, sort direction, and search are all stored in URL search params. This makes every view deep-linkable and shareable, and means the browser back button works naturally when navigating between filter states. No need for a separate state management layer for these.

### localStorage for Favorites

Favorites are a purely client-side concern - no backend, no sync. `useLocalStorage` persists the set of launch IDs and re-renders any component reading from it. Simple and sufficient for the scope. Trade-off: no cross-device sync, but adding a backend for this would be over-engineering for the timebox.

## SpaceX API Usage

### Pagination Strategy

All list fetching uses `POST /launches/query` with server-side pagination (`page` + `limit`). The API returns a `hasNextPage` flag which drives the infinite scroll. **No client-side filtering** - filters are translated into the `query` body of the POST request so the API does the work.

Key payload structure:
```json
{
  "query": { "upcoming": false, "success": true },
  "options": {
    "page": 1,
    "limit": 20,
    "sort": { "date_utc": -1 }
  }
}
```

### Field Projection

The charts page uses `options.select` to fetch only `date_utc`, `success`, and `upcoming` - reducing the response from ~200 fields per launch to just 3. This significantly cuts payload size for the ~300 launches needed for aggregation.

### Endpoints Used

- `POST /launches/query` - paginated list, filtered list, chart aggregation
- `GET /launches/:id` - single launch detail
- `GET /rockets/:id` - rocket info for detail page
- `GET /launchpads/:id` - launchpad info for detail page

## Performance Considerations

- **Virtualized list** - `react-window` renders only the visible rows (~8) regardless of total count, keeping DOM nodes constant
- **Infinite scroll** - `useInfiniteQuery` + `IntersectionObserver` with `rootMargin: 200px` pre-fetches the next page before the user hits the bottom
- **Field projection** - charts fetch minimal fields via `options.select`
- **Stale time** - 10-minute stale time avoids redundant network requests during navigation
- **Server-side fetching** - the detail page fetches data on the server, so the client receives fully rendered HTML (no waterfall)
- **Memoization** - `useMemo` on filter/sort params prevents unnecessary query key changes; `useCallback` on intersection observer handler prevents re-creation

## Accessibility Considerations

- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`)
- `aria-label` on all inputs (date pickers, search, sort dropdown)
- `sr-only` text on icon-only buttons (theme toggle, mobile menu)
- Keyboard-navigable filters and sort controls
- Sufficient color contrast via shadcn's theme tokens (uses CSS custom properties, not hardcoded colors)
- **Not yet done:** focus trap management, skip-to-content link, comprehensive ARIA roles - documented as TODO

## Trade-offs & What I'd Do With More Time

| Decision | Trade-off |
|---|---|
| Client-side infinite scroll for launches list | Can't pre-render the full list server-side, but pagination is a natural fit for client rendering with 200+ items |
| localStorage for favorites | No cross-device sync or persistence across browsers, but zero backend complexity |
| react-window for virtualization | react-window v2 API is still maturing; `react-virtuoso` would be a simpler alternative with built-in infinite scroll support |
| Native `<input type="date">` for date range | Looks different per browser, no date picker UI - would swap for a proper date picker library (e.g., `react-day-picker`) |
| URL params for all filter state | URL can get long with many filters, but deep-linkability is worth it |

### With more time I would:

1. **Add a skip-to-content link** and full keyboard focus management
2. **SSG the top ~100 launches** at build time via `generateStaticParams` for instant detail pages
3. **Add a service worker** for offline caching of favorites and previously viewed launches
4. **Build the compare feature** - side-by-side two launches with a shareable URL like `/compare?id1=abc&id2=def`
5. **Add a proper date picker** instead of native `<input type="date">` for consistent cross-browser UX
6. **Add end-to-end tests** with Playwright for the critical flows (filter, search, favorite, navigate to detail)


## Completed

- [x] Types & API layer (launches, rockets, launchpads, query types)
- [x] Zod runtime validation for all API responses
- [x] Query client with retry/backoff for 429/5xx
- [x] useLocalStorage hook
- [x] Navbar + Footer layout (responsive with mobile drawer)
- [x] Homepage landing page
- [x] LaunchCard, LaunchFilters, LaunchSearch, LaunchList, LaunchSkeleton
- [x] Launches list page with infinite scroll + virtualization
- [x] Sort by date / name / flight number (ascending & descending)
- [x] Launch detail page (server component with rocket + launchpad)
- [x] Flickr image gallery on detail page
- [x] FavoriteButton component
- [x] Favorites page with remove capability
- [x] Charts - launches per year bar chart + success rate line chart
- [x] Error/loading states for all routes (global, charts, favorites, launches, detail)
- [x] 404 not-found page
- [x] Dark mode with system preference detection
- [x] Responsive layout (mobile hamburger menu, wrapping filters)


## Known Limitations / TODOs

- [ ] SSR/SSG for launch detail pre-rendering (`generateStaticParams`)
- [ ] Offline support / service worker for cached data
- [ ] Compare launches side-by-side with shareable URL
- [ ] Accessibility pass (skip-to-content, focus trap in mobile menu, ARIA live regions for filter changes)
- [ ] End-to-end tests
