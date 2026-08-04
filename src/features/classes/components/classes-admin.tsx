"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import {
  CalendarPlus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
} from "lucide-react"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { DataTable, type Column } from "@/components/shared/data-table"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ClassBookingsSheet } from "@/features/bookings/components/class-bookings-sheet"
import { cn, formatClock, formatDuration } from "@/lib/utils"
import { DAYS, dayLabel } from "@/lib/week"
import type { ClassTypeId, GymClassDetail } from "@/types"

import { useClasses, useClassTypes, useDeleteClass } from "../hooks/use-classes"
import { CLASS_LEVEL_LABELS } from "../schema"
import { CapacityMeter } from "./capacity-meter"
import { ClassFormDialog } from "./class-form-dialog"

const ALL = "all"

export function ClassesAdmin() {
  const classesQuery = useClasses()
  const typesQuery = useClassTypes()
  const deleteClass = useDeleteClass()

  const [dayFilter, setDayFilter] = useState<string>(ALL)
  const [typeFilter, setTypeFilter] = useState<string>(ALL)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<GymClassDetail | null>(null)
  const [bookingsFor, setBookingsFor] = useState<GymClassDetail | null>(null)
  const [pendingDelete, setPendingDelete] = useState<GymClassDetail | null>(null)

  const rows = useMemo(() => {
    const all = classesQuery.data ?? []
    return all
      .filter(
        (session) =>
          (dayFilter === ALL || session.dayOfWeek === Number(dayFilter)) &&
          (typeFilter === ALL || session.typeId === (typeFilter as ClassTypeId))
      )
      .sort(
        (a, b) =>
          a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)
      )
  }, [classesQuery.data, dayFilter, typeFilter])

  // The sheet keeps its own copy of the session, so refresh it from the query.
  const liveBookingsFor = bookingsFor
    ? ((classesQuery.data ?? []).find((c) => c.id === bookingsFor.id) ?? null)
    : null

  const columns: Column<GymClassDetail>[] = [
    {
      key: "when",
      header: "When",
      className: "w-[132px]",
      cell: (session) => (
        <span className="block">
          <span className="display block text-sm text-ink">
            {dayLabel(session.dayOfWeek, "short")}
          </span>
          <span className="tnum font-mono text-xs text-steel-500">
            {formatClock(session.startTime)}
          </span>
        </span>
      ),
    },
    {
      key: "class",
      header: "Class",
      cell: (session) => (
        <span className="block">
          <span className="block text-sm font-medium text-ink">
            {session.type.name}
          </span>
          <span className="text-xs text-steel-500">
            {CLASS_LEVEL_LABELS[session.level]} ·{" "}
            {formatDuration(session.durationMinutes)}
          </span>
        </span>
      ),
    },
    {
      key: "coach",
      header: "Coach",
      className: "hidden md:table-cell",
      cell: (session) => (
        <span className="text-sm text-steel-700">{session.trainer.name}</span>
      ),
    },
    {
      key: "studio",
      header: "Studio",
      className: "hidden lg:table-cell",
      cell: (session) => (
        <span className="text-sm text-steel-700">{session.studio}</span>
      ),
    },
    {
      key: "capacity",
      header: "Filled",
      className: "w-[180px]",
      cell: (session) => (
        <span className="block">
          <CapacityMeter
            bookedCount={session.bookedCount}
            capacity={session.capacity}
            spotsLeft={session.spotsLeft}
          />
          <span className="tnum mt-1 block font-mono text-[0.6875rem] text-steel-500">
            {session.bookedCount}/{session.capacity}
            {session.waitlistCount > 0
              ? ` · ${session.waitlistCount} waiting`
              : ""}
          </span>
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      srOnlyHeader: true,
      className: "w-[56px] text-right",
      cell: (session) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal />
              <span className="sr-only">Actions for {session.type.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setBookingsFor(session)}>
              <Users /> See bookings
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setEditing(session)
                setFormOpen(true)
              }}
            >
              <Pencil /> Edit class
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setPendingDelete(session)}
            >
              <Trash2 /> Delete class
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const isFiltered = dayFilter !== ALL || typeFilter !== ALL

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-5">
        <div>
          <p className="eyebrow text-steel-500">Schedule</p>
          <h1 className="display mt-3 text-display-md text-ink">Classes</h1>
          <p className="mt-2 text-sm text-steel-600">
            {classesQuery.data?.length ?? 0} sessions a week. Edits show on the
            public timetable immediately.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <CalendarPlus /> Add class
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Select value={dayFilter} onValueChange={setDayFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Any day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any day</SelectItem>
            {DAYS.map((day) => (
              <SelectItem key={day.value} value={String(day.value)}>
                {day.long}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Any class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any class</SelectItem>
            {(typesQuery.data ?? []).map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltered ? (
          <Button
            variant="ghost"
            onClick={() => {
              setDayFilter(ALL)
              setTypeFilter(ALL)
            }}
          >
            Clear filters
          </Button>
        ) : null}

        <Badge variant="outline" className={cn("ml-auto", isFiltered && "border-ink")}>
          {rows.length} shown
        </Badge>
      </div>

      <DataTable
        className="mt-4"
        caption="Every class on the weekly schedule"
        columns={columns}
        rows={rows}
        getRowKey={(session) => session.id}
        isPending={classesQuery.isPending}
        empty={
          <EmptyState
            title={isFiltered ? "No classes match" : "The schedule is empty"}
            description={
              isFiltered
                ? "Nothing runs on that day with that class type. Clear the filters to see the full week."
                : "Add the first session and it goes live on the public timetable."
            }
            action={
              isFiltered ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setDayFilter(ALL)
                    setTypeFilter(ALL)
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => {
                    setEditing(null)
                    setFormOpen(true)
                  }}
                >
                  <CalendarPlus /> Add class
                </Button>
              )
            }
          />
        }
      />

      <ClassFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
      />

      <ClassBookingsSheet
        session={liveBookingsFor}
        open={Boolean(bookingsFor)}
        onOpenChange={(open) => {
          if (!open) setBookingsFor(null)
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        title="Delete this class?"
        description={
          pendingDelete ? (
            <>
              {pendingDelete.type.name} on {dayLabel(pendingDelete.dayOfWeek)} at{" "}
              {formatClock(pendingDelete.startTime)} comes off the timetable, and{" "}
              {pendingDelete.bookedCount} booked{" "}
              {pendingDelete.bookedCount === 1 ? "person loses their" : "people lose their"}{" "}
              spot. This can&apos;t be undone.
            </>
          ) : null
        }
        confirmLabel="Delete class"
        isPending={deleteClass.isPending}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteClass.mutate(pendingDelete.id, {
            onSuccess: () => {
              toast.success("Class deleted", {
                description: "It's off the timetable and its bookings are cleared.",
              })
              setPendingDelete(null)
            },
            onError: (error) =>
              toast.error("That class wasn't deleted", {
                description: error.message,
              }),
          })
        }}
      />
    </div>
  )
}
