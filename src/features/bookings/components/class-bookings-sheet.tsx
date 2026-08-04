"use client"

import { useState } from "react"
import { toast } from "sonner"
import { UserPlus, X } from "lucide-react"

import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { CapacityMeter } from "@/features/classes/components/capacity-meter"
import { useMembers } from "@/features/members"
import { cn, formatClock } from "@/lib/utils"
import { dayLabel } from "@/lib/week"
import type { BookingStatus, GymClassDetail } from "@/types"

import {
  useBookingsForClass,
  useCancelBooking,
  useCreateBooking,
} from "../hooks/use-bookings"

const STATUS_LABEL: Record<BookingStatus, string> = {
  booked: "Booked",
  waitlisted: "Waitlist",
  cancelled: "Cancelled",
}

export function ClassBookingsSheet({
  session,
  open,
  onOpenChange,
}: {
  session: GymClassDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const bookingsQuery = useBookingsForClass(session?.id ?? null)
  const membersQuery = useMembers()
  const createBooking = useCreateBooking()
  const cancelBooking = useCancelBooking(session?.id ?? "")

  const [memberId, setMemberId] = useState("")

  const bookings = bookingsQuery.data ?? []
  const live = bookings.filter((booking) => booking.status !== "cancelled")
  const cancelled = bookings.filter((booking) => booking.status === "cancelled")

  const bookable = (membersQuery.data ?? [])
    .filter((member) => member.status === "active" || member.status === "frozen")
    .sort((a, b) => a.fullName.localeCompare(b.fullName))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-md">
        {session ? (
          <>
            <SheetHeader className="border-b border-steel-200">
              <SheetTitle className="display text-display-sm">
                {session.type.name}
              </SheetTitle>
              <SheetDescription>
                {dayLabel(session.dayOfWeek)} at {formatClock(session.startTime)} ·{" "}
                {session.trainer.name} · {session.studio}
              </SheetDescription>
              <div className="mt-3">
                <div className="flex items-baseline justify-between">
                  <span className="eyebrow text-steel-500">Capacity</span>
                  <span className="tnum font-mono text-xs text-steel-600">
                    {session.bookedCount}/{session.capacity}
                  </span>
                </div>
                <CapacityMeter
                  className="mt-2"
                  bookedCount={session.bookedCount}
                  capacity={session.capacity}
                  spotsLeft={session.spotsLeft}
                />
              </div>
            </SheetHeader>

            <div className="border-b border-steel-200 p-4">
              <p className="eyebrow text-steel-500">Book someone in</p>
              <div className="mt-3 flex gap-2">
                <Select
                  value={memberId}
                  onValueChange={setMemberId}
                  disabled={membersQuery.isPending}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Pick a member" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {bookable.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.fullName} · {member.membershipNo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  disabled={!memberId || createBooking.isPending}
                  onClick={() => {
                    createBooking.mutate(
                      { classId: session.id, memberId, source: "admin" },
                      {
                        onSuccess: (booking) => {
                          setMemberId("")
                          toast.success(
                            booking.status === "waitlisted"
                              ? "Added to the waitlist"
                              : "Spot booked"
                          )
                        },
                        onError: (error) =>
                          toast.error("That booking didn't go through", {
                            description: error.message,
                          }),
                      }
                    )
                  }}
                >
                  <UserPlus />
                  Book
                </Button>
              </div>
            </div>

            <div className="p-4">
              <p className="eyebrow text-steel-500">
                On the list · {live.length}
              </p>

              {bookingsQuery.isPending ? (
                <ul className="mt-4 space-y-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-5 w-16" />
                    </li>
                  ))}
                </ul>
              ) : live.length === 0 ? (
                <EmptyState
                  className="mt-4"
                  title="Nobody booked yet"
                  description="Book a member in from the picker above, or wait for the class to fill from the public timetable."
                />
              ) : (
                <ul className="mt-4 divide-y divide-steel-200 border-y border-steel-200">
                  {live.map((booking) => (
                    <li
                      key={booking.id}
                      className="flex items-center gap-3 py-3"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">
                          {booking.memberName}
                        </span>
                        <span className="font-mono text-[0.6875rem] text-steel-500">
                          {booking.membershipNo ?? "Guest"} · booked via{" "}
                          {booking.source}
                        </span>
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "shrink-0",
                          booking.status === "waitlisted" &&
                            "border-status-frozen text-status-frozen"
                        )}
                      >
                        {STATUS_LABEL[booking.status]}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Cancel ${booking.memberName}'s spot`}
                        disabled={cancelBooking.isPending}
                        onClick={() =>
                          cancelBooking.mutate(booking.id, {
                            onSuccess: (result) =>
                              toast.success("Spot cancelled", {
                                description: result.promoted
                                  ? "The next person on the waitlist moved up."
                                  : "The spot is back on the timetable.",
                              }),
                            onError: (error) =>
                              toast.error("That cancellation didn't stick", {
                                description: error.message,
                              }),
                          })
                        }
                      >
                        <X />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}

              {cancelled.length > 0 ? (
                <div className="mt-8">
                  <p className="eyebrow text-steel-500">
                    Cancelled · {cancelled.length}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {cancelled.map((booking) => (
                      <li
                        key={booking.id}
                        className="flex items-center justify-between gap-3 text-sm text-steel-400 line-through"
                      >
                        <span className="truncate">{booking.memberName}</span>
                        <span className="font-mono text-[0.6875rem] no-underline">
                          {booking.membershipNo ?? "Guest"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <p className="mt-8 border-t border-steel-200 pt-4 text-xs text-steel-500">
                Cancelling updates the list before the service replies. Roughly
                one call in ten fails on purpose so you can see the row snap
                back.
              </p>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
