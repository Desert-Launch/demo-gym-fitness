"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatAed } from "@/lib/utils"

import { COMPARISON_ROWS } from "../comparison"
import { usePlans } from "../hooks/use-plans"

export function PlanComparison({ className }: { className?: string }) {
  const { data, isPending } = usePlans()

  if (isPending) {
    return <Skeleton className={cn("h-[420px] w-full", className)} />
  }

  const plans = data ?? []

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[720px] border-collapse text-left">
        <caption className="sr-only">
          What each membership plan includes, side by side.
        </caption>
        <thead>
          <tr>
            <th scope="col" className="w-[26%] border-b-2 border-ink pb-4 pr-4">
              <span className="eyebrow text-steel-500">What you get</span>
            </th>
            {plans.map((plan) => (
              <th
                key={plan.id}
                scope="col"
                className={cn(
                  "border-b-2 border-ink px-4 pb-4 align-bottom",
                  plan.featured && "bg-paper"
                )}
              >
                <span className="display block text-base text-ink">
                  {plan.name}
                </span>
                <span className="tnum mt-1 block font-mono text-xs text-steel-500">
                  {formatAed(plan.priceAed)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row) => (
            <tr key={row.label}>
              <th
                scope="row"
                className="border-b border-steel-200 py-4 pr-4 text-sm font-medium text-ink"
              >
                {row.label}
              </th>
              {plans.map((plan) => {
                const value = row.values[plan.slug] ?? "—"
                return (
                  <td
                    key={plan.id}
                    className={cn(
                      "border-b border-steel-200 px-4 py-4 text-sm",
                      value === "—" ? "text-steel-500" : "text-steel-700",
                      plan.featured && "bg-paper"
                    )}
                  >
                    {value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
