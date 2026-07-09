import type { Filters, Restaurant } from "../types";

interface SearchFiltersProps {
    restaurants: Restaurant[];
    filters: Filters;
    onChange: (filters: Filters) => void;
}

export function SearchFilters({
    restaurants,
    filters,
    onChange,
}: SearchFiltersProps) {
    // Get unique cuisines from the restaurant data
    const cuisines = Array.from(
        new Set(restaurants.map((restaurant) => restaurant.cuisine))
    ).sort();

    const updateFilter = (patch: Partial<Filters>) => {
        onChange({
            ...filters,
            ...patch,
        });
    };

    const selectClass =
        "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 md:w-auto";

    return (
        <div className="flex flex-wrap items-center gap-3">

            {/* Cuisine */}

            <select
                value={filters.cuisine}
                onChange={(e) =>
                    updateFilter({
                        cuisine: e.target.value,
                    })
                }
                className={selectClass}
            >
                <option value="">All Cuisines</option>

                {cuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                        {cuisine}
                    </option>
                ))}
            </select>

            {/* Price */}

            <select
                value={filters.priceRange ?? ""}
                onChange={(e) =>
                    updateFilter({
                        priceRange: e.target.value
                            ? Number(e.target.value)
                            : null,
                    })
                }
                className={selectClass}
            >
                <option value="">Any Price</option>
                <option value="1">₦ Budget</option>
                <option value="2">₦₦ Moderate</option>
                <option value="3">₦₦₦ Premium</option>
                <option value="4">₦₦₦₦ Luxury</option>
            </select>

            {/* Rating */}

            <select
                value={filters.minRating ?? ""}
                onChange={(e) =>
                    updateFilter({
                        minRating: e.target.value
                            ? Number(e.target.value)
                            : null,
                    })
                }
                className={selectClass}
            >
                <option value="">Any Rating</option>
                <option value="4.5">⭐ 4.5 & above</option>
                <option value="4">⭐ 4.0 & above</option>
                <option value="3.5">⭐ 3.5 & above</option>
            </select>

            {(filters.cuisine ||
                filters.priceRange ||
                filters.minRating) && (
                    <button
                        type="button"
                        onClick={() =>
                            onChange({
                                cuisine: "",
                                priceRange: null,
                                minRating: null,
                            })
                        }
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        Clear Filters
                    </button>
                )}
        </div>
    );
}