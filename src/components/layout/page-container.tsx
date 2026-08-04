import { cn } from "@/lib/utils"

/** Page gutter + max width. Every section on the public site sits inside one. */
export function PageContainer({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("container-forge", className)} {...props}>
      {children}
    </div>
  )
}

/** Vertical rhythm between page sections. */
export function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section className={cn("py-section", className)} {...props}>
      {children}
    </section>
  )
}

/**
 * Numbered eyebrow + heading. The numbering is the poster device that ties the
 * marketing pages together.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "start",
  className,
  action,
}: {
  index?: string
  eyebrow: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: "start" | "center"
  className?: string
  action?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 border-t-2 border-ink pt-5 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <p className="eyebrow flex items-center gap-2 text-steel-500">
          {index ? <span className="text-brand">{index}</span> : null}
          {eyebrow}
        </p>
        <h2 className="display mt-4 text-display-md text-ink">{title}</h2>
        {description ? (
          <p className="mt-4 max-w-[52ch] text-lead text-steel-600">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
