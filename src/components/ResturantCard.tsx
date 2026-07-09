import { useState } from "react";
import type { Restaurant } from "../types";
import { FavoriteButton } from "./FavoriteButton";

const FALLBACK_IMAGE =
    "https://placehold.co/600x400/f3f4f6/a1a1aa?text=No+Image";

const priceLabels: Record<number, string> = {
    1: "Budget",
    2: "Moderate",
    3: "Premium",
    4: "Luxury",
};

export function RestaurantCard({
    restaurant,
}: {
    restaurant: Restaurant;
}) {
    const [imgSrc, setImgSrc] = useState(
        restaurant.images?.[0] || FALLBACK_IMAGE
    );

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            {/* Image */}

            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                    src={imgSrc}
                    alt={restaurant.name}
                    onError={() => setImgSrc(FALLBACK_IMAGE)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Status */}

                <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow ${restaurant.isOpen
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                >
                    {restaurant.isOpen ? "Open" : "Closed"}
                </span>

                {/* Favourite */}

                <div className="absolute right-3 top-3">
                    <FavoriteButton restaurantId={restaurant.id} />
                </div>
            </div>

            {/* Content */}

            <div className="flex flex-1 flex-col p-5">

                <div>

                    <h3 className="line-clamp-1 text-xl font-bold text-slate-900">
                        {restaurant.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        📍 {restaurant.address}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-sm">

                        <span className="rounded-full bg-orange-100 px-3 py-1 font-medium text-orange-700">
                            {restaurant.cuisine}
                        </span>

                        <span className="text-slate-300">•</span>

                        <span className="font-medium text-slate-600">
                            {"₦".repeat(restaurant.priceRange)}
                        </span>

                        <span className="text-xs text-slate-400">
                            ({priceLabels[restaurant.priceRange]})
                        </span>

                    </div>

                </div>

                {/* Bottom */}

                <div className="mt-auto pt-5">

                    <div className="mb-4 flex items-center gap-2">

                        <div className="flex items-center rounded-lg bg-yellow-50 px-3 py-1">

                            <span className="mr-1 text-yellow-500">★</span>

                            <span className="font-semibold text-yellow-700">
                                {Number(restaurant.avgRating).toFixed(1)}
                            </span>

                        </div>

                    </div>

                    <div className="flex flex-wrap gap-2">

                        {restaurant.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                            >
                                #{tag}
                            </span>
                        ))}

                    </div>

                </div>

            </div>
        </div>
    );
}