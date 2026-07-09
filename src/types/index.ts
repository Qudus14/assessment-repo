export interface RawRestaurant {
    id: string;
    name: string;
    cuisine: string;
    priceRange: number;
    location: { lat: number; lng: number };
    address: string;
    tags: string[];
    avgRating: string;
    isOpen: number;           // 0 or 1, not boolean!
    images: string[];         // can be empty
}

export interface RawReview {
    id: string;
    restaurantId: string;
    userId: string;
    rating: number;
    comment: string;
    tags: string[];
    createdAt: string;
}

export interface RawTransaction {
    id: string;
    userId: string;
    action: 'earn' | 'redeem' | 'review' | 'check-in' | 'referral';
    points: number;
    createdAt: string;
}

export interface RawUser {
    id: string;
    name: string;
    email: string;
    referredBy: string | null;
}


export interface Restaurant {
    id: string;
    name: string;
    cuisine: string;
    priceRange: 1 | 2 | 3 | 4;
    location: { lat: number; lng: number };
    address: string;
    tags: string[];
    avgRating: number;
    isOpen: boolean;
    images: string[];
    distance?: number;
}

export interface Review {
    id: string;
    restaurantId: string;
    userId: string;
    rating: number;
    comment: string;
    tags: string[];
    createdAt: string;
}

export interface Transaction {
    id: string;
    userId: string;
    action: 'earn' | 'redeem' | 'review' | 'check-in' | 'referral';
    points: number;
    createdAt: string;
}

export interface Filters {
    cuisine: string;
    priceRange: number | null;
    minRating: number | null;
}