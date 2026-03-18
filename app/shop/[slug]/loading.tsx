export default function StorefrontLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <div className="animate-pulse space-y-6">
        <div className="h-72 rounded-[28px] bg-stone-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 rounded-[28px] bg-stone-200" />
          ))}
        </div>
      </div>
    </main>
  );
}
