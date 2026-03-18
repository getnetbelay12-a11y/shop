import type React from "react";
import { cn } from "@/lib/utils";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm outline-none placeholder:text-stone-400 focus:border-[var(--primary)]",
        props.className
      )}
    />
  );
}
