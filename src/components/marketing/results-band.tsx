import { SectionHeading } from "@/components/layout/page-container"

/**
 * Results, told in numbers rather than before-and-after photos. Nothing here
 * pictures a real person — the panels are hatched blocks by design.
 */
const RESULTS = [
  {
    stat: "+18 kg",
    label: "Median back squat added over a 12-week block",
    note: "Measured at the start and end of every strength cycle.",
    tone: "hatch-brand",
  },
  {
    stat: "4.2",
    label: "Sessions a week, club average",
    note: "Capped classes mean people actually get their slot.",
    tone: "hatch",
  },
  {
    stat: "92%",
    label: "Members who rebook within a month of joining",
    note: "The first four weeks are coached one-to-one on the floor.",
    tone: "hatch-ink",
  },
] as const

export function ResultsBand() {
  return (
    <section className="py-section">
      <div className="container-forge">
        <SectionHeading
          index="04"
          eyebrow="What changes"
          title="Progress you can point at"
          description="Every member gets a number to beat. We log the lifts, the splits and the sessions, then review them with you every month."
        />

        <div className="mt-12 grid gap-px border border-steel-200 bg-steel-200 md:grid-cols-3">
          {RESULTS.map((result) => (
            <article key={result.stat} className="bg-chalk">
              <div className={`${result.tone} h-32`} aria-hidden />
              <div className="p-6">
                <p className="tnum font-mono text-4xl font-bold text-ink">
                  {result.stat}
                </p>
                <p className="mt-3 text-sm font-medium text-ink">{result.label}</p>
                <p className="mt-2 text-sm text-steel-600">{result.note}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
          Club averages from the last four blocks. Demo figures.
        </p>
      </div>
    </section>
  )
}
