"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { usePlans } from "../hooks/use-plans"
import { PlanCard } from "./plan-card"

export function PlanGrid({ className }: { className?: string }) {
  const { data, isPending } = usePlans()

  if (isPending) {
    return (
      <div className={cn("grid gap-6 md:grid-cols-2 xl:grid-cols-4", className)}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="border border-steel-200 bg-paper p-6">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="mt-3 h-4 w-40" />
            <Skeleton className="mt-6 h-9 w-32" />
            <Skeleton className="mt-8 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-5/6" />
            <Skeleton className="mt-2 h-3 w-4/6" />
            <Skeleton className="mt-8 h-12 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("grid gap-6 md:grid-cols-2 xl:grid-cols-4", className)}>
      {(data ?? []).map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  )
}
