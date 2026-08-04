import type { Metadata } from "next"

import { ClassesAdmin } from "@/features/classes/components/classes-admin"

export const metadata: Metadata = {
  title: "Classes",
}

export default function AdminClassesPage() {
  return <ClassesAdmin />
}
