interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonRows({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3">
          <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
          </div>
          <div className="skeleton h-5 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2 p-4">
      {/* Header */}
      <div className="flex gap-4 px-2 pb-3 border-b border-[#E0E0E2]">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton h-3 rounded flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-2 py-3">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className={`skeleton h-4 rounded flex-1 ${j === 0 ? 'max-w-[60px]' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

const gridColsMap: Record<number, string> = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};

export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-2 ${gridColsMap[count] ?? 'lg:grid-cols-4'} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="stat-card p-5">
          <div className="skeleton h-3 w-24 rounded mb-3" />
          <div className="skeleton h-7 w-32 rounded mb-2" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}
