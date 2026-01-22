export interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700'
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  )
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="h-full flex flex-col border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <Skeleton variant="rectangular" height="100%" className="aspect-square" />
      <div className="p-4 flex-1 flex flex-col gap-3">
        <Skeleton variant="text" width="30%" height={20} />
        <Skeleton variant="text" width="100%" height={24} />
        <Skeleton variant="text" width="80%" height={16} />
        <Skeleton variant="text" width="60%" height={16} />
        <div className="flex items-center justify-between mt-auto">
          <Skeleton variant="text" width="25%" height={28} />
          <Skeleton variant="rectangular" width={80} height={36} className="rounded" />
        </div>
      </div>
    </div>
  )
}

// Products Grid Skeleton
export function ProductsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
