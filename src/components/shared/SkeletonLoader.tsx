// Reusable skeleton shimmer for loading states
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-gray-800 rounded animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <SkeletonBlock className="h-4 w-1/3" />
      <SkeletonBlock className="h-8 w-1/2" />
    </div>
  );
}

export function PortalLoadingSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar placeholder */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header placeholder */}
        <div className="h-16 bg-gray-900 border-b border-gray-800 flex-shrink-0" />
        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-hidden">
          <SkeletonBlock className="h-7 w-48" />
          <div className={`grid grid-cols-${Math.min(cards, 4)} gap-4`}>
            {Array.from({ length: cards }).map((_, i) => (
              <SkeletonCard key={i} />
             ))}
          </div>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
