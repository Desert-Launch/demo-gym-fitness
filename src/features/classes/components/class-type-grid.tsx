"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn, pluralize } from "@/lib/utils"

import { useClasses, useClassTypes } from "../hooks/use-classes"
import { IntensityMeter } from "./intensity-meter"

/** The six things you can book, with how often each runs this week. */
export function ClassTypeGrid({ className }: { className?: string }) {
  const typesQuery = useClassTypes()
  const classesQuery = useClasses()

  if (typesQuery.isPending) {
    return (
      <div className={cn("grid gap-px bg-steel-200 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-chalk p-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="mt-4 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  const classes = classesQuery.data ?? []

  return (
    <div
      className={cn(
        "grid gap-px border border-steel-200 bg-steel-200 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {(typesQuery.data ?? []).map((type) => {
        const sessions = classes.filter((c) => c.typeId === type.id).length
        return (
          <Link
            key={type.id}
            href="/classes"
            className="group relative flex flex-col bg-chalk p-6 transition-colors hover:bg-paper"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="display text-display-sm text-ink">{type.name}</h3>
              <ArrowUpRight className="size-4 shrink-0 text-steel-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-steel-600">
              {type.description}
            </p>
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-steel-200 pt-4">
              <IntensityMeter intensity={type.intensity} />
              <span className="tnum font-mono text-[0.6875rem] text-steel-500">
                {sessions} {pluralize(sessions, "session", "sessions")}/wk
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
