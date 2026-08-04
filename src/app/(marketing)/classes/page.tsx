import type { Metadata } from "next"

import { CtaBand } from "@/components/marketing/cta-band"
import { Timetable } from "@/features/classes/components/timetable"

export const metadata: Metadata = {
  title: "Weekly timetable",
  description:
    "Sixty coached sessions a week across HIIT, strength, yoga, spin, boxing and mobility. Live spots left on every class.",
}

export default function ClassesPage() {
  return (
    <>
      <section className="border-b border-steel-200 py-12 lg:py-16">
        <div className="container-forge">
          <p className="eyebrow flex items-center gap-3 text-steel-500">
            <span className="h-[2px] w-8 bg-brand-bright" aria-hidden />
            The week ahead
          </p>
          <h1 className="display mt-6 max-w-[16ch] text-display-lg text-ink">
            Every session, every spot left
          </h1>
          <p className="mt-6 max-w-[56ch] text-lead text-steel-600">
            Classes are capped, so the numbers below are live. Pick a session to
            book it — if it&apos;s full you can take a waitlist spot and
            we&apos;ll text you when one opens.
          </p>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="container-forge">
          <Timetable />
        </div>
      </section>

      <CtaBand
        title="Not a member yet?"
        description="Day passes get you into any class with a spot. Memberships open up the whole week."
        primary={{ href: "/join", label: "Join now" }}
        secondary={{ href: "/membership", label: "See plans" }}
      />
    </>
  )
}
