/**
 * The public surface of the in-memory store. Feature `api.ts` files call these;
 * nothing else may. Everything here is synchronous and framework-agnostic —
 * latency and React live one layer up.
 */
import { addDays, addMonths, addQuarters, addYears, formatISO } from "date-fns"

import type {
  ClassBooking,
  GymClass,
  GymClassDetail,
  Member,
  MemberDetail,
  MemberStatus,
  Plan,
  Trainer,
} from "@/types"

import * as db from "./db"

export { sleep } from "./latency"

// --- Read-only reference data ----------------------------------------------

export const listPlans = (): Plan[] => db.readPlans()
export const getPlan = (planId: string): Plan | undefined => db.findPlan(planId)
export const getPlanBySlug = (slug: string): Plan | undefined =>
  db.findPlanBySlug(slug)

export const listTrainers = (): Trainer[] => db.readTrainers()
export const getTrainer = (trainerId: string) => db.findTrainer(trainerId)
export const getTrainerBySlug = (slug: string) => db.findTrainerBySlug(slug)

export const listClassTypes = () => db.readClassTypes()

// --- Classes ----------------------------------------------------------------

export type CreateClassInput = Omit<GymClass, "id">
export type UpdateClassInput = Partial<CreateClassInput>

export function listClasses(): GymClassDetail[] {
  return db.readClasses().map(db.decorateClass)
}

export function getClass(classId: string): GymClassDetail | undefined {
  const row = db.readClasses().find((c) => c.id === classId)
  return row ? db.decorateClass(row) : undefined
}

export function createClass(input: CreateClassInput): GymClassDetail {
  assertStudioFree(input)
  const row = db.insertClass({ ...input, id: crypto.randomUUID() })
  return db.decorateClass(row)
}

export function updateClass(
  classId: string,
  patch: UpdateClassInput
): GymClassDetail {
  const current = db.readClasses().find((c) => c.id === classId)
  if (!current) throw new Error("That class is no longer on the schedule.")

  const next = { ...current, ...patch }
  assertStudioFree(next, classId)

  const { booked } = db.countBookings(classId)
  if (next.capacity < booked) {
    throw new Error(
      `Capacity can't drop below ${booked} — that many people are already booked in.`
    )
  }

  const row = db.patchClass(classId, patch)
  if (!row) throw new Error("That class is no longer on the schedule.")
  return db.decorateClass(row)
}

export function deleteClass(classId: string): void {
  const removed = db.removeClass(classId)
  if (!removed) throw new Error("That class is no longer on the schedule.")
}

/** Two sessions can't share a studio at the same time on the same day. */
function assertStudioFree(
  candidate: Pick<GymClass, "dayOfWeek" | "startTime" | "studio">,
  ignoreId?: string
): void {
  const clash = db
    .readClasses()
    .find(
      (c) =>
        c.id !== ignoreId &&
        c.dayOfWeek === candidate.dayOfWeek &&
        c.startTime === candidate.startTime &&
        c.studio === candidate.studio
    )
  if (clash) {
    throw new Error(
      `${candidate.studio} is already booked at ${candidate.startTime} that day. Pick another time or studio.`
    )
  }
}

// --- Members ----------------------------------------------------------------

export interface CreateMemberInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  planId: string
  status?: MemberStatus
  notes?: string
}

export type UpdateMemberInput = Partial<
  Omit<Member, "id" | "membershipNo" | "joinedAt">
>

export function listMembers(): MemberDetail[] {
  return db.readMembers().map(db.decorateMember)
}

export function getMember(memberId: string): MemberDetail | undefined {
  const row = db.readMembers().find((m) => m.id === memberId)
  return row ? db.decorateMember(row) : undefined
}

