import { create } from "zustand"

export interface StaffMember {
  id: string
  name: string
  role: string
}

/** The demo's fake sign-in. No auth, no server — just who the screen belongs to. */
export const STAFF: StaffMember[] = [
  { id: "staff-1", name: "Manager 1", role: "Club manager" },
  { id: "staff-2", name: "Receptionist 1", role: "Front desk" },
  { id: "staff-3", name: "Trainer 1", role: "Head coach" },
]

interface StaffSessionState {
  current: StaffMember
  signInAs: (staffId: string) => void
}

export const useStaffSession = create<StaffSessionState>((set) => ({
  current: STAFF[0],
  signInAs: (staffId) =>
    set((state) => ({
      current: STAFF.find((member) => member.id === staffId) ?? state.current,
    })),
}))
