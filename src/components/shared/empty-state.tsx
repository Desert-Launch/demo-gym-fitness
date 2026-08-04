import { cn } from "@/lib/utils"

/** Empty states invite the next action rather than apologising for the gap. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center border border-dashed border-steel-300 bg-paper px-6 py-14 text-center",
        className
      )}
    >
      {Icon ? <Icon className="size-6 text-steel-500" /> : null}
      <p className="display mt-4 text-display-sm text-ink">{title}</p>
      <p className="mx-auto mt-3 max-w-[46ch] text-sm text-steel-600">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
