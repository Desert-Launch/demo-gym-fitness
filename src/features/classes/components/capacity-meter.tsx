import { cn, percent } from "@/lib/utils"

type Tone = "ice" | "brand" | "steel"

function toneFor(spotsLeft: number, capacity: number): Tone {
  if (spotsLeft === 0) return "brand"
  if (spotsLeft <= Math.max(2, Math.round(capacity * 0.2))) return "brand"
  return "ice"
}

/**
 * The bar that carries the whole timetable: how full a session is, and how many
 * spots are left. Colour only ever means one thing — scarlet is "nearly gone".
 */
export function CapacityMeter({
  bookedCount,
  capacity,
  spotsLeft,
  size = "default",
  className,
}: {
  bookedCount: number
  capacity: number
  spotsLeft: number
  size?: "default" | "sm"
  className?: string
}) {
  const filled = percent(bookedCount, capacity)
  const tone = toneFor(spotsLeft, capacity)

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative flex-1 overflow-hidden bg-steel-200",
          size === "sm" ? "h-[3px]" : "h-1"
        )}
        role="img"
        aria-label={`${bookedCount} of ${capacity} spots taken`}
      >
        <span
          className={cn(
            "absolute inset-y-0 left-0 transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-out)]",
            tone === "brand" ? "bg-brand-bright" : "bg-ice-bright"
          )}
          style={{ width: `${filled}%` }}
        />
      </div>
      <span
        className={cn(
          "tnum shrink-0 font-mono text-[0.6875rem] tabular-nums",
          spotsLeft === 0
            ? "text-brand"
            : tone === "brand"
              ? "text-brand"
              : "text-steel-500"
        )}
      >
        {spotsLeft === 0 ? "Full" : `${spotsLeft} left`}
      </span>
    </div>
  )
}
