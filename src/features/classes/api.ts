import * as store from "@/lib/store"
import { sleep } from "@/lib/store"
import type { ClassType, GymClassDetail } from "@/types"

/**
 * Async wrapper over the in-memory store. Everything here is awaited and
 * latency-padded so the UI exercises the same loading and error paths it would
 * against a real API.
 */

export async function fetchClasses(): Promise<GymClassDetail[]> {
  await sleep(160)
  return store.listClasses()
}

export async function fetchClass(classId: string): Promise<GymClassDetail> {
  await sleep(120)
  const gymClass = store.getClass(classId)
  if (!gymClass) throw new Error("That class is no longer on the schedule.")
  return gymClass
}

export async function fetchClassTypes(): Promise<ClassType[]> {
  await sleep(80)
  return store.listClassTypes()
}

export async function createClass(
  input: store.CreateClassInput
): Promise<GymClassDetail> {
  await sleep(220)
  return store.createClass(input)
}

export async function updateClass(
  classId: string,
  patch: store.UpdateClassInput
): Promise<GymClassDetail> {
  await sleep(200)
  return store.updateClass(classId, patch)
}

export async function deleteClass(classId: string): Promise<void> {
  await sleep(180)
  store.deleteClass(classId)
}
