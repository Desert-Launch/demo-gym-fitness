/**
 * The comparison matrix is marketing copy, not store data — it explains the
 * plans rather than defining them. Keyed by plan slug.
 */
export const COMPARISON_ROWS: {
  label: string
  values: Record<string, string>
}[] = [
  {
    label: "Coached classes",
    values: {
      "day-pass": "1 session",
      monthly: "12 a month",
      quarterly: "Unlimited",
      annual: "Unlimited",
    },
  },
  {
    label: "Open floor access",
    values: {
      "day-pass": "Session day only",
      monthly: "Any opening hour",
      quarterly: "Any opening hour",
      annual: "Any opening hour",
    },
  },
  {
    label: "Book ahead",
    values: {
      "day-pass": "7 days",
      monthly: "7 days",
      quarterly: "14 days",
      annual: "14 days",
    },
  },
  {
    label: "InBody scan",
    values: {
      "day-pass": "—",
      monthly: "Monthly",
      quarterly: "Monthly + review",
      annual: "Monthly + review",
    },
  },
  {
    label: "Freeze allowance",
    values: {
      "day-pass": "—",
      monthly: "14 days",
      quarterly: "30 days",
      annual: "60 days",
    },
  },
  {
    label: "Guest passes",
    values: {
      "day-pass": "—",
      monthly: "—",
      quarterly: "1 a month",
      annual: "2 a month",
    },
  },
  {
    label: "Coach one-to-one",
    values: {
      "day-pass": "—",
      monthly: "—",
      quarterly: "On request",
      annual: "Every quarter",
    },
  },
  {
    label: "Commitment",
    values: {
      "day-pass": "None",
      monthly: "Rolling month",
      quarterly: "3 months",
      annual: "12 months",
    },
  },
]
