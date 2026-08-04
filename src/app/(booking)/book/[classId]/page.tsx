import type { Metadata } from "next"

import { BookingFlow } from "@/features/bookings/components/booking-flow"

export const metadata: Metadata = {
  title: "Book a class",
  description: "Hold your spot in a coached session at Forge Athletic Club.",
}

export default async function BookClassPage({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params

  return (
    <>
      <section className="border-b border-steel-200 py-10 lg:py-12">
        <div className="container-forge">
          <p className="eyebrow flex items-center gap-3 text-steel-500">
            <span className="h-[2px] w-8 bg-brand-bright" aria-hidden />
            Booking
          </p>
          <h1 className="display mt-5 max-w-[18ch] text-display-md text-ink">
            Hold your spot
          </h1>
        </div>
      </section>

      <BookingFlow classId={classId} />
    </>
  )
}
