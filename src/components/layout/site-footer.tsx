import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

import { Logo } from "@/components/layout/logo"
import { OPENING_HOURS, VENUE } from "@/lib/club"

const COLUMNS = [
  {
    title: "Train",
    links: [
      { href: "/classes", label: "Weekly timetable" },
      { href: "/membership", label: "Membership plans" },
      { href: "/trainers", label: "Coaches" },
      { href: "/join", label: "Join the club" },
    ],
  },
  {
    title: "Club",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/contact", label: "Contact" },
      { href: "/admin", label: "Staff view" },
    ],
  },
] as const

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-steel-950 text-steel-300">
      <div className="container-forge py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo tone="chalk" />
            <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-steel-400">
              A strength and conditioning club in Dubai. Sixty coached
              sessions a week, capped class sizes, coaches who know your name.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="/contact"
                className="inline-flex size-10 items-center justify-center border border-steel-800 text-steel-300 transition-colors hover:border-brand-bright hover:text-brand-bright"
                aria-label="Call the club"
              >
                <Phone className="size-4" />
              </a>
              <a
                href={`mailto:${VENUE.email}`}
                className="inline-flex size-10 items-center justify-center border border-steel-800 text-steel-300 transition-colors hover:border-brand-bright hover:text-brand-bright"
                aria-label="Email the club"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="eyebrow text-steel-400">{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-steel-300 transition-colors hover:text-steel-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="eyebrow text-steel-400">Hours</h2>
            <ul className="mt-5 space-y-2 font-mono text-xs text-steel-300">
              {OPENING_HOURS.map((row) => (
                <li key={row.days} className="flex justify-between gap-4">
                  <span className="text-steel-400">{row.days}</span>
                  <span className="tnum">{row.hours}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-start gap-2 text-sm text-steel-400">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>
                {VENUE.street}
                <br />
                {VENUE.area}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-steel-800 pt-6 text-xs text-steel-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {VENUE.year} Demo Gym. Fictional club, demo build.</p>
          <p className="font-mono">
            Demo data resets on refresh — nothing here is real.
          </p>
        </div>
      </div>
    </footer>
  )
}
