import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CtaBand({
  title = "Start with one session",
  description = "Take a day pass, train with a coach, and decide afterwards. No contract, no sales call.",
  primary = { href: "/join", label: "Join now" },
  secondary = { href: "/classes", label: "Browse the timetable" },
}: {
  title?: string
  description?: string
  primary?: { href: string; label: string }
  secondary?: { href: string; label: string }
}) {
  return (
    <section className="bg-brand text-white">
      <div className="container-forge flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div className="max-w-2xl">
          <h2 className="display text-display-md">{title}</h2>
          <p className="mt-4 max-w-[48ch] text-lead text-white/85">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-white text-brand hover:bg-white/90"
          >
            <Link href={primary.href}>
              {primary.label} <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/50 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href={secondary.href}>{secondary.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
