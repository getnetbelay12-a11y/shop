import type React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-[28px] border border-[var(--border)] bg-[var(--card)] shadow-[var(--surface-shadow)] backdrop-blur", className)} {...props} />;
}
