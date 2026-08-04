"use client"

import Link from "next/link"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Clock, MapPin, User } from "lucide-react"

import { WizardRail, WizardTransition } from "@/components/shared/wizard"
import { Button } from "@/components/ui/button"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CapacityMeter } from "@/features/classes/components/capacity-meter"
import { useClass } from "@/features/classes"
import { useMembers } from "@/features/members"
import { formatClock, formatDuration } from "@/lib/utils"
import { dayLabel, formatDayDate } from "@/lib/week"
import type { ClassBooking, GymClassDetail } from "@/types"

import { useCreateBooking } from "../hooks/use-bookings"
import { bookingIdentitySchema, type BookingIdentity } from "../schema"

const STEPS = ["Session", "Who's booking", "Confirmed"]

export function BookingFlow({ classId }: { classId: string }) {
  const classQuery = useClass(classId)
  const createBooking = useCreateBooking()

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [booking, setBooking] = useState<ClassBooking | null>(null)

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  if (classQuery.isPending) {
    return (
      <div className="container-forge grid gap-12 py-12 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-72 lg:col-span-5" />
      </div>
    )
  }

  if (classQuery.isError) {
    return (
      <div className="container-forge py-24 text-center">
        <AlertTriangle className="mx-auto size-7 text-brand" />
        <h1 className="display mt-5 text-display-md">
          That session isn&apos;t on the schedule
        </h1>
        <p className="mt-3 text-steel-600">{classQuery.error.message}</p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/classes">
            <ArrowLeft /> Back to the timetable
          </Link>
        </Button>
      </div>
    )
  }

  const session = classQuery.data

  return (
    <div className="container-forge grid gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
      <div className="lg:col-span-7">
        <WizardRail steps={STEPS} current={step} className="mb-10" />

        <WizardTransition stepKey={step} direction={direction}>
          {step === 0 ? (
            <SessionStep session={session} onNext={() => goTo(1)} />
          ) : step === 1 ? (
            <IdentityStep
              session={session}
              isSaving={createBooking.isPending}
              onBack={() => goTo(0)}
              onSubmit={async (identity) => {
                try {
                  const result = await createBooking.mutateAsync({
                    classId: session.id,
                    memberId:
                      identity.kind === "member" ? identity.memberId : null,
                    guestName:
                      identity.kind === "guest" ? identity.guestName : null,
                    source: "web",
                  })
                  setBooking(result)
                  goTo(2)
                  toast.success(
                    result.status === "waitlisted"
                      ? "Added to the waitlist"
                      : "Spot booked",
                    {
                      description: `${session.type.name}, ${dayLabel(session.dayOfWeek)} at ${formatClock(session.startTime)}.`,
                    }
                  )
                } catch (error) {
                  toast.error("That booking didn't go through", {
                    description:
                      error instanceof Error
                        ? error.message
                        : "Try again in a moment.",
                  })
                }
              }}
            />
          ) : (
            <ConfirmationStep session={session} booking={booking} />
          )}
        </WizardTransition>
      </div>

      <aside className="lg:col-span-5">
        <SessionSummary session={session} />
      </aside>
    </div>
  )
}

// --- Step 1 -----------------------------------------------------------------

function SessionStep({
  session,
  onNext,
}: {
  session: GymClassDetail
  onNext: () => void
}) {
  return (
    <div>
      <h2 className="display text-display-sm text-ink">
        {session.isFull ? "This session is full" : "Check the session"}
      </h2>
      <p className="mt-2 max-w-[52ch] text-sm text-steel-600">
        {session.isFull
          ? "Take a waitlist spot and we'll text you the moment someone cancels. Waitlist places move up in the order they were taken."
          : "Sessions are capped, so booking holds your spot. Cancel at least four hours ahead and it goes back to the club."}
      </p>

      <div className="mt-6 border border-steel-200 bg-paper p-6">
        <p className="eyebrow text-steel-500">{session.type.name}</p>
        <p className="display mt-3 text-display-sm text-ink">
          {dayLabel(session.dayOfWeek)}, {formatClock(session.startTime)}
        </p>
        <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-steel-600">
          {session.type.description}
        </p>
        <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-500">
          Bring: {session.type.equipment.toLowerCase()} are provided
        </p>
      </div>

      <Button size="lg" className="mt-8" onClick={onNext}>
        {session.isFull ? "Join the waitlist" : "Book this class"}
        <ArrowRight />
      </Button>
    </div>
  )
}

// --- Step 2 -----------------------------------------------------------------

