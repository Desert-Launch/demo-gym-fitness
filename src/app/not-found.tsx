import Link from "next/link"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex flex-1 items-center">
        <div className="container-forge py-24">
          <p className="eyebrow flex items-center gap-3 text-steel-500">
            <span className="h-[2px] w-8 bg-brand-bright" aria-hidden />
            404
          </p>
          <h1 className="display mt-6 max-w-[16ch] text-display-lg text-ink">
            That page isn&apos;t on the schedule
          </h1>
          <p className="mt-6 max-w-[52ch] text-lead text-steel-600">
            The link is wrong or the page has moved. The timetable and the
            membership plans are both one click away.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/classes">See the timetable</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/">Back to the home page</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
