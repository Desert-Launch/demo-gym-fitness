import type { Metadata } from "next"
import Link from "next/link"

import { SectionHeading } from "@/components/layout/page-container"
import { CtaBand } from "@/components/marketing/cta-band"
import { Button } from "@/components/ui/button"
import { OPENING_HOURS, VENUE } from "@/lib/club"

export const metadata: Metadata = {
  title: "The club",
  description:
    "How Forge Athletic Club works: capped classes, coached sessions, and a floor built for barbells in Al Quoz, Dubai.",
}

const PRINCIPLES = [
  {
    index: "01",
    title: "Twelve to a class",
    body: "Strength classes cap at twelve so a coach can watch every rep. Nobody queues for a rack, and nobody trains unwatched.",
  },
  {
    index: "02",
    title: "Blocks, not sessions",
    body: "Programming runs in twelve-week blocks with a test week at each end. You always know what you're chasing.",
  },
  {
    index: "03",
    title: "Numbers on the wall",
    body: "Lifts, splits and attendance get logged. Your coach reviews them with you once a month, in person.",
  },
  {
    index: "04",
    title: "No contracts you can't leave",
    body: "Monthly rolls month to month. Longer plans exist because they're cheaper, not to trap anyone.",
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-steel-200 py-12 lg:py-16">
        <div className="container-forge grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-steel-500">
              <span className="h-[2px] w-8 bg-brand-bright" aria-hidden />
              The club
            </p>
            <h1 className="display mt-6 text-display-lg text-ink">
              Built in a warehouse, run like a team
            </h1>
            <p className="mt-6 max-w-[58ch] text-lead text-steel-600">
              Forge opened in 2019 with four racks, two coaches and a rowing
              machine that never worked. The idea hasn&apos;t changed since:
              coached sessions, small groups, and a floor where people know each
              other&apos;s names.
            </p>
            <p className="mt-4 max-w-[58ch] leading-relaxed text-steel-700">
              Today there are eighteen coaches, five spaces and sixty sessions a
              week. Every one is written by the coach delivering it, and every
              member gets the same first month: three coached sessions, a
              movement screen, and a plan for the twelve weeks after.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="hatch-ink aspect-[4/3] w-full" aria-hidden />
            <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
              {VENUE.street} · {VENUE.area}
            </p>
          </div>
        </div>
      </section>

      <section className="py-section">
        <div className="container-forge">
          <SectionHeading
            index="02"
            eyebrow="How we run it"
            title="Four things we don't bend on"
          />
          <div className="mt-12 grid gap-px border border-steel-200 bg-steel-200 md:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <article key={principle.index} className="bg-chalk p-8">
                <p className="tnum font-mono text-sm text-brand">
                  {principle.index}
                </p>
                <h3 className="display mt-4 text-display-sm text-ink">
                  {principle.title}
                </h3>
                <p className="mt-4 max-w-[46ch] leading-relaxed text-steel-600">
                  {principle.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-steel-200 bg-paper py-section">
        <div className="container-forge grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading index="03" eyebrow="Visit" title="Hours and address" />
          </div>
          <div className="lg:col-span-7">
            <ul className="divide-y divide-steel-200 border-y border-steel-200">
              {OPENING_HOURS.map((row) => (
                <li
                  key={row.days}
                  className="flex items-center justify-between gap-6 py-4"
                >
                  <span className="text-sm font-medium text-ink">{row.days}</span>
                  <span className="tnum font-mono text-sm text-steel-600">
                    {row.hours}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[46ch] text-sm leading-relaxed text-steel-600">
              {VENUE.street}, {VENUE.area}. Parking is free after 18:00 in the
              lot behind the warehouse. The desk is staffed every opening hour.
            </p>
            <Button asChild size="lg" variant="outline" className="mt-8">
              <Link href="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      </section>

      <CtaBand
        title="Come and see it"
        description="Walk in during opening hours for a look around, or book a day pass and train."
      />
    </>
  )
}
