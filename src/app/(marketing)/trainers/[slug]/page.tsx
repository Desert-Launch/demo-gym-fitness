import { TrainerProfile } from "@/features/trainers/components/trainer-profile"

export default async function TrainerPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <TrainerProfile slug={slug} />
}
