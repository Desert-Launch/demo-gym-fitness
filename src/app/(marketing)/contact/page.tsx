import type { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"

import { ContactForm } from "@/features/contact/components/contact-form"
import { OPENING_HOURS, VENUE } from "@/lib/club"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Find Forge Athletic Club in Al Quoz, Dubai. Opening hours, phone, email and a form for anything else.",
}

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-steel-200 py-12 lg:py-16">
        <div className="container-forge">
          <p className="eyebrow flex items-center gap-3 text-steel-500">
            <span className="h-[2px] w-8 bg-brand-bright" aria-hidden />
            Contact
          </p>
          <h1 className="display mt-6 max-w-[18ch] text-display-lg text-ink">
            Come in, call, or write
          </h1>
          <p className="mt-6 max-w-[56ch] text-lead text-steel-600">
            The desk is staffed every opening hour. Walk in for a look around —
            no appointment needed.
          </p>
        </div>
      </section>

      <section className="py-section">
        <div className="container-forge grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="display text-display-sm text-ink">Send a message</h2>
            <p className="mt-3 max-w-[52ch] text-sm text-steel-600">
              Tell us what you want to train for. Someone from the coaching team
              replies, not a bot.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="border-2 border-ink">
              <div className="hatch-brand h-40" aria-hidden />
              <div className="p-6">
                <h2 className="display text-display-sm text-ink">Find us</h2>
                <ul className="mt-6 space-y-5 text-sm">
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                    <span className="text-steel-700">
                      {VENUE.street}
                      <br />
                      {VENUE.area}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-brand" />
                    <a
                      href={`tel:${VENUE.phone.replace(/\s/g, "")}`}
                      className="text-steel-700 underline-offset-4 hover:underline"
                    >
                      {VENUE.phone}
                    </a>
                  </li>
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
                    <a
                      href={`mailto:${VENUE.email}`}
                      className="text-steel-700 underline-offset-4 hover:underline"
                    >
                      {VENUE.email}
                    </a>
                  </li>
                </ul>

                <h3 className="eyebrow mt-8 border-t border-steel-200 pt-6 text-steel-500">
                  Opening hours
                </h3>
                <ul className="mt-4 space-y-2 font-mono text-xs">
                  {OPENING_HOURS.map((row) => (
                    <li key={row.days} className="flex justify-between gap-4">
                      <span className="text-steel-500">{row.days}</span>
                      <span className="tnum text-ink">{row.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
