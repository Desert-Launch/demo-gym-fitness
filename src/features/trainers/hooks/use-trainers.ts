"use client"

import { useQuery } from "@tanstack/react-query"

import * as api from "../api"

export const trainerKeys = {
  all: ["trainers"] as const,
  list: () => [...trainerKeys.all, "list"] as const,
  detail: (slug: string) => [...trainerKeys.all, "detail", slug] as const,
}

export function useTrainers() {
  return useQuery({
    queryKey: trainerKeys.list(),
    queryFn: api.fetchTrainers,
    staleTime: Infinity,
  })
}

export function useTrainer(slug: string) {
  return useQuery({
    queryKey: trainerKeys.detail(slug),
    queryFn: () => api.fetchTrainerBySlug(slug),
    enabled: Boolean(slug),
  })
}
