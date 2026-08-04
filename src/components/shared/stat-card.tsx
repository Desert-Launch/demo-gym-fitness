import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/** One number, said plainly. Used across the admin overview. */
export function StatCard({
  label,
  value,
  note,
  tone = "default",
  isPending = false,
  className,
}: {
  label: string
  value: React.ReactNode
  note?: string
  tone?: "default" | "brand"
  isPending?: boolean
  className?: string
}) {
  return (
    <div className={cn("border border-steel-200 bg-paper p-5", className)}>
      <p className="eyebrow text-steel-500">{label}</p>
      {isPending ? (
        <Skeleton className="mt-3 h-8 w-24" />
      ) : (
        <p
          className={cn(
            "tnum mt-3 font-mono text-3xl font-bold",
            tone === "brand" ? "text-brand" : "text-ink"
          )}
        >
          {value}
        </p>
      )}
      {note ? (
        <p className="mt-2 text-xs text-steel-500">{note}</p>
      ) : null}
    </div>
  )
}
