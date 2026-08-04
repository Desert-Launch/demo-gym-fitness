import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SectionHeading } from "@/components/layout/page-container"
import { CtaBand } from "@/components/marketing/cta-band"
import { Hero } from "@/components/marketing/hero"
import { ResultsBand } from "@/components/marketing/results-band"
import { TrustStrip } from "@/components/marketing/trust-strip"
import { Button } from "@/components/ui/button"
import { ClassTypeGrid } from "@/features/classes/components/class-type-grid"
import { PlanGrid } from "@/features/plans/components/plan-grid"
import { TrainerGrid } from "@/features/trainers/components/trainer-grid"

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />

      <section className="py-section">
        <div className="container-forge">
          <SectionHeading
            index="02"
            eyebrow="What we run"
            title="Six ways to train"
            description="Every session is coached, capped and programmed as part of a block — not thrown together on the morning."
            action={
              <Button asChild variant="outline" size="lg">
                <Link href="/classes">
                  See this week <ArrowRight />
                </Link>
              </Button>
            }
          />
          <ClassTypeGrid className="mt-12" />
        </div>
      </section>

      <section className="border-y border-steel-200 bg-paper py-section">
        <div className="container-forge">
          <SectionHeading
            index="03"
            eyebrow="Membership"
            title="Pick a plan, start this week"
            description="Prices in AED, no joining fee. Move between plans whenever your training changes."
            action={
              <Button asChild variant="outline" size="lg">
                <Link href="/membership">Compare plans</Link>
              </Button>
            }
          />
          <PlanGrid className="mt-12" />
        </div>
      </section>

      <ResultsBand />

      <section className="border-t border-steel-200 py-section">
        <div className="container-forge">
          <SectionHeading
            index="05"
            eyebrow="The team"
            title="Coaches, not instructors"
            description="Eighteen coaches on the floor. Every one of them writes programmes, not just playlists."
            action={
              <Button asChild variant="outline" size="lg">
                <Link href="/trainers">Meet the team</Link>
              </Button>
            }
          />
          <TrainerGrid limit={4} className="mt-12" />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
