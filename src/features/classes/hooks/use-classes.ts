"use client"

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query"

import * as api from "../api"
import type { CreateClassInput, UpdateClassInput } from "@/lib/store"

export const classKeys = {
  all: ["classes"] as const,
  list: () => [...classKeys.all, "list"] as const,
  detail: (classId: string) => [...classKeys.all, "detail", classId] as const,
  types: () => ["class-types"] as const,
}

export function useClasses() {
  return useQuery({
    queryKey: classKeys.list(),
    queryFn: api.fetchClasses,
  })
}

export function useClass(classId: string) {
  return useQuery({
    queryKey: classKeys.detail(classId),
    queryFn: () => api.fetchClass(classId),
    enabled: Boolean(classId),
  })
}

export function useClassTypes() {
  return useQuery({
    queryKey: classKeys.types(),
    queryFn: api.fetchClassTypes,
    staleTime: Infinity,
  })
}

/** Anything that changes occupancy or the schedule invalidates through here. */
export function invalidateClasses(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: classKeys.all })
}

export function useCreateClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateClassInput) => api.createClass(input),
    onSuccess: () => invalidateClasses(queryClient),
  })
}

export function useUpdateClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      classId,
      patch,
    }: {
      classId: string
      patch: UpdateClassInput
    }) => api.updateClass(classId, patch),
    onSuccess: () => invalidateClasses(queryClient),
  })
}

export function useDeleteClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (classId: string) => api.deleteClass(classId),
    onSuccess: () => invalidateClasses(queryClient),
  })
}
