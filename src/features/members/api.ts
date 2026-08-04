import * as store from "@/lib/store"
import { sleep } from "@/lib/store"
import type { MemberDetail } from "@/types"

export async function fetchMembers(): Promise<MemberDetail[]> {
  await sleep(180)
  return store.listMembers()
}

export async function fetchMember(memberId: string): Promise<MemberDetail> {
  await sleep(120)
  const member = store.getMember(memberId)
  if (!member) throw new Error("That member is no longer in the club.")
  return member
}

export async function createMember(
  input: store.CreateMemberInput
): Promise<MemberDetail> {
  await sleep(260)
  return store.createMember(input)
}

export async function updateMember(
  memberId: string,
  patch: store.UpdateMemberInput
): Promise<MemberDetail> {
  await sleep(200)
  return store.updateMember(memberId, patch)
}

export async function deleteMember(memberId: string): Promise<void> {
  await sleep(180)
  store.deleteMember(memberId)
}
