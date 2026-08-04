import * as store from "@/lib/store"
import { sleep } from "@/lib/store"
import type { Plan } from "@/types"

export async function fetchPlans(): Promise<Plan[]> {
  await sleep(120)
  return store.listPlans()
}

export async function fetchPlanBySlug(slug: string): Promise<Plan> {
  await sleep(100)
  const plan = store.getPlanBySlug(slug)
  if (!plan) throw new Error("We don't offer that plan any more.")
  return plan
}
