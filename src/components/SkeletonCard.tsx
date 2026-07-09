export function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse shadow-sm h-full flex flex-col">
            <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-4" />
            <div className="flex justify-between items-start mb-2">
                <div className="h-5 bg-gray-200 rounded-md w-2/3" />
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
            </div>
            <div className="h-4 bg-gray-100 rounded-md w-1/3 mb-4" />

            <div className="mt-auto pt-3 flex gap-2 border-t border-gray-50">
                <div className="h-6 w-12 bg-gray-100 rounded-md" />
                <div className="h-6 w-16 bg-gray-100 rounded-md" />
            </div>
        </div>
    );
}