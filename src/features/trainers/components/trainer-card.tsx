import Link from "next/link"

import { cn, initials } from "@/lib/utils"
import type { Trainer } from "@/types"

/**
 * No stock photography anywhere in this build — coaches get a hatched panel and
 * their initials set in the display face.
 */
export function TrainerPortrait({
  name,
  className,
  tone = "steel",
}: {
  name: string
  className?: string
  tone?: "steel" | "brand" | "ink"
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex aspect-[4/5] items-end justify-start p-4",
        tone === "brand" ? "hatch-brand" : tone === "ink" ? "hatch-ink" : "hatch",
        className
      )}
    >
      <span
        className={cn(
          "display text-4xl leading-none",
          tone === "ink" ? "text-steel-0/90" : "text-ink/80"
        )}
      >
        {initials(name)}
      </span>
    </div>
  )
}

export function TrainerCard({
  trainer,
  specialtyNames,
  tone = "steel",
  className,
}: {
  trainer: Trainer
  specialtyNames: string[]
  tone?: "steel" | "brand" | "ink"
  className?: string
}) {
  return (
    <article className={cn("group", className)}>
      <Link href={`/trainers/${trainer.slug}`} className="block">
        <TrainerPortrait
          name={trainer.name}
          tone={tone}
          className="transition-opacity group-hover:opacity-90"
        />
        <div className="mt-4 border-t-2 border-ink pt-3">
          <h3 className="display text-base text-ink group-hover:text-brand">
            {trainer.name}
          </h3>
          <p className="mt-1 text-xs text-steel-500">{trainer.headline}</p>
          <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-400">
            {specialtyNames.join(" · ")}
          </p>
        </div>
      </Link>
    </article>
  )
}
