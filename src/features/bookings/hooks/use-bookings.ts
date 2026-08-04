"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { classKeys } from "@/features/classes"
import { memberKeys } from "@/features/members"
import type { CreateBookingInput } from "@/lib/store"

import * as api from "../api"
import type { BookingWithMember } from "../api"

export const bookingKeys = {
  all: ["bookings"] as const,
  forClass: (classId: string) => [...bookingKeys.all, "class", classId] as const,
  forMember: (memberId: string) =>
    [...bookingKeys.all, "member", memberId] as const,
}

export function useBookingsForClass(classId: string | null) {
  return useQuery({
    queryKey: bookingKeys.forClass(classId ?? "none"),
    queryFn: () => api.fetchBookingsForClass(classId as string),
    enabled: Boolean(classId),
  })
}

export function useBookingsForMember(memberId: string | null) {
  return useQuery({
    queryKey: bookingKeys.forMember(memberId ?? "none"),
    queryFn: () => api.fetchBookingsForMember(memberId as string),
    enabled: Boolean(memberId),
  })
}

export function useCreateBooking() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateBookingInput) => api.createBooking(input),
    onSuccess: () => {
      // A new booking changes occupancy, so the timetable and the dashboard
      // both go stale.
      void queryClient.invalidateQueries({ queryKey: classKeys.all })
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all })
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}

/**
 * Optimistic cancel: the row greys out the moment you click, and snaps back if
 * the service call fails (it does, about one time in ten — see api.ts).
 */
export function useCancelBooking(classId: string) {
  const queryClient = useQueryClient()
  const listKey = bookingKeys.forClass(classId)

  return useMutation({
    mutationFn: (bookingId: string) => api.cancelBooking(bookingId),
    onMutate: async (bookingId) => {
      await queryClient.cancelQueries({ queryKey: listKey })
      const previous = queryClient.getQueryData<BookingWithMember[]>(listKey)

      queryClient.setQueryData<BookingWithMember[]>(listKey, (rows) =>
        rows?.map((row) =>
          row.id === bookingId ? { ...row, status: "cancelled" as const } : row
        )
      )

      return { previous }
    },
    onError: (_error, _bookingId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(listKey, context.previous)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: listKey })
      void queryClient.invalidateQueries({ queryKey: classKeys.all })
      void queryClient.invalidateQueries({ queryKey: memberKeys.all })
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
