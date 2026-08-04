import type { Metadata } from "next"

import { MembersAdmin } from "@/features/members/components/members-admin"

export const metadata: Metadata = {
  title: "Members",
}

export default function AdminMembersPage() {
  return <MembersAdmin />
}
