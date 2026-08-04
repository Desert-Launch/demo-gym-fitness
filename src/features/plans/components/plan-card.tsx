import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn, formatAed } from "@/lib/utils"
import type { Plan } from "@/types"

const PERIOD_LABEL: Record<Plan["billingPeriod"], string> = {
  day: "per day",
  month: "per month",
  quarter: "per quarter",
  year: "per year",
}

export function PlanCard({
  plan,
  href = "/join",
  className,
}: {
  plan: Plan
  href?: string
  className?: string
}) {
  return (
    <article
      className={cn(
        "flex flex-col border bg-paper p-6",
        plan.featured
          ? "border-2 border-ink shadow-raised"
          : "border-steel-200",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="display text-display-sm text-ink">{plan.name}</h3>
        {plan.featured ? (
          <span className="eyebrow bg-brand px-2 py-1 text-white">
            Most picked
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-steel-600">{plan.tagline}</p>

      <p className="mt-6 flex items-baseline gap-2">
        <span className="tnum font-mono text-3xl font-bold text-ink">
          {formatAed(plan.priceAed)}
        </span>
        <span className="text-xs text-steel-500">
          {PERIOD_LABEL[plan.billingPeriod]}
        </span>
      </p>

      <p className="mt-2 font-mono text-[0.6875rem] text-steel-500">
        {plan.monthlyClassCredits === null
          ? "Unlimited classes"
          : `${plan.monthlyClassCredits} ${plan.monthlyClassCredits === 1 ? "class" : "classes"} a month`}
      </p>

      <ul className="mt-6 flex-1 space-y-3 border-t border-steel-200 pt-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm text-steel-700">
            <Check className="mt-0.5 size-4 shrink-0 text-brand" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        asChild
        size="lg"
        variant={plan.featured ? "default" : "outline"}
        className="mt-8 w-full"
      >
        <Link href={`${href}?plan=${plan.slug}`}>
          {plan.billingPeriod === "day" ? "Buy a day pass" : "Join now"}
        </Link>
      </Button>
    </article>
  )
}
