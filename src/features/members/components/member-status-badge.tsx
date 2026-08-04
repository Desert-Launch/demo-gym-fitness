import { cn } from "@/lib/utils"
import type { MemberStatus } from "@/types"

import { MEMBER_STATUS_LABELS } from "../schema"

const TONE: Record<MemberStatus, string> = {
  active: "border-status-active/40 text-status-active",
  frozen: "border-status-frozen/40 text-status-frozen",
  expired: "border-status-expired/40 text-status-expired",
  cancelled: "border-steel-300 text-status-cancelled",
}

const DOT: Record<MemberStatus, string> = {
  active: "bg-status-active",
  frozen: "bg-status-frozen",
  expired: "bg-status-expired",
  cancelled: "bg-status-cancelled",
}

/** Status reads as a word first, colour second — never colour alone. */
export function MemberStatusBadge({
  status,
  className,
}: {
  status: MemberStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-medium",
        TONE[status],
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", DOT[status])} aria-hidden />
      {MEMBER_STATUS_LABELS[status]}
    </span>
  )
}
