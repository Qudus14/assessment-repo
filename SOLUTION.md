# LocalBuka Frontend Assessment — Solution Write-up

## Q1: Rollback Strategy & Component State

The Favorite toggle uses an optimistic update pattern in `FavoriteButton.tsx`:

```tsx
const handleToggle = async () => {
  const previousState = isFavorited;
  setIsFavorited(!previousState); // 1. Update UI instantly
  setIsPending(true);

  try {
    await toggleFavorite(restaurantId); // 2. Fire the mock request
  } catch (err) {
    setIsFavorited(previousState); // 3. Rollback to pre-click state
    alert('Could not update favorite. Please try again.');
  } finally {
    setIsPending(false);
  }
};
```

Key design decisions:
- I capture `previousState` at click-time rather than referencing `isFavorited` directly
  inside the catch block, to avoid stale-closure bugs if the user could somehow trigger
  overlapping toggles.
- `isPending` disables the button mid-flight, preventing double-fire race conditions.
- On failure, the rollback restores the *exact* prior boolean rather than just inverting
  the current state, which matters if multiple state transitions could happen in flight.

The same pattern is reused in `usePointsLedger.ts` for the voucher redemption flow —
optimistically deducting points and inserting a pending transaction, then reconciling
or rolling back based on the mock API's resolution.

## Q2: Virtualization & Large Lists Rendering

If the restaurant feed grew to 200+ cards on a mobile browser, rendering all of them into the DOM at once would hurt scroll performance — every scroll event forces the browser to recalculate layout/paint for hundreds of off-screen nodes, and image-heavy cards (like ours, with a 40px-tall photo each) make this worse due to decode and compositing costs.
Approach: List virtualization (windowing)
    The core idea is to only mount DOM nodes for the items currently visible in the viewport, plus a small buffer above/below, and recycle nodes as the user scrolls — rather than rendering the full list.

Implementation plan:

1. Library choice: Use react-window (specifically FixedSizeList or FixedSizeGrid for our grid layout) or @tanstack/react-virtual if I want more control over dynamic row heights. Given our cards have a fixed height (h-40 image + fixed text block), FixedSizeList/Grid is simplest and fastest.

2. Grid virtualization specifics: Since we render a responsive grid (1-3 columns depending on breakpoint), I'd use FixedSizeGrid and compute columnCount based on container width via a ResizeObserver or a hook like useWindowSize, then chunk the restaurant array into rows of that column count.
3. Buffer/overscan: Set overscanCount (react-window) to render a couple of extra rows above/below the visible window, so fast scrolling doesn't show blank gaps while new rows mount.
4. Image loading: Combine virtualization with loading="lazy" on images (already effectively free since off-screen cards aren't mounted at all) and keep the existing onError fallback logic per-card — virtualization doesn't change that logic, it just changes which cards exist in the DOM at a given moment.
5. Skeleton loaders: Keep skeleton rendering for the initial fetch (small count, e.g., 6), separate from virtualization — virtualization only matters once we have real data to scroll through.

Trade-offs I'd flag:

- Virtualized lists lose native browser scroll-to-anchor/Ctrl+F find-in-page behavior, since off-screen content literally isn't in the DOM. Acceptable for a discovery feed, less so for content users need to search within the page.
- Slightly more complex responsive logic (recalculating column count on resize) compared to a simple CSS grid.
- If I had more time, I'd benchmark react-window vs @tanstack/react-virtual — the latter has better support for variable-height items, which matters if card heights ever become dynamic (e.g., longer restaurant names wrapping to two lines).

What I'd measure to confirm it works: Chrome DevTools Performance tab — record a scroll pass before/after virtualization and compare the number of "Layout" and "Paint" events, plus confirm frame time stays under ~16.6ms (60fps) during fast scroll.

## Trade-offs & What I'd Improve With More Time

- **Redeemed points don't persist to the mock ledger.** `redeemPoints()` returns a new
  balance but doesn't mutate `mock_data.json`'s `pointsLedger`, so a page refresh resets
  state. In a real backend this would be a proper DB write.
- **Hardcoded `userId="user_101"`** — there's no auth in this assessment scope, so the
  ledger panel is wired to a single mock user rather than a login flow.
- **No debounce on the search input** — for a larger dataset I'd debounce the text filter
  (e.g., 200-300ms) to avoid re-filtering on every keystroke.
- **Search filters combine as strict AND logic** (cuisine + price + rating + text all
  must match) rather than offering OR/toggle-based multi-select — kept simple given the
  time constraint, but a real product would likely want multi-select cuisine chips.
- **List virtualization not implemented**, only described (see Q2) — with 5 mock
  restaurants there was no performance case to justify the added complexity, but the
  approach is documented for when the dataset scales.
- **No automated tests** — given the time constraint I prioritized functional completeness
  and the optimistic-update logic (the highest-weighted rubric items) over test coverage.