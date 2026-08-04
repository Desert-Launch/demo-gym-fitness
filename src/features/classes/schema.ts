import { z } from "zod"

import type { ClassLevel, ClassTypeId, DayOfWeek } from "@/types"

export const CLASS_TYPE_IDS = [
  "hiit",
  "strength",
  "yoga",
  "spin",
  "boxing",
  "mobility",
] as const satisfies readonly ClassTypeId[]

export const CLASS_LEVELS = [
  "all",
  "intermediate",
  "advanced",
] as const satisfies readonly ClassLevel[]

export const STUDIOS = [
  "The Floor",
  "Studio 1",
  "Studio 2",
  "The Ring",
  "Spin Room",
] as const

export const CLASS_LEVEL_LABELS: Record<ClassLevel, string> = {
  all: "All levels",
  intermediate: "Intermediate",
  advanced: "Advanced",
}

export const classFormSchema = z.object({
  typeId: z.enum(CLASS_TYPE_IDS),
  trainerId: z.string().min(1, "Every class needs a coach."),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use a 24-hour time, like 06:30."),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(20, "Classes run at least 20 minutes.")
    .max(120, "Keep classes under two hours."),
  capacity: z.coerce
    .number()
    .int()
    .min(1, "Capacity has to be at least 1.")
    .max(40, "The biggest room holds 40."),
  studio: z.enum(STUDIOS),
  level: z.enum(CLASS_LEVELS),
})

export type ClassFormValues = z.infer<typeof classFormSchema>

/** The form hands back a plain number; the store wants the narrowed day type. */
export function toDayOfWeek(value: number): DayOfWeek {
  return value as DayOfWeek
}
