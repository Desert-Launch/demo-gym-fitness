"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { usePlans } from "@/features/plans"
import { formatAed } from "@/lib/utils"
import type { MemberDetail } from "@/types"

import { useCreateMember, useUpdateMember } from "../hooks/use-members"
import {
  MEMBER_STATUS_LABELS,
  MEMBER_STATUSES,
  memberFormSchema,
  type MemberFormValues,
} from "../schema"

export function MemberFormDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: MemberDetail | null
}) {
  const plansQuery = usePlans()
  const createMember = useCreateMember()
  const updateMember = useUpdateMember()

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      planId: "",
      status: "active",
      notes: "",
    },
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      editing
        ? {
            firstName: editing.firstName,
            lastName: editing.lastName,
            email: editing.email,
            phone: editing.phone,
            planId: editing.planId,
            status: editing.status,
            notes: editing.notes,
          }
        : {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            planId: plansQuery.data?.[1]?.id ?? "",
            status: "active",
            notes: "",
          }
    )
  }, [open, editing, form, plansQuery.data])

  const isSaving = createMember.isPending || updateMember.isPending

  async function onSubmit(values: MemberFormValues) {
    try {
      if (editing) {
        await updateMember.mutateAsync({ memberId: editing.id, patch: values })
        toast.success("Member updated", {
          description: `${values.firstName} ${values.lastName} is saved.`,
        })
      } else {
        const member = await createMember.mutateAsync(values)
        toast.success("Member added", {
          description: `${member.fullName} is on ${member.membershipNo}.`,
        })
      }
      onOpenChange(false)
    } catch (error) {
      toast.error(editing ? "That change didn't save" : "That member wasn't added", {
        description:
          error instanceof Error ? error.message : "Try again in a moment.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="display text-display-sm">
            {editing ? "Edit member" : "Add a member"}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? `Membership ${editing.membershipNo}, joined ${editing.joinedAt}.`
              : "Front-desk sign-up. The membership number is issued automatically."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="member-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-5 sm:grid-cols-2"
            noValidate
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input autoComplete="given-name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input autoComplete="family-name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" autoComplete="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="planId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plan</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pick a plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(plansQuery.data ?? []).map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} · {formatAed(plan.priceAed)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {editing ? (
                    <FormDescription>
                      Changing the plan restarts the renewal date from today.
                    </FormDescription>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MEMBER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {MEMBER_STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Injuries to work around, goals, anything the coaches should know."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" form="member-form" disabled={isSaving}>
            {isSaving ? "Saving…" : editing ? "Save changes" : "Add member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
