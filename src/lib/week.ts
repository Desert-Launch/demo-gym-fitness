import { addDays, format, startOfWeek } from "date-fns"

import type { DayOfWeek } from "@/types"

/** The Gulf week runs Sunday to Saturday. */
export const WEEK_START_ON = 0 as const

export const DAYS: { value: DayOfWeek; short: string; long: string }[] = [
  { value: 0, short: "Sun", long: "Sunday" },
  { value: 1, short: "Mon", long: "Monday" },
  { value: 2, short: "Tue", long: "Tuesday" },
  { value: 3, short: "Wed", long: "Wednesday" },
  { value: 4, short: "Thu", long: "Thursday" },
  { value: 5, short: "Fri", long: "Friday" },
  { value: 6, short: "Sat", long: "Saturday" },
]

export function dayLabel(day: DayOfWeek, variant: "short" | "long" = "long") {
  return DAYS[day][variant]
}

/** Today's index in the same 0–6 space the schedule uses. */
export function todayIndex(now: Date = new Date()): DayOfWeek {
  return now.getDay() as DayOfWeek
}

/** The calendar date a recurring session lands on this week. */
export function dateForDay(day: DayOfWeek, now: Date = new Date()): Date {
  return addDays(startOfWeek(now, { weekStartsOn: WEEK_START_ON }), day)
}

export function formatDayDate(day: DayOfWeek, now: Date = new Date()): string {
  return format(dateForDay(day, now), "d MMM")
}

/** Sort helper for "HH:mm" strings. */
export function byStartTime<T extends { startTime: string }>(a: T, b: T) {
  return a.startTime.localeCompare(b.startTime)
}
