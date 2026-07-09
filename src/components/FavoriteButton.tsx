import { useState } from 'react';
import { toggleFavorite } from '../services/mock-api';

// --- FavoriteButton.tsx ---
export function FavoriteButton({ restaurantId, initialFavorited = false }: { restaurantId: string, initialFavorited?: boolean }) {
    const [isFavorited, setIsFavorited] = useState(initialFavorited);
    const [isPending, setIsPending] = useState(false);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent accidental navigation if card becomes a link later
        const previousState = isFavorited;
        setIsFavorited(!previousState);
        setIsPending(true);

        try {
            await toggleFavorite(restaurantId);
        } catch (err) {
            setIsFavorited(previousState);
            alert('Could not update favorite. Please try again.');
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            className={`flex items-center justify-center p-2 rounded-full transition-all duration-200 active:scale-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ${isFavorited ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-gray-400 hover:text-red-400 hover:bg-gray-100'
                } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span className="text-xl leading-none">{isFavorited ? '♥' : '♡'}</span>
        </button>
    );
}