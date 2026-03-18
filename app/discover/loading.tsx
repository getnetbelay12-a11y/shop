export default function DiscoverLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-72 rounded-2xl bg-stone-200" />
        <div className="h-5 w-96 rounded-2xl bg-stone-200" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 rounded-[28px] bg-stone-200" />
          ))}
        </div>
      </div>
    </main>
  );
}
