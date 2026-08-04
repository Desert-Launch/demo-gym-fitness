import { z } from "zod"

import type { MemberStatus } from "@/types"

export const MEMBER_STATUSES = [
  "active",
  "frozen",
  "expired",
  "cancelled",
] as const satisfies readonly MemberStatus[]

export const memberStatusSchema = z.enum(MEMBER_STATUSES)

/** Permissive on format, strict on presence — this is a front desk, not a bank. */
const phoneSchema = z
  .string()
  .trim()
  .min(7, "Add a phone number we can reach them on.")
  .regex(/^[+0-9 ()-]{7,20}$/, "Use digits, spaces, + and - only.")

export const memberFormSchema = z.object({
  firstName: z.string().trim().min(2, "First name is too short."),
  lastName: z.string().trim().min(2, "Last name is too short."),
  email: z.email("That email doesn't look right."),
  phone: phoneSchema,
  planId: z.string().min(1, "Pick a membership plan."),
  status: memberStatusSchema,
  notes: z.string().trim().max(400, "Keep notes under 400 characters.").optional(),
})

export type MemberFormValues = z.infer<typeof memberFormSchema>

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  active: "Active",
  frozen: "Frozen",
  expired: "Expired",
  cancelled: "Cancelled",
}
