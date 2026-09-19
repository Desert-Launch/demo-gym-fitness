import Link from "next/link"

import { cn } from "@/lib/utils"

/**
 * The wordmark: FORGE set in Archivo Black with a scarlet bar standing in for
 * the anvil. The bar is the one graphic mark the whole identity leans on.
 */
export function Logo({
  className,
  tone = "ink",
}: {
  className?: string
  tone?: "ink" | "chalk"
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-baseline gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        className
      )}
      aria-label="Demo Gym — home"
    >
      <span
        className={cn(
          "display text-[1.35rem] leading-none tracking-[-0.02em]",
          tone === "ink" ? "text-ink" : "text-steel-25"
        )}
      >
        Demo
      </span>
      <span
        aria-hidden
        className="h-[3px] w-6 shrink-0 translate-y-[-3px] bg-brand-bright transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:w-9"
      />
      <span
        className={cn(
          "eyebrow hidden sm:inline",
          tone === "ink" ? "text-steel-500" : "text-steel-400"
        )}
      >
        Gym
      </span>
    </Link>
  )
}
