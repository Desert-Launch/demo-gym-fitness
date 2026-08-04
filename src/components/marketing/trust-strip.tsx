import { TRUST_SIGNALS } from "@/lib/club"

/** Four numbers, set big in mono, divided by hairlines. */
export function TrustStrip() {
  return (
    <section className="border-b border-steel-200 bg-paper">
      <div className="container-forge grid grid-cols-2 divide-steel-200 lg:grid-cols-4 lg:divide-x">
        {TRUST_SIGNALS.map((signal, index) => (
          <div
            key={signal.label}
            className={`px-2 py-8 lg:px-8 ${index < 2 ? "border-b border-steel-200 lg:border-b-0" : ""} ${index % 2 === 1 ? "border-l border-steel-200 lg:border-l-0" : ""}`}
          >
            <p className="tnum font-mono text-4xl font-bold text-ink lg:text-5xl">
              {signal.value}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-steel-500">
              {signal.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
