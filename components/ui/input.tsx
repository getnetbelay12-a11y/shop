import type React from "react";
import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-2xl border border-[var(--border)] bg-white px-4 text-sm outline-none ring-0 placeholder:text-stone-400 focus:border-[var(--primary)]",
        props.className
      )}
    />
  );
}
