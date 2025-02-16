export default function ActionBarSkeleton() {
  return (
    <div>
      {/* Status Bar Skeleton */}
      <div className="mb-2 p-4 rounded-lg flex items-center justify-between bg-gray-900 border border-gray-800 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-gray-700" />
          <div className="h-6 w-32 bg-gray-700 rounded" />
        </div>
        <div className="h-4 w-24 bg-gray-700 rounded" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-4 mb-2 overflow-x-auto pb-2">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col items-center flex-1 min-w-[120px] animate-pulse"
          >
            <div className="bg-gray-700 p-3 rounded-full mb-2 w-12 h-12" />
            <div className="h-4 w-16 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
} 