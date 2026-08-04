"use client"

import { useQuery } from "@tanstack/react-query"

import * as api from "../api"

export const planKeys = {
  all: ["plans"] as const,
  list: () => [...planKeys.all, "list"] as const,
}

export function usePlans() {
  return useQuery({
    queryKey: planKeys.list(),
    queryFn: api.fetchPlans,
    staleTime: Infinity,
  })
}
