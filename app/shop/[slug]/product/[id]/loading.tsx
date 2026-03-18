export default function ProductLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="h-[34rem] animate-pulse rounded-[28px] bg-stone-200" />
        <div className="grid gap-4">
          <div className="h-64 animate-pulse rounded-[28px] bg-stone-200" />
          <div className="h-80 animate-pulse rounded-[28px] bg-stone-200" />
        </div>
      </div>
    </main>
  );
}
