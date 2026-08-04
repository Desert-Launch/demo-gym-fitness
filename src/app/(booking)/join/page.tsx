import type { Metadata } from "next"
import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { JoinFlow } from "@/features/join/components/join-flow"

export const metadata: Metadata = {
  title: "Join the club",
  description:
    "Pick a plan, tell us who you are, and start training this week. No joining fee.",
}

export default function JoinPage() {
  return (
    <>
      <section className="border-b border-steel-200 py-10 lg:py-12">
        <div className="container-forge">
          <p className="eyebrow flex items-center gap-3 text-steel-500">
            <span className="h-[2px] w-8 bg-brand-bright" aria-hidden />
            Join
          </p>
          <h1 className="display mt-5 max-w-[16ch] text-display-md text-ink">
            Three steps and you&apos;re training
          </h1>
        </div>
      </section>

      <Suspense fallback={<JoinSkeleton />}>
        <JoinFlow />
      </Suspense>
    </>
  )
}

function JoinSkeleton() {
  return (
    <div className="container-forge grid gap-12 py-12 lg:grid-cols-12 lg:gap-16">
      <div className="space-y-3 lg:col-span-7">
        <Skeleton className="h-12 w-full" />
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-80 lg:col-span-5" />
    </div>
  )
}
