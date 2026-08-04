import { QueryClient } from "@tanstack/react-query"

/**
 * The store only lives in the browser tab, so queries are never prefetched on
 * the server. staleTime is short because mutations invalidate explicitly.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10_000,
        refetchOnWindowFocus: false,
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}
