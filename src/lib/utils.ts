import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Prices are quoted in AED, the way a Dubai gym quotes them. */
export function formatAed(amount: number, opts?: { compact?: boolean }): string {
  if (opts?.compact && amount >= 1000) {
    return `AED ${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`
  }
  return `AED ${amount.toLocaleString("en-AE")}`
}

/** "07:30" -> "7:30 am" */
export function formatClock(time24: string): string {
  const [h, m] = time24.split(":").map(Number)
  const suffix = h >= 12 ? "pm" : "am"
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`
}

/** Minutes -> "45 min" / "1h 15m" */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

/** "Member 12" -> "M1" */
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function pluralize(count: number, one: string, many: string): string {
  return count === 1 ? one : many
}

/** Clamped 0–100 percentage, safe when the denominator is 0. */
export function percent(part: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((part / total) * 100)))
}
