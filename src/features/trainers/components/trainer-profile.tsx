"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CapacityMeter } from "@/features/classes/components/capacity-meter"
import { useClassTypes } from "@/features/classes"
import { formatClock, formatDuration } from "@/lib/utils"
import { dayLabel } from "@/lib/week"

import { useTrainer } from "../hooks/use-trainers"
import { TrainerPortrait } from "./trainer-card"

export function TrainerProfile({ slug }: { slug: string }) {
  const { data, isPending, isError, error } = useTrainer(slug)
  const typesQuery = useClassTypes()

  if (isPending) {
    return (
      <div className="container-forge grid gap-12 py-16 lg:grid-cols-12">
        <Skeleton className="aspect-[4/5] lg:col-span-4" />
        <div className="lg:col-span-8">
          <Skeleton className="h-12 w-72" />
          <Skeleton className="mt-4 h-4 w-48" />
          <Skeleton className="mt-8 h-24 w-full" />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container-forge py-24 text-center">
        <h1 className="display text-display-md">We couldn&apos;t find that coach</h1>
        <p className="mt-4 text-steel-600">{error.message}</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/trainers">
            <ArrowLeft /> Back to the team
          </Link>
        </Button>
      </div>
    )
  }

  const { trainer, classes } = data
  const typeName = (id: string) =>
    typesQuery.data?.find((type) => type.id === id)?.name ?? id

  return (
    <>
      <section className="border-b border-steel-200 py-12 lg:py-16">
        <div className="container-forge">
          <Link
            href="/trainers"
            className="eyebrow inline-flex items-center gap-2 text-steel-500 transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-3.5" /> All coaches
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <TrainerPortrait name={trainer.name} tone="brand" />
            </div>

            <div className="lg:col-span-8">
              <h1 className="display text-display-lg text-ink">{trainer.name}</h1>
              <p className="mt-3 text-lead text-steel-600">{trainer.headline}</p>

              <p className="mt-8 max-w-[60ch] leading-relaxed text-steel-700">
                {trainer.bio}
              </p>

              <dl className="mt-10 grid gap-px border border-steel-200 bg-steel-200 sm:grid-cols-3">
                <div className="bg-chalk p-5">
                  <dt className="eyebrow text-steel-500">Coaching since</dt>
                  <dd className="tnum mt-2 font-mono text-2xl font-bold text-ink">
                    {new Date().getFullYear() - trainer.yearsExperience}
                  </dd>
                </div>
                <div className="bg-chalk p-5">
                  <dt className="eyebrow text-steel-500">Teaches</dt>
                  <dd className="mt-2 text-sm text-steel-700">
                    {trainer.specialties.map(typeName).join(", ")}
                  </dd>
                </div>
                <div className="bg-chalk p-5">
                  <dt className="eyebrow text-steel-500">Certified</dt>
                  <dd className="mt-2 text-sm text-steel-700">
                    {trainer.certifications.join(", ")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section">
        <div className="container-forge">
          <div className="border-t-2 border-ink pt-5">
            <p className="eyebrow text-steel-500">This week with {trainer.name.split(" ")[0]}</p>
            <h2 className="display mt-4 text-display-md text-ink">
              {classes.length} sessions on the schedule
            </h2>
          </div>

          {classes.length === 0 ? (
            <p className="mt-10 max-w-[52ch] text-steel-600">
              Nothing on the timetable this week. Check the full schedule for
              another coach in the same slot.
            </p>
          ) : (
            <ul className="mt-10 divide-y divide-steel-200 border-y border-steel-200">
              {classes.map((session) => (
                <li key={session.id}>
                  <Link
                    href={`/book/${session.id}`}
                    className="group flex flex-wrap items-center gap-x-6 gap-y-3 py-5 transition-colors hover:bg-paper"
                  >
                    <span className="w-28 shrink-0">
                      <span className="display block text-sm text-ink">
                        {dayLabel(session.dayOfWeek, "short")}
                      </span>
                      <span className="tnum font-mono text-xs text-steel-500">
                        {formatClock(session.startTime)}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="display block text-base text-ink group-hover:text-brand">
                        {session.type.name}
                      </span>
                      <span className="text-xs text-steel-500">
                        {session.studio} · {formatDuration(session.durationMinutes)}
                      </span>
                    </span>
                    <CapacityMeter
                      className="w-40"
                      bookedCount={session.bookedCount}
                      capacity={session.capacity}
                      spotsLeft={session.spotsLeft}
                    />
                    <ArrowRight className="size-4 shrink-0 text-steel-400 transition-transform group-hover:translate-x-1 group-hover:text-brand" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
