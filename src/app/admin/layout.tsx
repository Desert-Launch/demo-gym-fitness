import type { Metadata } from "next"

import { AdminShell } from "@/components/layout/admin-shell"

export const metadata: Metadata = {
  title: {
    default: "Club admin",
    template: "%s · Demo Gym admin",
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminShell>{children}</AdminShell>
}
