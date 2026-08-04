import * as store from "@/lib/store"
import { sleep } from "@/lib/store"
import type { ClassBooking, GymClassDetail } from "@/types"

export interface BookingWithMember extends ClassBooking {
  memberName: string
  membershipNo: string | null
}

export interface BookingWithClass extends ClassBooking {
  gymClass: GymClassDetail
}

export async function fetchBookingsForClass(
  classId: string
): Promise<BookingWithMember[]> {
  await sleep(140)
  const members = new Map(store.listMembers().map((m) => [m.id, m]))

  return store
    .listBookingsForClass(classId)
    .map((booking) => {
      const member = booking.memberId ? members.get(booking.memberId) : undefined
      return {
        ...booking,
        memberName: member?.fullName ?? booking.guestName ?? "Guest",
        membershipNo: member?.membershipNo ?? null,
      }
    })
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export async function fetchBookingsForMember(
  memberId: string
): Promise<BookingWithClass[]> {
  await sleep(140)
  const classes = new Map(store.listClasses().map((c) => [c.id, c]))

  return store
    .listBookingsForMember(memberId)
    .flatMap((booking) => {
      const gymClass = classes.get(booking.classId)
      return gymClass ? [{ ...booking, gymClass }] : []
    })
    .sort(
      (a, b) =>
        a.gymClass.dayOfWeek - b.gymClass.dayOfWeek ||
        a.gymClass.startTime.localeCompare(b.gymClass.startTime)
    )
}

export async function createBooking(
  input: store.CreateBookingInput
): Promise<ClassBooking> {
  await sleep(260)
  return store.createBooking(input)
}

/**
 * Cancelling is the one call that fails on purpose. Roughly one in ten
 * cancellations comes back as a service error so the optimistic update has a
 * rollback path you can actually demo — the row snaps back and the toast says
 * what to do next.
 */
export async function cancelBooking(bookingId: string): Promise<{
  cancelled: ClassBooking
  promoted: ClassBooking | null
}> {
  await sleep(280)
  if (Math.random() < 0.1) {
    throw new Error(
      "The booking service didn't respond, so the spot is still booked. Try cancelling again."
    )
  }
  return store.cancelBooking(bookingId)
}
