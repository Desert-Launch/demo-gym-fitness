"use client"

import { useQuery } from "@tanstack/react-query"

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
