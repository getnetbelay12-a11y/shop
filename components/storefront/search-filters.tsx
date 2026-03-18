"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchFilters({ categories }: { categories: string[] }) {
  const params = useSearchParams();
  const router = useRouter();

  function update(values: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    Object.entries(values).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    router.push(`?${next.toString()}`);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_220px_auto_auto]">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
        <Input
          name="store-search"
          defaultValue={params.get("q") ?? ""}
          placeholder="Search products, tags, category..."
          className="pl-10"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              update({ q: (event.target as HTMLInputElement).value });
            }
          }}
        />
      </div>
      <select
        className="h-11 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm"
        defaultValue={params.get("category") ?? ""}
        onChange={(event) => update({ category: event.target.value })}
        >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <button
        type="button"
        className="h-11 rounded-2xl bg-[var(--primary)] px-4 text-sm font-semibold text-white"
        onClick={() => {
          const input = document.querySelector<HTMLInputElement>("input[name='store-search']");
          update({ q: input?.value ?? "" });
        }}
      >
        Search
      </button>
      <button
        type="button"
        className="h-11 rounded-2xl border border-[var(--border)] bg-white px-4 text-sm font-semibold text-stone-700"
        onClick={() => router.push("?")}
      >
        Reset
      </button>
    </div>
  );
}
