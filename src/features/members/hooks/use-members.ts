"use client"

import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query"

import * as api from "../api"
import type { CreateMemberInput, UpdateMemberInput } from "@/lib/store"

export const memberKeys = {
  all: ["members"] as const,
  list: () => [...memberKeys.all, "list"] as const,
  detail: (memberId: string) => [...memberKeys.all, "detail", memberId] as const,
}

export function useMembers() {
  return useQuery({
    queryKey: memberKeys.list(),
    queryFn: api.fetchMembers,
  })
}

export function useMember(memberId: string | null) {
  return useQuery({
    queryKey: memberKeys.detail(memberId ?? "none"),
    queryFn: () => api.fetchMember(memberId as string),
    enabled: Boolean(memberId),
  })
}

export function invalidateMembers(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: memberKeys.all })
}

export function useCreateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateMemberInput) => api.createMember(input),
    onSuccess: () => invalidateMembers(queryClient),
  })
}

export function useUpdateMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      memberId,
      patch,
    }: {
      memberId: string
      patch: UpdateMemberInput
    }) => api.updateMember(memberId, patch),
    onSuccess: () => invalidateMembers(queryClient),
  })
}

export function useDeleteMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (memberId: string) => api.deleteMember(memberId),
    onSuccess: () => invalidateMembers(queryClient),
  })
}
