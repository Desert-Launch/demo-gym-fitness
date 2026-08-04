"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useClassTypes } from "@/features/classes"
import { cn } from "@/lib/utils"

import { useTrainers } from "../hooks/use-trainers"
import { TrainerCard } from "./trainer-card"

const TONES = ["steel", "brand", "ink"] as const

export function TrainerGrid({
  limit,
  className,
}: {
  limit?: number
  className?: string
}) {
  const trainersQuery = useTrainers()
  const typesQuery = useClassTypes()

  const typeName = (id: string) =>
    typesQuery.data?.find((type) => type.id === id)?.name ?? id

  if (trainersQuery.isPending) {
    return (
      <div className={cn("grid gap-8 sm:grid-cols-2 lg:grid-cols-4", className)}>
        {Array.from({ length: limit ?? 4 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="aspect-[4/5] w-full" />
            <Skeleton className="mt-4 h-5 w-32" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>
        ))}
      </div>
    )
  }

  const trainers = limit
    ? (trainersQuery.data ?? []).slice(0, limit)
    : (trainersQuery.data ?? [])

  return (
    <div className={cn("grid gap-8 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {trainers.map((trainer, index) => (
        <TrainerCard
          key={trainer.id}
          trainer={trainer}
          tone={TONES[index % TONES.length]}
          specialtyNames={trainer.specialties.map(typeName)}
        />
      ))}
    </div>
  )
}
