/**
 * Cross-feature entity types. Feature-local shapes (form values, filters)
 * belong in that feature's schema.ts instead.
 */

export type ClassTypeId =
  | "hiit"
  | "strength"
  | "yoga"
  | "spin"
  | "boxing"
  | "mobility"

export type ClassLevel = "all" | "intermediate" | "advanced"

export type MemberStatus = "active" | "frozen" | "expired" | "cancelled"

export type BookingStatus = "booked" | "waitlisted" | "cancelled"

export type BillingPeriod = "day" | "month" | "quarter" | "year"

/** 0 = Sunday … 6 = Saturday. The Gulf week starts on Sunday. */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface ClassType {
  id: ClassTypeId
  name: string
  description: string
  /** 1 = restorative, 5 = flat out. Drives the intensity meter. */
  intensity: 1 | 2 | 3 | 4 | 5
  equipment: string
}

export interface Plan {
  id: string
  slug: string
  name: string
  tagline: string
  priceAed: number
  billingPeriod: BillingPeriod
  /** null means unlimited classes. */
  monthlyClassCredits: number | null
  features: string[]
  /** Highlighted on the pricing grid. Exactly one plan carries this. */
  featured: boolean
}

export interface Trainer {
  id: string
  slug: string
  name: string
  headline: string
  bio: string
  specialties: ClassTypeId[]
  certifications: string[]
  yearsExperience: number
}

export interface GymClass {
  id: string
  typeId: ClassTypeId
  trainerId: string
  dayOfWeek: DayOfWeek
  /** 24h "HH:mm" — the timetable sorts on this string. */
  startTime: string
  durationMinutes: number
  capacity: number
  studio: string
  level: ClassLevel
}

export interface ClassBooking {
  id: string
  classId: string
  /** null for a guest booking taken on the door. */
  memberId: string | null
  guestName: string | null
  status: BookingStatus
  createdAt: string
  source: "web" | "admin"
}

export interface Member {
  id: string
  membershipNo: string
  firstName: string
  lastName: string
  email: string
  phone: string
  planId: string
  status: MemberStatus
  joinedAt: string
  renewsAt: string
  notes: string
}

/** A class with everything the UI needs, resolved and counted in one pass. */
export interface GymClassDetail extends GymClass {
  type: ClassType
  trainer: Trainer
  bookedCount: number
  waitlistCount: number
  spotsLeft: number
  isFull: boolean
}

export interface MemberDetail extends Member {
  fullName: string
  plan: Plan
  upcomingBookings: number
}
