import * as store from "@/lib/store"
import { sleep } from "@/lib/store"
import type { GymClassDetail, Trainer } from "@/types"

export async function fetchTrainers(): Promise<Trainer[]> {
  await sleep(140)
  return store.listTrainers()
}

export async function fetchTrainerBySlug(slug: string): Promise<{
  trainer: Trainer
  classes: GymClassDetail[]
}> {
  await sleep(160)
  const trainer = store.getTrainerBySlug(slug)
  if (!trainer) throw new Error("That coach isn't on the team any more.")

  const classes = store
    .listClasses()
    .filter((gymClass) => gymClass.trainerId === trainer.id)
    .sort(
      (a, b) =>
        a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)
    )

  return { trainer, classes }
}
