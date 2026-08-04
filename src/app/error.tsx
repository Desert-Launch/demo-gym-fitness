"use client"

import { useEffect } from "react"
import { RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-dvh items-center">
      <div className="container-forge py-24">
        <p className="eyebrow flex items-center gap-3 text-steel-500">
          <span className="h-[2px] w-8 bg-brand-bright" aria-hidden />
          Something broke
        </p>
        <h1 className="display mt-6 max-w-[18ch] text-display-lg text-ink">
          This screen stopped working
        </h1>
        <p className="mt-6 max-w-[52ch] text-lead text-steel-600">
          The demo runs entirely in your browser, so reloading rebuilds the club
          from seed data. Nothing was saved anywhere.
        </p>
        <Button size="lg" className="mt-10" onClick={reset}>
          <RotateCw /> Try again
        </Button>
      </div>
    </div>
  )
}