function IdentityStep({
  session,
  isSaving,
  onBack,
  onSubmit,
}: {
  session: GymClassDetail
  isSaving: boolean
  onBack: () => void
  onSubmit: (identity: BookingIdentity) => Promise<void>
}) {
  const membersQuery = useMembers()
  const form = useForm<BookingIdentity>({
    resolver: zodResolver(bookingIdentitySchema),
    defaultValues: { kind: "member", memberId: "" },
  })

  const kind = form.watch("kind")

  const bookable = (membersQuery.data ?? [])
    .filter((member) => member.status === "active" || member.status === "frozen")
    .sort((a, b) => a.fullName.localeCompare(b.fullName))

  return (
    <div>
      <h2 className="display text-display-sm text-ink">Who&apos;s taking the spot?</h2>
      <p className="mt-2 max-w-[52ch] text-sm text-steel-600">
        Members book against their membership. Anyone else books as a guest and
        pays a day rate at the desk.
      </p>

      <Tabs
        value={kind}
        onValueChange={(value) =>
          form.reset(
            value === "member"
              ? { kind: "member", memberId: "" }
              : {
                  kind: "guest",
                  guestName: "",
                  guestEmail: "",
                  guestPhone: "",
                }
          )
        }
        className="mt-6"
      >
        <TabsList className="h-auto gap-0 rounded-none border border-steel-300 bg-transparent p-0">
          <TabsTrigger
            value="member"
            className="rounded-none border-r border-steel-300 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.08em] data-[state=active]:bg-ink data-[state=active]:text-steel-25 data-[state=active]:shadow-none"
          >
            I&apos;m a member
          </TabsTrigger>
          <TabsTrigger
            value="guest"
            className="rounded-none px-4 py-2.5 text-xs font-medium uppercase tracking-[0.08em] data-[state=active]:bg-ink data-[state=active]:text-steel-25 data-[state=active]:shadow-none"
          >
            First time here
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-6" noValidate>
          {kind === "member" ? (
            <FormField
              control={form.control}
              name="memberId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={membersQuery.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full sm:max-w-sm">
                        <SelectValue
                          placeholder={
                            membersQuery.isPending
                              ? "Loading members…"
                              : "Find your name"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-72">
                      {bookable.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.fullName} · {member.membershipNo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Demo shortcut: pick any member from the club list.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="guestName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guestEmail"
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
                name="guestPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+971 50 123 4567"
                        autoComplete="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={isSaving}>
              {isSaving
                ? "Holding your spot…"
                : session.isFull
                  ? "Join the waitlist"
                  : "Confirm booking"}
              {isSaving ? null : <ArrowRight />}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={onBack}
              disabled={isSaving}
            >
              <ArrowLeft /> Back
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

// --- Step 3 -----------------------------------------------------------------

function ConfirmationStep({
  session,
  booking,
}: {
  session: GymClassDetail
  booking: ClassBooking | null
}) {
  const waitlisted = booking?.status === "waitlisted"

  return (
    <div>
      <span className="inline-flex size-12 items-center justify-center bg-brand text-white">
        <Check className="size-6" />
      </span>
      <h2 className="display mt-6 text-display-md text-ink">
        {waitlisted ? "You're on the waitlist" : "Spot booked"}
      </h2>
      <p className="mt-3 max-w-[48ch] text-lead text-steel-600">
        {waitlisted
          ? "We'll text you the moment a spot opens. You keep your place in the queue until the class starts."
          : "See you on the floor. Arrive ten minutes early if it's your first time in this room."}
      </p>

      <dl className="mt-8 grid gap-px border border-steel-200 bg-steel-200 sm:grid-cols-3">
        <div className="bg-chalk p-5">
          <dt className="eyebrow text-steel-500">Session</dt>
          <dd className="mt-2 text-sm text-steel-700">{session.type.name}</dd>
        </div>
        <div className="bg-chalk p-5">
          <dt className="eyebrow text-steel-500">When</dt>
          <dd className="tnum mt-2 font-mono text-sm text-steel-700">
            {dayLabel(session.dayOfWeek, "short")} {formatClock(session.startTime)}
          </dd>
        </div>
        <div className="bg-chalk p-5">
          <dt className="eyebrow text-steel-500">Where</dt>
          <dd className="mt-2 text-sm text-steel-700">{session.studio}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/classes">
            Book another session <ArrowRight />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/admin/classes">See it in the admin</Link>
        </Button>
      </div>

      <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
        Demo build — the booking is written to the in-memory store, not sent anywhere.
      </p>
    </div>
  )
}

// --- Summary rail -----------------------------------------------------------

function SessionSummary({ session }: { session: GymClassDetail }) {
  return (
    <div className="sticky top-24 border-2 border-ink">
      <div className={session.isFull ? "hatch h-24" : "hatch-brand h-24"} aria-hidden />
      <div className="p-6">
        <p className="eyebrow text-steel-500">Your session</p>
        <h2 className="display mt-4 text-display-sm text-ink">
          {session.type.name}
        </h2>

        <ul className="mt-6 space-y-4 border-t border-steel-200 pt-6 text-sm">
          <li className="flex items-start gap-3">
            <Clock className="mt-0.5 size-4 shrink-0 text-steel-500" />
            <span className="text-steel-700">
              {dayLabel(session.dayOfWeek)} {formatDayDate(session.dayOfWeek)} ·{" "}
              {formatClock(session.startTime)}
              <span className="block text-xs text-steel-500">
                {formatDuration(session.durationMinutes)}
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <User className="mt-0.5 size-4 shrink-0 text-steel-500" />
            <span className="text-steel-700">
              {session.trainer.name}
              <span className="block text-xs text-steel-500">
                {session.trainer.headline}
              </span>
            </span>
          </li>
          <li className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-steel-500" />
            <span className="text-steel-700">{session.studio}</span>
          </li>
        </ul>

        <div className="mt-6 border-t border-steel-200 pt-6">
          <div className="flex items-baseline justify-between">
            <span className="eyebrow text-steel-500">Capacity</span>
            <span className="tnum font-mono text-xs text-steel-600">
              {session.bookedCount}/{session.capacity}
            </span>
          </div>
          <CapacityMeter
            className="mt-3"
            bookedCount={session.bookedCount}
            capacity={session.capacity}
            spotsLeft={session.spotsLeft}
          />
          {session.waitlistCount > 0 ? (
            <p className="mt-3 text-xs text-steel-500">
              {session.waitlistCount} waiting for a spot.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
