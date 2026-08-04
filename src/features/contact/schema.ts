import { z } from "zod"

export const CONTACT_TOPICS = [
  "membership",
  "classes",
  "corporate",
  "other",
] as const

export const CONTACT_TOPIC_LABELS: Record<
  (typeof CONTACT_TOPICS)[number],
  string
> = {
  membership: "Membership and pricing",
  classes: "Classes and timetable",
  corporate: "Corporate memberships",
  other: "Something else",
}

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Tell us who you are."),
  email: z.email("That email doesn't look right."),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9 ()-]{7,20}$/, "Use digits, spaces, + and - only.")
    .optional()
    .or(z.literal("")),
  topic: z.enum(CONTACT_TOPICS),
  message: z
    .string()
    .trim()
    .min(10, "A sentence or two is enough.")
    .max(1000, "Keep it under 1000 characters."),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>
