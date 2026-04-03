"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "secondary" | "ghost";
}) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "default" && "bg-[linear-gradient(135deg,#0f766e,#115e59)] text-[var(--primary-foreground)] shadow-[0_10px_20px_rgba(15,118,110,0.16)] hover:brightness-[1.02]",
        variant === "secondary" && "bg-[#f59e0b] text-white shadow-[0_10px_20px_rgba(245,158,11,0.18)] hover:bg-[#d97706]",
        variant === "outline" && "border border-[var(--border)] bg-white text-[var(--foreground)] shadow-none hover:bg-stone-50",
        variant === "ghost" && "bg-transparent text-[var(--foreground)] hover:bg-stone-100",
        className
      )}
      {...props}
    />
  );
}
