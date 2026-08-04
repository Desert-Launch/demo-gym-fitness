import type { Metadata } from "next"

import { SectionHeading } from "@/components/layout/page-container"
import { CtaBand } from "@/components/marketing/cta-band"
import { PlanComparison } from "@/features/plans/components/plan-comparison"
import { PlanGrid } from "@/features/plans/components/plan-grid"

export const metadata: Metadata = {
  title: "Membership",
  description:
    "Day passes, monthly, quarterly and annual memberships in AED. No joining fee, freeze any time.",
}

const QUESTIONS = [
  {
    q: "Can I switch plans later?",
    a: "Yes. Move up or down whenever you like — the change takes effect on your next renewal date, and the front desk handles it in a minute.",
  },
  {
    q: "What happens if I travel?",
    a: "Freeze your membership from the app or the desk. Monthly gets 14 days a year, quarterly 30, annual 60.",
  },
  {
    q: "Do I need to book classes ahead?",
    a: "Classes are capped at twelve to twenty people, so yes. Booking opens 7 days ahead on monthly, 14 on quarterly and annual.",
  },
  {
    q: "Is there a joining fee?",
    a: "No. You pay for the plan and nothing else. Kit and towels are included on every plan.",
  },
]

export default function MembershipPage() {
  return (
    <>
      <section className="border-b border-steel-200 py-12 lg:py-16">
        <div className="container-forge">
          <p className="eyebrow flex items-center gap-3 text-steel-500">
            <span className="h-[2px] w-8 bg-brand-bright" aria-hidden />
            Membership
          </p>
          <h1 className="display mt-6 max-w-[18ch] text-display-lg text-ink">
            Four ways in. All of them coached.
          </h1>
          <p className="mt-6 max-w-[56ch] text-lead text-steel-600">
            Prices are in AED and include kit, towels and open-floor access on
            every plan except the day pass. No joining fee, ever.
          </p>
        </div>
      </section>

      <section className="py-section">
        <div className="container-forge">
          <PlanGrid />
        </div>
      </section>

      <section className="border-y border-steel-200 bg-paper py-section">
        <div className="container-forge">
          <SectionHeading
            index="02"
            eyebrow="Side by side"
            title="What each plan includes"
          />
          <PlanComparison className="mt-12" />
        </div>
      </section>

      <section className="py-section">
        <div className="container-forge">
          <SectionHeading
            index="03"
            eyebrow="Before you join"
            title="Questions we get asked"
          />
          <dl className="mt-12 grid gap-px border border-steel-200 bg-steel-200 md:grid-cols-2">
            {QUESTIONS.map((item) => (
              <div key={item.q} className="bg-chalk p-6">
                <dt className="display text-base text-ink">{item.q}</dt>
                <dd className="mt-3 text-sm leading-relaxed text-steel-600">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand
        title="Still deciding?"
        description="Take a day pass and train with a coach before you commit to anything."
        primary={{ href: "/join?plan=day-pass", label: "Buy a day pass" }}
        secondary={{ href: "/contact", label: "Ask a question" }}
      />
    </>
  )
}
