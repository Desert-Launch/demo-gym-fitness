import { z } from "zod"

/**
 * Who is taking the spot. A member picks themselves from the club list; anyone
 * else books as a guest and leaves contact details.
 */
export const bookingIdentitySchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("member"),
    memberId: z.string().min(1, "Choose which member is booking."),
  }),
  z.object({
    kind: z.literal("guest"),
    guestName: z.string().trim().min(2, "Add the name for the spot."),
    guestEmail: z.email("That email doesn't look right."),
    guestPhone: z
      .string()
      .trim()
      .min(7, "Add a phone number.")
      .regex(/^[+0-9 ()-]{7,20}$/, "Use digits, spaces, + and - only."),
  }),
])

export type BookingIdentity = z.infer<typeof bookingIdentitySchema>

/** Front-desk booking: staff always book on behalf of an existing member. */
export const adminBookingSchema = z.object({
  memberId: z.string().min(1, "Choose which member is booking."),
})

export type AdminBookingValues = z.infer<typeof adminBookingSchema>
