import { cn } from "@/lib/utils"

/** Five bars, filled to the class's intensity. Sits under every class type. */
export function IntensityMeter({
  intensity,
  className,
}: {
  intensity: number
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="eyebrow text-steel-500">Effort</span>
      <span className="flex gap-1" role="img" aria-label={`Intensity ${intensity} of 5`}>
        {[1, 2, 3, 4, 5].map((step) => (
          <span
            key={step}
            className={cn(
              "h-3 w-[3px]",
              step <= intensity ? "bg-brand-bright" : "bg-steel-300"
            )}
          />
        ))}
      </span>
    </div>
  )
}
