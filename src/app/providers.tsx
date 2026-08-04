"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

import { makeQueryClient } from "@/lib/query-client"

export function Providers({ children }: { children: React.ReactNode }) {
  // One client per browser session, created lazily so it is never shared
  // between requests during SSR.
  const [queryClient] = useState(makeQueryClient)

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
