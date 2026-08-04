"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Pause, Pencil, Play, Save, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useBookingsForMember } from "@/features/bookings"
import { cn, formatAed, formatClock } from "@/lib/utils"
import { dayLabel } from "@/lib/week"
import type { MemberDetail } from "@/types"

import { useUpdateMember } from "../hooks/use-members"
import { MemberStatusBadge } from "./member-status-badge"

export function MemberDetailSheet({
  member,
  open,
  onOpenChange,
  onEdit,
}: {
  member: MemberDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (member: MemberDetail) => void
}) {
  const bookingsQuery = useBookingsForMember(member?.id ?? null)
  const updateMember = useUpdateMember()
  const [notes, setNotes] = useState("")

  useEffect(() => {
    setNotes(member?.notes ?? "")
  }, [member])

  if (!member) return null

  const bookings = bookingsQuery.data ?? []
  const live = bookings.filter((booking) => booking.status !== "cancelled")
  const notesChanged = notes.trim() !== member.notes.trim()

  const setStatus = (status: MemberDetail["status"], message: string) => {
    updateMember.mutate(
      { memberId: member.id, patch: { status } },
      {
        onSuccess: () => toast.success(message),
        onError: (error) =>
          toast.error("That change didn't save", { description: error.message }),
      }
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader className="border-b border-steel-200">
          <SheetTitle className="display text-display-sm">
            {member.fullName}
          </SheetTitle>
          <SheetDescription>
            <span className="font-mono">{member.membershipNo}</span> ·{" "}
            {member.plan.name} · {formatAed(member.plan.priceAed)}
          </SheetDescription>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <MemberStatusBadge status={member.status} />
            <span className="font-mono text-[0.6875rem] text-steel-500">
              Renews {member.renewsAt}
            </span>
          </div>
        </SheetHeader>

        <div className="border-b border-steel-200 p-4">
          <p className="eyebrow text-steel-500">Contact</p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-steel-500">Email</dt>
              <dd className="truncate text-steel-700">{member.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-steel-500">Phone</dt>
              <dd className="font-mono text-steel-700">{member.phone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-steel-500">Joined</dt>
              <dd className="font-mono text-steel-700">{member.joinedAt}</dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-steel-200 p-4">
          <Button size="sm" variant="outline" onClick={() => onEdit(member)}>
            <Pencil /> Edit
          </Button>
          {member.status === "frozen" ? (
            <Button
              size="sm"
              variant="outline"
              disabled={updateMember.isPending}
              onClick={() => setStatus("active", "Membership unfrozen")}
            >
              <Play /> Unfreeze
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              disabled={updateMember.isPending || member.status === "cancelled"}
              onClick={() => setStatus("frozen", "Membership frozen")}
            >
              <Pause /> Freeze
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            disabled={updateMember.isPending || member.status === "cancelled"}
            onClick={() => setStatus("cancelled", "Membership cancelled")}
          >
            <XCircle /> Cancel membership
          </Button>
        </div>

        <div className="border-b border-steel-200 p-4">
          <label htmlFor="member-notes" className="eyebrow text-steel-500">
            Coach notes
          </label>
          <Textarea
            id="member-notes"
            rows={3}
            className="mt-3"
            value={notes}
            placeholder="Injuries to work around, goals, anything the coaches should know."
            onChange={(event) => setNotes(event.target.value)}
          />
          <Button
            size="sm"
            className="mt-3"
            disabled={!notesChanged || updateMember.isPending}
            onClick={() =>
              updateMember.mutate(
                { memberId: member.id, patch: { notes: notes.trim() } },
                {
                  onSuccess: () => toast.success("Notes saved"),
                  onError: (error) =>
                    toast.error("Those notes didn't save", {
                      description: error.message,
                    }),
                }
              )
            }
          >
            <Save /> {updateMember.isPending ? "Saving…" : "Save notes"}
          </Button>
        </div>

        <div className="p-4">
          <p className="eyebrow text-steel-500">
            Classes booked · {live.length}
          </p>

          {bookingsQuery.isPending ? (
            <ul className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <li key={index}>
                  <Skeleton className="h-8 w-full" />
                </li>
              ))}
            </ul>
          ) : bookings.length === 0 ? (
            <p className="mt-4 text-sm text-steel-600">
              No classes booked yet. Book them into a session from the classes
              screen.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-steel-200 border-y border-steel-200">
              {bookings.map((booking) => (
                <li
                  key={booking.id}
                  className={cn(
                    "flex items-center gap-3 py-3",
                    booking.status === "cancelled" && "opacity-50"
                  )}
                >
                  <span className="tnum w-24 shrink-0 font-mono text-xs text-steel-500">
                    {dayLabel(booking.gymClass.dayOfWeek, "short")}{" "}
                    {formatClock(booking.gymClass.startTime)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-ink">
                      {booking.gymClass.type.name}
                    </span>
                    <span className="text-xs text-steel-500">
                      {booking.gymClass.trainer.name}
                    </span>
                  </span>
                  {booking.status !== "booked" ? (
                    <span className="shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-steel-500">
                      {booking.status}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
