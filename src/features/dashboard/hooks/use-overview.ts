"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import * as api from "../api"

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
}

export function useOverview() {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: api.fetchOverview,
  })
}

/** Re-seeds the store, then drops every cached query so the UI re-reads it. */
export function useResetDemoData() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.resetDemoData,
    onSuccess: () => queryClient.invalidateQueries(),
  })
}
