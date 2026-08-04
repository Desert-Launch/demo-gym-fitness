import { z } from "zod"

/** Step 1 of the join flow — which plan they're signing up to. */
export const planChoiceSchema = z.object({
  planId: z.string().min(1, "Pick a plan to carry on."),
})

/** Step 2 — who they are. Same shape the front desk fills in for a walk-in. */
export const joinDetailsSchema = z.object({
  firstName: z.string().trim().min(2, "First name is too short."),
  lastName: z.string().trim().min(2, "Last name is too short."),
  email: z.email("That email doesn't look right."),
  phone: z
    .string()
    .trim()
    .min(7, "Add a phone number we can reach you on.")
    .regex(/^[+0-9 ()-]{7,20}$/, "Use digits, spaces, + and - only."),
  goal: z.enum(["strength", "conditioning", "weight", "competition", "unsure"]),
  startPreference: z.enum(["mornings", "lunch", "evenings", "weekends"]),
  // Modelled as a boolean that must be true, so the checkbox's unchecked state
  // is still a valid form value — it just fails validation with a real message.
  agreesToTerms: z.boolean().refine((value) => value, {
    error: "Tick the box to accept the club rules.",
  }),
})

export type JoinDetailsValues = z.infer<typeof joinDetailsSchema>
export type PlanChoiceValues = z.infer<typeof planChoiceSchema>

export const GOAL_LABELS: Record<JoinDetailsValues["goal"], string> = {
  strength: "Get stronger",
  conditioning: "Build conditioning",
  weight: "Change body composition",
  competition: "Train for an event",
  unsure: "Not sure yet",
}

export const START_PREFERENCE_LABELS: Record<
  JoinDetailsValues["startPreference"],
  string
> = {
  mornings: "Early mornings",
  lunch: "Lunchtime",
  evenings: "Evenings",
  weekends: "Weekends",
}
