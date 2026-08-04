import {
  format,
  isAfter,
  parseISO,
  startOfWeek,
  subDays,
  subWeeks,
} from "date-fns"

import * as store from "@/lib/store"
import { sleep } from "@/lib/store"
import { todayIndex, WEEK_START_ON } from "@/lib/week"
import type { GymClassDetail, MemberStatus, Plan } from "@/types"

export interface DashboardOverview {
  activeMembers: number
  memberDelta: number
  checkInsToday: number
  classesToday: number
  monthlyRevenueAed: number
  averageFillRate: number
  waitlisted: number
  statusMix: { status: MemberStatus; count: number }[]
  joinsByWeek: { week: string; joins: number }[]
  todaysClasses: GymClassDetail[]
}

/** What one member is worth per month, whatever cadence they pay on. */
function monthlyValue(plan: Plan): number {
  switch (plan.billingPeriod) {
    case "day":
      return plan.priceAed * 4
    case "month":
      return plan.priceAed
    case "quarter":
      return Math.round(plan.priceAed / 3)
    case "year":
      return Math.round(plan.priceAed / 12)
  }
}

/** Throws the club away and re-seeds it. Wired to the admin sidebar footer. */
export async function resetDemoData(): Promise<void> {
  await sleep(180)
  store.resetStore()
}

export async function fetchOverview(): Promise<DashboardOverview> {
  await sleep(220)

  const members = store.listMembers()
  const classes = store.listClasses()
  const bookings = store.listBookings()
  const today = todayIndex()

  const active = members.filter((m) => m.status === "active")
  const todaysClasses = classes
    .filter((gymClass) => gymClass.dayOfWeek === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const checkInsToday = todaysClasses.reduce(
    (total, gymClass) => total + gymClass.bookedCount,
    0
  )

  const monthlyRevenueAed = active.reduce(
    (total, member) => total + monthlyValue(member.plan),
    0
  )

  const capacity = classes.reduce((total, c) => total + c.capacity, 0)
  const booked = classes.reduce((total, c) => total + c.bookedCount, 0)

  const statuses: MemberStatus[] = ["active", "frozen", "expired", "cancelled"]
  const statusMix = statuses.map((status) => ({
    status,
    count: members.filter((m) => m.status === status).length,
  }))

  // Eight weeks of sign-ups, oldest first.
  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: WEEK_START_ON })
  const joinsByWeek = Array.from({ length: 8 }, (_, index) => {
    const weekStart = subWeeks(thisWeekStart, 7 - index)
    const weekEnd = subWeeks(thisWeekStart, 6 - index)
    const joins = members.filter((member) => {
      const joined = parseISO(member.joinedAt)
      return isAfter(joined, weekStart) && !isAfter(joined, weekEnd)
    }).length
    return { week: format(weekStart, "d MMM"), joins }
  })

  // Rolling seven days, not the calendar week — on a Monday the calendar
  // figure would always read zero.
  const sevenDaysAgo = subDays(new Date(), 7)
  const lastWeekJoins = members.filter((member) =>
    isAfter(parseISO(member.joinedAt), sevenDaysAgo)
  ).length

  return {
    activeMembers: active.length,
    memberDelta: lastWeekJoins,
    checkInsToday,
    classesToday: todaysClasses.length,
    monthlyRevenueAed,
    averageFillRate: capacity === 0 ? 0 : Math.round((booked / capacity) * 100),
    waitlisted: bookings.filter((b) => b.status === "waitlisted").length,
    statusMix,
    joinsByWeek,
    todaysClasses,
  }
}
