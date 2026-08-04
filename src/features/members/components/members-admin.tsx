"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { MoreHorizontal, Pencil, Search, Trash2, UserPlus } from "lucide-react"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { DataTable, type Column } from "@/components/shared/data-table"
import { EmptyState } from "@/components/shared/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePlans } from "@/features/plans"
import { cn, initials, pluralize } from "@/lib/utils"
import type { MemberDetail, MemberStatus } from "@/types"

import { useDeleteMember, useMembers } from "../hooks/use-members"
import { MEMBER_STATUS_LABELS, MEMBER_STATUSES } from "../schema"
import { MemberDetailSheet } from "./member-detail-sheet"
import { MemberFormDialog } from "./member-form-dialog"
import { MemberStatusBadge } from "./member-status-badge"

const ALL = "all"

export function MembersAdmin() {
  const membersQuery = useMembers()
  const plansQuery = usePlans()
  const deleteMember = useDeleteMember()

  const [search, setSearch] = useState("")
  const [planFilter, setPlanFilter] = useState<string>(ALL)
  const [statusFilter, setStatusFilter] = useState<string>(ALL)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<MemberDetail | null>(null)
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<MemberDetail | null>(null)

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (membersQuery.data ?? [])
      .filter((member) => {
        const matchesTerm =
          term.length === 0 ||
          member.fullName.toLowerCase().includes(term) ||
          member.membershipNo.toLowerCase().includes(term) ||
          member.email.toLowerCase().includes(term)
        return (
          matchesTerm &&
          (planFilter === ALL || member.planId === planFilter) &&
          (statusFilter === ALL || member.status === (statusFilter as MemberStatus))
        )
      })
      .sort((a, b) => a.fullName.localeCompare(b.fullName))
  }, [membersQuery.data, search, planFilter, statusFilter])

  // Keep the open drawer in step with the latest data.
  const viewing = viewingId
    ? ((membersQuery.data ?? []).find((member) => member.id === viewingId) ?? null)
    : null

  const columns: Column<MemberDetail>[] = [
    {
      key: "member",
      header: "Member",
      cell: (member) => (
        <button
          type="button"
          onClick={() => setViewingId(member.id)}
          className="flex items-center gap-3 text-left"
        >
          <span className="flex size-8 shrink-0 items-center justify-center bg-steel-100 font-mono text-[0.625rem] text-steel-600">
            {initials(member.fullName)}
          </span>
          <span>
            <span className="block text-sm font-medium text-ink underline-offset-4 hover:underline">
              {member.fullName}
            </span>
            <span className="tnum font-mono text-[0.6875rem] text-steel-500">
              {member.membershipNo}
            </span>
          </span>
        </button>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      className: "hidden md:table-cell",
      cell: (member) => (
        <span className="text-sm text-steel-700">{member.plan.name}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (member) => <MemberStatusBadge status={member.status} />,
    },
    {
      key: "renews",
      header: "Renews",
      className: "hidden lg:table-cell",
      cell: (member) => (
        <span className="tnum font-mono text-xs text-steel-600">
          {member.renewsAt}
        </span>
      ),
    },
    {
      key: "bookings",
      header: "Booked",
      className: "hidden sm:table-cell w-[92px]",
      cell: (member) => (
        <span className="tnum font-mono text-xs text-steel-600">
          {member.upcomingBookings}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      srOnlyHeader: true,
      className: "w-[56px] text-right",
      cell: (member) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal />
              <span className="sr-only">Actions for {member.fullName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setViewingId(member.id)}>
              <Search /> Open profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setEditing(member)
                setFormOpen(true)
              }}
            >
              <Pencil /> Edit member
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setPendingDelete(member)}
            >
              <Trash2 /> Delete member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const isFiltered =
    search.trim().length > 0 || planFilter !== ALL || statusFilter !== ALL

  const clearFilters = () => {
    setSearch("")
    setPlanFilter(ALL)
    setStatusFilter(ALL)
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-5">
        <div>
          <p className="eyebrow text-steel-500">The club</p>
          <h1 className="display mt-3 text-display-md text-ink">Members</h1>
          <p className="mt-2 text-sm text-steel-600">
            {membersQuery.data?.length ?? 0} on the books. Sign-ups from the
            website land here.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <UserPlus /> Add member
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-steel-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, number or email"
            aria-label="Search members"
            className="pl-9"
          />
        </div>

        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Any plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any plan</SelectItem>
            {(plansQuery.data ?? []).map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Any status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Any status</SelectItem>
            {MEMBER_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {MEMBER_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltered ? (
          <Button variant="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : null}

        <Badge variant="outline" className={cn("ml-auto", isFiltered && "border-ink")}>
          {rows.length} {pluralize(rows.length, "member", "members")}
        </Badge>
      </div>

      <DataTable
        className="mt-4"
        caption="Every member in the club"
        columns={columns}
        rows={rows}
        getRowKey={(member) => member.id}
        isPending={membersQuery.isPending}
        empty={
          <EmptyState
            title={isFiltered ? "No members match" : "No members yet"}
            description={
              isFiltered
                ? "Nobody matches that search and filter combination. Clear them to see the whole club."
                : "Add the first member, or wait for a sign-up from the website."
            }
            action={
              isFiltered ? (
                <Button variant="outline" size="lg" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => {
                    setEditing(null)
                    setFormOpen(true)
                  }}
                >
                  <UserPlus /> Add member
                </Button>
              )
            }
          />
        }
      />

      <MemberFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
      />

      <MemberDetailSheet
        member={viewing}
        open={Boolean(viewing)}
        onOpenChange={(open) => {
          if (!open) setViewingId(null)
        }}
        onEdit={(member) => {
          setViewingId(null)
          setEditing(member)
          setFormOpen(true)
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
        title="Delete this member?"
        description={
          pendingDelete ? (
            <>
              {pendingDelete.fullName} ({pendingDelete.membershipNo}) is removed
              from the club along with {pendingDelete.upcomingBookings} booked{" "}
              {pluralize(pendingDelete.upcomingBookings, "class", "classes")}.
              Cancel the membership instead if they might come back.
            </>
          ) : null
        }
        confirmLabel="Delete member"
        isPending={deleteMember.isPending}
        onConfirm={() => {
          if (!pendingDelete) return
          deleteMember.mutate(pendingDelete.id, {
            onSuccess: () => {
              toast.success("Member deleted", {
                description: `${pendingDelete.fullName} is off the books.`,
              })
              setPendingDelete(null)
            },
            onError: (error) =>
              toast.error("That member wasn't deleted", {
                description: error.message,
              }),
          })
        }}
      />
    </div>
  )
}
