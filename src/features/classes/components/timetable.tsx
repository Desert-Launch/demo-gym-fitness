"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { AlertTriangle, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useTrainers } from "@/features/trainers"
import { cn, formatClock, formatDuration } from "@/lib/utils"
import { DAYS, formatDayDate, todayIndex } from "@/lib/week"
import type { ClassTypeId, DayOfWeek, GymClassDetail } from "@/types"

import { useClasses, useClassTypes } from "../hooks/use-classes"
import { CapacityMeter } from "./capacity-meter"

const ALL = "all" as const

export function Timetable() {
  const classesQuery = useClasses()
  const typesQuery = useClassTypes()
  const trainersQuery = useTrainers()

  const [typeFilter, setTypeFilter] = useState<ClassTypeId | typeof ALL>(ALL)
  const [trainerFilter, setTrainerFilter] = useState<string>(ALL)
  const [activeDay, setActiveDay] = useState<DayOfWeek>(() => todayIndex())

  const filtered = useMemo(
    () =>
      (classesQuery.data ?? []).filter(
        (gymClass) =>
          (typeFilter === ALL || gymClass.typeId === typeFilter) &&
          (trainerFilter === ALL || gymClass.trainerId === trainerFilter)
      ),
    [classesQuery.data, typeFilter, trainerFilter]
  )

  const times = useMemo(
    () =>
      [...new Set(filtered.map((gymClass) => gymClass.startTime))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [filtered]
  )

  const cell = (day: DayOfWeek, time: string) =>
    filtered.filter((c) => c.dayOfWeek === day && c.startTime === time)

  const today = todayIndex()
  const isFiltered = typeFilter !== ALL || trainerFilter !== ALL

  if (classesQuery.isPending) return <TimetableSkeleton />

  if (classesQuery.isError) {
    return (
      <div className="border-2 border-ink bg-paper p-8 text-center">
        <AlertTriangle className="mx-auto size-6 text-brand" />
        <p className="display mt-4 text-display-sm">The timetable didn&apos;t load</p>
        <p className="mt-2 text-sm text-steel-600">
          {classesQuery.error.message}
        </p>
        <Button
          className="mt-6"
          size="lg"
          onClick={() => void classesQuery.refetch()}
        >
          <RotateCw /> Try again
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-4 border-y-2 border-ink py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1 text-steel-500">Class</span>
          <FilterChip
            active={typeFilter === ALL}
            onClick={() => setTypeFilter(ALL)}
          >
            All
          </FilterChip>
          {(typesQuery.data ?? []).map((type) => (
            <FilterChip
              key={type.id}
              active={typeFilter === type.id}
              onClick={() => setTypeFilter(type.id)}
            >
              {type.name}
            </FilterChip>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="trainer-filter" className="eyebrow text-steel-500">
            Coach
          </label>
          <Select value={trainerFilter} onValueChange={setTrainerFilter}>
            <SelectTrigger id="trainer-filter" className="w-[220px]">
              <SelectValue placeholder="Any coach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Any coach</SelectItem>
              {(trainersQuery.data ?? []).map((trainer) => (
                <SelectItem key={trainer.id} value={trainer.id}>
                  {trainer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border-x border-b border-steel-200 bg-paper px-6 py-16 text-center">
          <p className="display text-display-sm">Nothing matches that yet</p>
          <p className="mx-auto mt-3 max-w-[42ch] text-sm text-steel-600">
            No sessions match this coach and class combination. Clear the filters
            to see the full week.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="mt-6"
            onClick={() => {
              setTypeFilter(ALL)
              setTrainerFilter(ALL)
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop: the week as a grid */}
          <div className="hidden lg:block">
            <table className="w-full table-fixed border-separate border-spacing-0">
              <caption className="sr-only">
                Weekly class timetable. Times run down the left, days across the
                top. Each session shows its coach and how many spots are left.
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[76px] p-0">
                    <span className="sr-only">Time</span>
                  </th>
                  {DAYS.map((day) => (
                    <th
                      key={day.value}
                      scope="col"
                      className={cn(
                        "border-b-2 border-ink px-3 pb-3 pt-4 text-left align-bottom",
                        day.value === today && "bg-paper"
                      )}
                    >
                      <span className="flex items-baseline gap-2">
                        <span className="display text-base text-ink">
                          {day.short}
                        </span>
                        <span className="font-mono text-[0.6875rem] text-steel-500">
                          {formatDayDate(day.value)}
                        </span>
                      </span>
                      {day.value === today ? (
                        <span className="eyebrow mt-1 block text-brand">
                          Today
                        </span>
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {times.map((time) => (
                  <tr key={time}>
                    <th
                      scope="row"
                      className="border-b border-steel-200 py-3 pr-3 text-right align-top"
                    >
                      <span className="tnum font-mono text-xs text-steel-500">
                        {time}
                      </span>
                    </th>
                    {DAYS.map((day) => {
                      const sessions = cell(day.value, time)
                      return (
                        <td
                          key={day.value}
                          className={cn(
                            "border-b border-l border-steel-200 p-1 align-top",
                            day.value === today && "bg-paper"
                          )}
                        >
                          {sessions.map((session) => (
                            <SessionCell key={session.id} session={session} />
                          ))}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: one day at a time */}
          <div className="lg:hidden">
            <div
              role="tablist"
              aria-label="Day"
              className="flex gap-1 overflow-x-auto border-b border-steel-200 py-3"
            >
              {DAYS.map((day) => {
                const count = filtered.filter(
                  (c) => c.dayOfWeek === day.value
                ).length
                return (
                  <button
                    key={day.value}
                    role="tab"
                    type="button"
                    aria-selected={activeDay === day.value}
                    onClick={() => setActiveDay(day.value)}
                    className={cn(
                      "flex min-w-[64px] shrink-0 flex-col items-center gap-1 border px-3 py-2 transition-colors",
                      activeDay === day.value
                        ? "border-ink bg-ink text-steel-25"
                        : "border-steel-200 bg-paper text-steel-600"
                    )}
                  >
                    <span className="display text-sm">{day.short}</span>
                    <span className="font-mono text-[0.625rem] opacity-70">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            <ul className="divide-y divide-steel-200">
              {filtered
                .filter((session) => session.dayOfWeek === activeDay)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((session) => (
                  <li key={session.id}>
                    <SessionRow session={session} />
                  </li>
                ))}
              {filtered.filter((session) => session.dayOfWeek === activeDay)
                .length === 0 ? (
                <li className="px-1 py-10 text-center text-sm text-steel-600">
                  No sessions on {DAYS[activeDay].long}
                  {isFiltered ? " with these filters" : ""}.
                </li>
              ) : null}
            </ul>
          </div>
        </>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-steel-500">
        <span className="flex items-center gap-2">
          <span className="h-1 w-6 bg-ice-bright" /> Spots open
        </span>
        <span className="flex items-center gap-2">
          <span className="h-1 w-6 bg-brand-bright" /> Nearly full
        </span>
        <span className="flex items-center gap-2">
          <span className="hatch h-3 w-6 border border-steel-300" /> Full —
          waitlist only
        </span>
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-ink bg-ink text-steel-25"
          : "border-steel-300 bg-transparent text-steel-600 hover:border-ink hover:text-ink"
      )}
    >
      {children}
    </button>
  )
}

function SessionCell({ session }: { session: GymClassDetail }) {
  return (
    <Link
      href={`/book/${session.id}`}
      className={cn(
        "group block h-full border-l-2 border-transparent bg-transparent p-2 transition-colors hover:border-brand-bright hover:bg-steel-100",
        session.isFull && "hatch"
      )}
    >
      <span className="display block text-[0.8125rem] leading-tight text-ink">
        {session.type.name}
      </span>
      <span className="mt-1 block truncate text-[0.6875rem] text-steel-500">
        {session.trainer.name.split(" ")[0]} ·{" "}
        {formatDuration(session.durationMinutes)}
      </span>
      <CapacityMeter
        className="mt-2"
        size="sm"
        bookedCount={session.bookedCount}
        capacity={session.capacity}
        spotsLeft={session.spotsLeft}
      />
    </Link>
  )
}

function SessionRow({ session }: { session: GymClassDetail }) {
  return (
    <Link
      href={`/book/${session.id}`}
      className="flex items-center gap-4 py-4 transition-colors hover:bg-steel-100"
    >
      <span className="tnum w-16 shrink-0 font-mono text-sm text-steel-600">
        {formatClock(session.startTime)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="display block text-base text-ink">
          {session.type.name}
        </span>
        <span className="mt-0.5 block truncate text-xs text-steel-500">
          {session.trainer.name} · {session.studio} ·{" "}
          {formatDuration(session.durationMinutes)}
        </span>
        <CapacityMeter
          className="mt-2 max-w-[220px]"
          size="sm"
          bookedCount={session.bookedCount}
          capacity={session.capacity}
          spotsLeft={session.spotsLeft}
        />
      </span>
    </Link>
  )
}

function TimetableSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between border-y-2 border-ink py-4">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-7 w-20" />
          ))}
        </div>
        <Skeleton className="h-10 w-[220px]" />
      </div>
      <div className="grid grid-cols-2 gap-px bg-steel-200 lg:grid-cols-7">
        {Array.from({ length: 14 }).map((_, index) => (
          <div key={index} className="bg-chalk p-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="mt-2 h-3 w-24" />
            <Skeleton className="mt-3 h-1 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
