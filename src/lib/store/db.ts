import type {
  ClassBooking,
  ClassType,
  ClassTypeId,
  GymClass,
  GymClassDetail,
  Member,
  MemberDetail,
  Plan,
  Trainer,
} from "@/types"

import {
  CLASS_TYPES,
  seedBookings,
  seedClasses,
  seedMembers,
  seedPlans,
  seedTrainers,
} from "./seed"

/**
 * The demo's whole backend: one module-level object holding plain arrays.
 * No React, no persistence, no network. It lives for as long as the tab does
 * and re-seeds on a hard refresh.
 *
 * Nothing outside lib/store may import this file — features reach it through
 * the barrel in ./index, and UI reaches the barrel through a feature api.ts.
 */
interface Tables {
  plans: Plan[]
  trainers: Trainer[]
  classTypes: ClassType[]
  classes: GymClass[]
  members: Member[]
  bookings: ClassBooking[]
}

function createTables(): Tables {
  const plans = seedPlans()
  const trainers = seedTrainers()
  const classes = seedClasses(trainers)
  const members = seedMembers(plans)
  const bookings = seedBookings(classes, members)

  return { plans, trainers, classTypes: CLASS_TYPES, classes, members, bookings }
}

let tables: Tables = createTables()

/** Wipes every table and re-seeds. Wired to the reset control in the admin footer. */
export function resetTables(): void {
  tables = createTables()
}

// --- Read helpers -----------------------------------------------------------

const clone = <T,>(rows: T[]): T[] => rows.map((row) => ({ ...row }))

export const readPlans = (): Plan[] => clone(tables.plans)
export const readTrainers = (): Trainer[] => clone(tables.trainers)
export const readClassTypes = (): ClassType[] => clone(tables.classTypes)
export const readClasses = (): GymClass[] => clone(tables.classes)
export const readMembers = (): Member[] => clone(tables.members)
export const readBookings = (): ClassBooking[] => clone(tables.bookings)

export function findPlan(planId: string): Plan | undefined {
  const row = tables.plans.find((p) => p.id === planId)
  return row ? { ...row } : undefined
}

export function findPlanBySlug(slug: string): Plan | undefined {
  const row = tables.plans.find((p) => p.slug === slug)
  return row ? { ...row } : undefined
}

export function findTrainer(trainerId: string): Trainer | undefined {
  const row = tables.trainers.find((t) => t.id === trainerId)
  return row ? { ...row } : undefined
}

export function findTrainerBySlug(slug: string): Trainer | undefined {
  const row = tables.trainers.find((t) => t.slug === slug)
  return row ? { ...row } : undefined
}

export function findClassType(typeId: ClassTypeId): ClassType | undefined {
  const row = tables.classTypes.find((t) => t.id === typeId)
  return row ? { ...row } : undefined
}

// --- Derivation -------------------------------------------------------------

/**
 * Occupancy is always counted from bookings — never stored on the class. One
 * source of truth means capacity can never drift out of sync.
 */
export function countBookings(classId: string): {
  booked: number
  waitlisted: number
} {
  let booked = 0
  let waitlisted = 0
  for (const booking of tables.bookings) {
    if (booking.classId !== classId) continue
    if (booking.status === "booked") booked++
    else if (booking.status === "waitlisted") waitlisted++
  }
  return { booked, waitlisted }
}

export function decorateClass(gymClass: GymClass): GymClassDetail {
  const type = findClassType(gymClass.typeId)
  const trainer = findTrainer(gymClass.trainerId)
  if (!type || !trainer) {
    throw new Error(`Class ${gymClass.id} points at a missing type or coach`)
  }

  const { booked, waitlisted } = countBookings(gymClass.id)
  const spotsLeft = Math.max(0, gymClass.capacity - booked)

  return {
    ...gymClass,
    type,
    trainer,
    bookedCount: booked,
    waitlistCount: waitlisted,
    spotsLeft,
    isFull: spotsLeft === 0,
  }
}

export function decorateMember(member: Member): MemberDetail {
  const plan = findPlan(member.planId)
  if (!plan) {
    throw new Error(`Member ${member.membershipNo} points at a missing plan`)
  }

  const upcomingBookings = tables.bookings.filter(
    (b) => b.memberId === member.id && b.status !== "cancelled"
  ).length

  return {
    ...member,
    fullName: `${member.firstName} ${member.lastName}`,
    plan,
    upcomingBookings,
  }
}

// --- Writes -----------------------------------------------------------------

export function insertClass(row: GymClass): GymClass {
  tables.classes.push(row)
  return { ...row }
}

export function patchClass(
  classId: string,
  patch: Partial<Omit<GymClass, "id">>
): GymClass | undefined {
  const index = tables.classes.findIndex((c) => c.id === classId)
  if (index === -1) return undefined
  tables.classes[index] = { ...tables.classes[index], ...patch }
  return { ...tables.classes[index] }
}

export function removeClass(classId: string): boolean {
  const before = tables.classes.length
  tables.classes = tables.classes.filter((c) => c.id !== classId)
  // Cascade: a deleted class takes its bookings with it.
  tables.bookings = tables.bookings.filter((b) => b.classId !== classId)
  return tables.classes.length < before
}

export function insertMember(row: Member): Member {
  tables.members.push(row)
  return { ...row }
}

export function patchMember(
  memberId: string,
  patch: Partial<Omit<Member, "id">>
): Member | undefined {
  const index = tables.members.findIndex((m) => m.id === memberId)
  if (index === -1) return undefined
  tables.members[index] = { ...tables.members[index], ...patch }
  return { ...tables.members[index] }
}

export function removeMember(memberId: string): boolean {
  const before = tables.members.length
  tables.members = tables.members.filter((m) => m.id !== memberId)
  tables.bookings = tables.bookings.filter((b) => b.memberId !== memberId)
  return tables.members.length < before
}

export function insertBooking(row: ClassBooking): ClassBooking {
  tables.bookings.push(row)
  return { ...row }
}

export function patchBooking(
  bookingId: string,
  patch: Partial<Omit<ClassBooking, "id">>
): ClassBooking | undefined {
  const index = tables.bookings.findIndex((b) => b.id === bookingId)
  if (index === -1) return undefined
  tables.bookings[index] = { ...tables.bookings[index], ...patch }
  return { ...tables.bookings[index] }
}

/** Highest membership number in the club, so new joins continue the sequence. */
export function nextMembershipNo(): string {
  const highest = tables.members.reduce((max, member) => {
    const value = Number(member.membershipNo.replace(/\D/g, ""))
    return Number.isFinite(value) && value > max ? value : max
  }, 1000)
  return `FRG-${String(highest + 1).padStart(4, "0")}`
}
