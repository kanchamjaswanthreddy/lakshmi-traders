export default function Loading() {
  return (
    <div className="bg-mesh min-h-dvh px-4 pt-14 pb-8">
      <div className="skeleton mb-5 h-9 w-36" />
      <div className="skeleton mb-4 h-12 w-full rounded-2xl" />
      <div className="mb-4 flex gap-2">
        <div className="skeleton h-9 w-20 rounded-full" />
        <div className="skeleton h-9 w-24 rounded-full" />
        <div className="skeleton h-9 w-16 rounded-full" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((g) => (
          <div key={g}>
            <div className="skeleton mb-2 h-5 w-28" />
            <div className="rounded-[16px] bg-card/50 overflow-hidden border border-border/30">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex items-center justify-between px-3 py-3 ${i < 3 ? "border-b border-border/20" : ""}`}>
                  <div className="space-y-1.5 flex-1">
                    <div className="skeleton h-4 w-40" />
                    <div className="skeleton h-3 w-16" />
                  </div>
                  <div className="flex gap-2">
                    <div className="skeleton h-4 w-14" />
                    <div className="skeleton h-4 w-14" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
