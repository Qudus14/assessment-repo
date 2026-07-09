import { useEffect, useMemo, useState } from "react";
import { RestaurantCard } from "./components/ResturantCard";
import { SearchFilters } from "./components/SearchFilter";
import { SkeletonCard } from "./components/SkeletonCard";
import { VoucherLedger } from "./components/VoucherLedger";
import { fetchRestaurants } from "./services/mock-api";
import type { Filters, Restaurant } from "./types";

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState<Filters>({
    cuisine: "",
    priceRange: null,
    minRating: null,
  });

  useEffect(() => {
    setLoading(true);

    fetchRestaurants().then((data) => {
      setRestaurants(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        searchTerm.length === 0 ||
        restaurant.name.toLowerCase().includes(searchTerm) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm);

      const matchesCuisine =
        !filters.cuisine || restaurant.cuisine === filters.cuisine;

      const matchesPrice =
        !filters.priceRange ||
        restaurant.priceRange === filters.priceRange;

      const matchesRating =
        !filters.minRating ||
        Number(restaurant.avgRating) >= filters.minRating;

      return (
        matchesSearch &&
        matchesCuisine &&
        matchesPrice &&
        matchesRating
      );
    });
  }, [restaurants, search, filters]);

  const activeFilters = [
    search ? `Search: "${search}"` : null,
    filters.cuisine || null,
    filters.priceRange ? "₦".repeat(filters.priceRange) : null,
    filters.minRating
      ? `${filters.minRating.toFixed(1)}+ ★`
      : null,
  ].filter(Boolean);

  const clearFilters = () => {
    setSearch("");

    setFilters({
      cuisine: "",
      priceRange: null,
      minRating: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-600 text-xl">
              🍲
            </div>

            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                LocalBuka
              </h1>

              <p className="text-xs text-slate-500">
                Discover the best local restaurants
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <span>{restaurants.length} Restaurants</span>

            <span>
              {activeFilters.length
                ? `${filtered.length} Matches`
                : "Explore Nearby"}
            </span>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="border-b border-slate-200 bg-gradient-to-r from-orange-50 via-white to-orange-50">

        <div className="mx-auto max-w-7xl px-6 py-12">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">
                Discover Local Flavour
              </p>

              <h2 className="mt-3 text-5xl font-extrabold text-slate-900">
                Find your next favourite buka.
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Browse nearby restaurants, compare ratings,
                discover authentic Nigerian dishes and redeem
                rewards every time you dine.
              </p>

            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-md">

              <p className="text-4xl font-extrabold text-orange-600">
                {restaurants.length}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Restaurants Available
              </p>

              <div className="mt-4 border-t border-orange-100 pt-4 text-sm font-medium text-slate-700">
                {activeFilters.length
                  ? `${filtered.length} matches found`
                  : "Refine to explore more"}
              </div>

            </div>

          </div>

          {/* Search */}

          <div className="mt-10 space-y-4">

            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <SearchFilters
                restaurants={restaurants}
                filters={filters}
                onChange={setFilters}
              />

              <button
                onClick={clearFilters}
                disabled={
                  !search &&
                  !filters.cuisine &&
                  !filters.priceRange &&
                  !filters.minRating
                }
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset Filters
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CONTENT ================= */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* Restaurant List */}

          <section>

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <h3 className="text-lg font-semibold text-slate-700">
                {loading
                  ? "Loading restaurants..."
                  : `${filtered.length} Restaurants Found`}
              </h3>

              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">

                  {activeFilters.map((filter) => (
                    <span
                      key={filter}
                      className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700"
                    >
                      {filter}
                    </span>
                  ))}

                </div>
              )}

            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

              {loading ? (

                Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))

              ) : filtered.length === 0 ? (

                <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">

                  <div className="text-6xl">🍽️</div>

                  <h3 className="mt-4 text-2xl font-bold text-slate-900">
                    No restaurants found
                  </h3>

                  <p className="mt-3 text-slate-500">
                    Try changing your search or filter selection.
                  </p>

                  <button
                    onClick={clearFilters}
                    className="mt-6 rounded-lg bg-orange-600 px-6 py-3 font-medium text-white hover:bg-orange-700"
                  >
                    Clear Filters
                  </button>

                </div>

              ) : (

                filtered.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                  />
                ))

              )}

            </div>

          </section>

          {/* Sidebar */}

          <aside>

            <div className="sticky top-24">

              <VoucherLedger userId="user_101" />

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default App;