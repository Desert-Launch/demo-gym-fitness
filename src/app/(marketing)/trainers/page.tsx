import type { Metadata } from "next"

import { CtaBand } from "@/components/marketing/cta-band"
import { TrainerGrid } from "@/features/trainers/components/trainer-grid"

export const metadata: Metadata = {
  title: "Coaches",
  description:
    "The coaches on the Forge floor — strength, conditioning, boxing, yoga and mobility specialists.",
}

export default function TrainersPage() {
  return (
    <>
      <section className="border-b border-steel-200 py-12 lg:py-16">
        <div className="container-forge">
          <p className="eyebrow flex items-center gap-3 text-steel-500">
            <span className="h-[2px] w-8 bg-brand-bright" aria-hidden />
            The team
          </p>
          <h1 className="display mt-6 max-w-[16ch] text-display-lg text-ink">
            The people on the floor
          </h1>
          <p className="mt-6 max-w-[56ch] text-lead text-steel-600">
            Every coach here writes programmes, watches lifts and remembers what
            you did last week. Pick one and see what they teach.
          </p>
        </div>
      </section>

      <section className="py-section">
        <div className="container-forge">
          <TrainerGrid />
        </div>
      </section>

      <CtaBand
        title="Train with one of them this week"
        description="Browse the timetable, pick a session and book it. Day passes are welcome."
      />
    </>
  )
}
