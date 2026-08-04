/**
 * Static club facts used across the marketing site. This is copy, not data —
 * anything that can be created, edited or deleted lives in lib/store instead.
 */

export const VENUE = {
  name: "Forge Athletic Club",
  street: "Warehouse 14, Alserkal Avenue",
  area: "Al Quoz 1, Dubai",
  phone: "+971 4 123 4567",
  email: "train@forgeathletic.ae",
  year: 2026,
} as const

export const OPENING_HOURS = [
  { days: "Mon – Thu", hours: "05:30 – 22:30" },
  { days: "Friday", hours: "05:30 – 12:00" },
  { days: "Saturday", hours: "07:00 – 20:00" },
  { days: "Sunday", hours: "07:00 – 21:00" },
] as const

/** Headline numbers on the home page. Dummy, but plausible for a club this size. */
export const TRUST_SIGNALS = [
  { value: "1,240", label: "Members training" },
  { value: "60", label: "Classes a week" },
  { value: "18", label: "Coaches on the floor" },
  { value: "12", label: "Spots per class, capped" },
] as const
