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
        "inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "default" && "bg-[linear-gradient(135deg,#0f766e,#115e59)] text-[var(--primary-foreground)] shadow-[0_14px_30px_rgba(15,118,110,0.22)]",
        variant === "secondary" && "bg-[linear-gradient(135deg,#dd8d27,#c46d06)] text-white shadow-[0_14px_30px_rgba(221,141,39,0.22)]",
        variant === "outline" && "border border-[var(--border)] bg-white/80 text-[var(--foreground)] shadow-sm backdrop-blur",
        variant === "ghost" && "bg-transparent text-[var(--foreground)] hover:bg-white/60",
        className
      )}
      {...props}
    />
  );
}