export function createMember(input: CreateMemberInput): MemberDetail {
  const plan = db.findPlan(input.planId)
  if (!plan) throw new Error("Pick a membership plan before saving.")

  const existing = db
    .readMembers()
    .find((m) => m.email.toLowerCase() === input.email.toLowerCase())
  if (existing) {
    throw new Error(
      `${input.email} is already on ${existing.membershipNo}. Use a different email.`
    )
  }

  const today = new Date()
  const row = db.insertMember({
    id: crypto.randomUUID(),
    membershipNo: db.nextMembershipNo(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    planId: input.planId,
    status: input.status ?? "active",
    joinedAt: formatISO(today, { representation: "date" }),
    renewsAt: formatISO(renewalDate(today, plan), { representation: "date" }),
    notes: input.notes?.trim() ?? "",
  })

  return db.decorateMember(row)
}

export function updateMember(
  memberId: string,
  patch: UpdateMemberInput
): MemberDetail {
  const current = db.readMembers().find((m) => m.id === memberId)
  if (!current) throw new Error("That member is no longer in the club.")

  // Moving to a different plan resets the renewal date from today.
  const planChanged = patch.planId && patch.planId !== current.planId
  let renewsAt = patch.renewsAt
  if (planChanged) {
    const plan = db.findPlan(patch.planId as string)
    if (!plan) throw new Error("That plan no longer exists.")
    renewsAt = formatISO(renewalDate(new Date(), plan), {
      representation: "date",
    })
  }

  const row = db.patchMember(memberId, { ...patch, ...(renewsAt ? { renewsAt } : {}) })
  if (!row) throw new Error("That member is no longer in the club.")
  return db.decorateMember(row)
}

export function deleteMember(memberId: string): void {
  const removed = db.removeMember(memberId)
  if (!removed) throw new Error("That member is no longer in the club.")
}

function renewalDate(from: Date, plan: Plan): Date {
  switch (plan.billingPeriod) {
    case "day":
      return addDays(from, 1)
    case "month":
      return addMonths(from, 1)
    case "quarter":
      return addQuarters(from, 1)
    case "year":
      return addYears(from, 1)
  }
}

// --- Bookings ---------------------------------------------------------------

export interface CreateBookingInput {
  classId: string
  memberId?: string | null
  guestName?: string | null
  source?: ClassBooking["source"]
}

export function listBookings(): ClassBooking[] {
  return db.readBookings()
}

export function listBookingsForClass(classId: string): ClassBooking[] {
  return db.readBookings().filter((b) => b.classId === classId)
}

export function listBookingsForMember(memberId: string): ClassBooking[] {
  return db.readBookings().filter((b) => b.memberId === memberId)
}

/**
 * Books a spot, or joins the waitlist when the session is full. The caller
 * never decides which — capacity is derived here, in one place.
 */
export function createBooking(input: CreateBookingInput): ClassBooking {
  const gymClass = getClass(input.classId)
  if (!gymClass) throw new Error("That class is no longer on the schedule.")

  if (input.memberId) {
    const clash = db
      .readBookings()
      .find(
        (b) =>
          b.classId === input.classId &&
          b.memberId === input.memberId &&
          b.status !== "cancelled"
      )
    if (clash) {
      throw new Error("That member already has a spot in this class.")
    }
  }

  return db.insertBooking({
    id: crypto.randomUUID(),
    classId: input.classId,
    memberId: input.memberId ?? null,
    guestName: input.guestName?.trim() || null,
    status: gymClass.isFull ? "waitlisted" : "booked",
    createdAt: new Date().toISOString(),
    source: input.source ?? "web",
  })
}

/**
 * Cancels a spot and pulls the longest-waiting person off the waitlist, the
 * way the front desk would.
 */
export function cancelBooking(bookingId: string): {
  cancelled: ClassBooking
  promoted: ClassBooking | null
} {
  const booking = db.readBookings().find((b) => b.id === bookingId)
  if (!booking) throw new Error("That booking has already been cancelled.")
  if (booking.status === "cancelled") {
    throw new Error("That booking has already been cancelled.")
  }

  const cancelled = db.patchBooking(bookingId, { status: "cancelled" })
  if (!cancelled) throw new Error("That booking has already been cancelled.")

  let promoted: ClassBooking | null = null
  if (booking.status === "booked") {
    const nextUp = db
      .readBookings()
      .filter((b) => b.classId === booking.classId && b.status === "waitlisted")
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0]
    if (nextUp) {
      promoted = db.patchBooking(nextUp.id, { status: "booked" }) ?? null
    }
  }

  return { cancelled, promoted }
}

// --- Housekeeping -----------------------------------------------------------

/** Throws the club away and re-seeds it. Wired to the admin footer. */
export function resetStore(): void {
  db.resetTables()
}
