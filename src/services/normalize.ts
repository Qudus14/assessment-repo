import type { RawRestaurant, Restaurant } from "../types";


export function normalizeRestaurant(raw: RawRestaurant): Restaurant {
    return {
        ...raw,
        priceRange: raw.priceRange as 1 | 2 | 3 | 4,
        avgRating: parseFloat(raw.avgRating) || 0,
        isOpen: Boolean(raw.isOpen),
        images: raw.images ?? [],
    };
}