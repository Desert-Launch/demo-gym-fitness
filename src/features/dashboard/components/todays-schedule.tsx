"use client"

import Link from "next/link"
import { CalendarOff } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CapacityMeter } from "@/features/classes/components/capacity-meter"
import { formatClock, percent } from "@/lib/utils"
import type { GymClassDetail } from "@/types"

export function TodaysSchedule({
  classes,
  isPending,
}: {
  classes: GymClassDetail[]
  isPending: boolean
}) {
  if (isPending) {
    return (
      <ul className="divide-y divide-steel-200">
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index} className="flex items-center gap-4 py-4">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
          </li>
        ))}
      </ul>
    )
  }

  if (classes.length === 0) {
    return (
      <EmptyState
        icon={CalendarOff}
        title="Nothing on today"
        description="The floor is open but no classes are scheduled. Add one and it appears on the public timetable straight away."
        action={
          <Button asChild size="lg">
            <Link href="/admin/classes">Add a class</Link>
          </Button>
        }
      />
    )
  }

  return (
    <ul className="divide-y divide-steel-200 border-y border-steel-200">
      {classes.map((session) => (
        <li
          key={session.id}
          className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4"
        >
          <span className="tnum w-16 shrink-0 font-mono text-sm text-steel-600">
            {formatClock(session.startTime)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="display block text-sm text-ink">
              {session.type.name}
            </span>
            <span className="text-xs text-steel-500">
              {session.trainer.name} · {session.studio}
            </span>
          </span>
          <span className="w-44">
            <CapacityMeter
              bookedCount={session.bookedCount}
              capacity={session.capacity}
              spotsLeft={session.spotsLeft}
            />
          </span>
          <span className="tnum w-14 shrink-0 text-right font-mono text-xs text-steel-500">
            {percent(session.bookedCount, session.capacity)}%
          </span>
        </li>
      ))}
    </ul>
  )
}
