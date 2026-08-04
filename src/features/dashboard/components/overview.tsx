"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AlertTriangle, ArrowRight } from "lucide-react"

import { StatCard } from "@/components/shared/stat-card"
import { Button } from "@/components/ui/button"
import { MEMBER_STATUS_LABELS } from "@/features/members"
import { useStaffSession } from "@/features/staff/store"
import { formatAed, percent, pluralize } from "@/lib/utils"
import { dayLabel, todayIndex } from "@/lib/week"

import { useOverview } from "../hooks/use-overview"
import { JoinsChart } from "./joins-chart"
import { TodaysSchedule } from "./todays-schedule"

export function AdminOverview() {
  const { data, isPending, isError, error, refetch } = useOverview()
  const staff = useStaffSession((state) => state.current)

  // Set after mount so the server and the browser never disagree about the hour.
  const [greeting, setGreeting] = useState("Welcome back")
  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening")
  }, [])

  if (isError) {
    return (
      <div className="border-2 border-ink bg-paper p-8 text-center">
        <AlertTriangle className="mx-auto size-6 text-brand" />
        <p className="display mt-4 text-display-sm">The dashboard didn&apos;t load</p>
        <p className="mt-2 text-sm text-steel-600">{error.message}</p>
        <Button className="mt-6" size="lg" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const statusMix = data?.statusMix ?? []
  const totalMembers = statusMix.reduce((total, row) => total + row.count, 0)

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-5">
        <div>
          <p className="eyebrow text-steel-500">
            {dayLabel(todayIndex())} · Club overview
          </p>
          <h1 className="display mt-3 text-display-md text-ink">
            {greeting}, {staff.name.split(" ")[0]}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="lg">
            <Link href="/admin/classes">Manage classes</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/admin/members">
              Members <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active members"
          value={data?.activeMembers ?? 0}
          note={
            data
              ? `${data.memberDelta} ${pluralize(data.memberDelta, "join", "joins")} in the last week`
              : undefined
          }
          isPending={isPending}
        />
        <StatCard
          label="Check-ins today"
          value={data?.checkInsToday ?? 0}
          note={
            data
              ? `Across ${data.classesToday} ${pluralize(data.classesToday, "class", "classes")}`
              : undefined
          }
          isPending={isPending}
        />
        <StatCard
          label="Monthly revenue"
          value={data ? formatAed(data.monthlyRevenueAed, { compact: true }) : "—"}
          note="Active memberships, monthly equivalent"
          isPending={isPending}
        />
        <StatCard
          label="Average fill rate"
          value={data ? `${data.averageFillRate}%` : "—"}
          note={
            data
              ? `${data.waitlisted} on waitlists this week`
              : undefined
          }
          tone={data && data.averageFillRate >= 85 ? "brand" : "default"}
          isPending={isPending}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <section className="lg:col-span-7">
          <div className="flex items-baseline justify-between border-b border-steel-200 pb-4">
            <h2 className="display text-display-sm text-ink">New members</h2>
            <p className="eyebrow text-steel-500">Last 8 weeks</p>
          </div>
          <div className="mt-6">
            <JoinsChart data={data?.joinsByWeek ?? []} isPending={isPending} />
          </div>
        </section>

        <section className="lg:col-span-5">
          <div className="flex items-baseline justify-between border-b border-steel-200 pb-4">
            <h2 className="display text-display-sm text-ink">Membership mix</h2>
            <p className="eyebrow text-steel-500">{totalMembers} on the books</p>
          </div>
          <ul className="mt-6 space-y-4">
            {statusMix.map((row) => (
              <li key={row.status}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-steel-700">
                    {MEMBER_STATUS_LABELS[row.status]}
                  </span>
                  <span className="tnum font-mono text-xs text-steel-500">
                    {row.count} · {percent(row.count, totalMembers)}%
                  </span>
                </div>
                <div className="mt-2 h-1 bg-steel-200">
                  <span
                    className="block h-full bg-ink"
                    style={{ width: `${percent(row.count, totalMembers)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-steel-200 pb-4">
          <h2 className="display text-display-sm text-ink">Today&apos;s schedule</h2>
          <Link
            href="/admin/classes"
            className="text-xs font-medium text-steel-600 underline-offset-4 hover:text-brand hover:underline"
          >
            Manage the week
          </Link>
        </div>
        <div className="mt-6">
          <TodaysSchedule
            classes={data?.todaysClasses ?? []}
            isPending={isPending}
          />
        </div>
      </section>
    </div>
  )
}
