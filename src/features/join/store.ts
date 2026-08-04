import { create } from "zustand"

import type { JoinDetailsValues } from "./schema"

/**
 * Cross-cutting client state: the plan someone picked on /membership survives
 * the trip to /join, and their half-filled details survive a step back. Nothing
 * here is persisted — it dies with the tab, like the rest of the demo.
 */
interface JoinDraftState {
  planId: string | null
  details: Partial<JoinDetailsValues>
  setPlanId: (planId: string) => void
  setDetails: (details: Partial<JoinDetailsValues>) => void
  clear: () => void
}

export const useJoinDraft = create<JoinDraftState>((set) => ({
  planId: null,
  details: {},
  setPlanId: (planId) => set({ planId }),
  setDetails: (details) =>
    set((state) => ({ details: { ...state.details, ...details } })),
  clear: () => set({ planId: null, details: {} }),
}))
