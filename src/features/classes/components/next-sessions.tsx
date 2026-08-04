"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatClock } from "@/lib/utils"
import { dayLabel, todayIndex } from "@/lib/week"

import { useClasses } from "../hooks/use-classes"

/**
 * Live board for the hero: what's on today and what's left in it. Reads the
 * same store the booking flow writes to, so a booking made in the admin shows
 * up here on the way back to the home page.
 */
export function NextSessions({ className }: { className?: string }) {
  const { data, isPending } = useClasses()
  const today = todayIndex()

  const sessions = (data ?? [])
    .filter((gymClass) => gymClass.dayOfWeek === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 4)

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-2 border-ink bg-steel-950 p-6 text-steel-200",
        className
      )}
      aria-label="Today's sessions"
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-steel-800 pb-4">
        <h2 className="eyebrow text-steel-400">On today</h2>
        <span className="font-mono text-[0.6875rem] text-steel-500">
          {dayLabel(today)}
        </span>
      </div>

      {isPending ? (
        <ul className="mt-4 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="flex gap-4">
              <Skeleton className="h-4 w-12 bg-steel-800" />
              <Skeleton className="h-4 flex-1 bg-steel-800" />
            </li>
          ))}
        </ul>
      ) : sessions.length === 0 ? (
        <p className="mt-6 text-sm text-steel-400">
          Nothing scheduled today. The floor is still open for training —{" "}
          <Link href="/classes" className="text-steel-0 underline underline-offset-4">
            see the week
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-2 flex-1 divide-y divide-steel-800">
          {sessions.map((session) => (
            <li key={session.id}>
              <Link
                href={`/book/${session.id}`}
                className="group flex items-center gap-4 py-3.5 transition-colors hover:text-steel-0"
              >
                <span className="tnum w-14 shrink-0 font-mono text-xs text-steel-400">
                  {formatClock(session.startTime)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="display block text-sm text-steel-0">
                    {session.type.name}
                  </span>
                  <span className="block truncate text-xs text-steel-500">
                    {session.trainer.name}
                  </span>
                </span>
                <span
                  className={cn(
                    "tnum shrink-0 font-mono text-xs",
                    session.isFull ? "text-brand-bright" : "text-ice-bright"
                  )}
                >
                  {session.isFull ? "Waitlist" : `${session.spotsLeft} left`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/classes"
        className="mt-5 inline-flex items-center gap-2 self-start border-t border-steel-800 pt-5 text-xs font-medium text-steel-300 transition-colors hover:text-brand-bright"
      >
        See the full week <ArrowRight className="size-3.5" />
      </Link>
    </aside>
  )
}
