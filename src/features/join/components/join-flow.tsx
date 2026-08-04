"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

import { WizardRail, WizardTransition } from "@/components/shared/wizard"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { useCreateMember } from "@/features/members"
import { usePlans } from "@/features/plans"
import { cn, formatAed, pluralize } from "@/lib/utils"
import type { MemberDetail, Plan } from "@/types"

import {
  GOAL_LABELS,
  START_PREFERENCE_LABELS,
  joinDetailsSchema,
  type JoinDetailsValues,
} from "../schema"
import { useJoinDraft } from "../store"

const STEPS = ["Plan", "Your details", "Confirmed"]

const PERIOD_LABEL: Record<Plan["billingPeriod"], string> = {
  day: "per day",
  month: "per month",
  quarter: "per quarter",
  year: "per year",
}

export function JoinFlow() {
  const searchParams = useSearchParams()
  const plansQuery = usePlans()
  const createMember = useCreateMember()

  const { planId, details, setPlanId, setDetails, clear } = useJoinDraft()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [joined, setJoined] = useState<MemberDetail | null>(null)

  const plans = useMemo(() => plansQuery.data ?? [], [plansQuery.data])
  const selectedPlan = plans.find((plan) => plan.id === planId) ?? null

  // A plan can arrive from /membership as ?plan=quarterly.
  const planSlug = searchParams.get("plan")
  useEffect(() => {
    if (!planSlug || plans.length === 0) return
    const match = plans.find((plan) => plan.slug === planSlug)
    if (match) setPlanId(match.id)
  }, [planSlug, plans, setPlanId])

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  return (
    <div className="container-forge grid gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
      <div className="lg:col-span-7">
        <WizardRail steps={STEPS} current={step} className="mb-10" />

        <WizardTransition stepKey={step} direction={direction}>
          {step === 0 ? (
            <PlanStep
              plans={plans}
              isPending={plansQuery.isPending}
              selectedId={planId}
              onSelect={setPlanId}
              onNext={() => goTo(1)}
            />
          ) : step === 1 ? (
            <DetailsStep
              plan={selectedPlan}
              defaults={details}
              isSaving={createMember.isPending}
              onBack={() => goTo(0)}
              onSubmit={async (values) => {
                if (!selectedPlan) {
                  toast.error("Pick a plan first")
                  goTo(0)
                  return
                }
                setDetails(values)
                try {
                  const member = await createMember.mutateAsync({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: values.phone,
                    planId: selectedPlan.id,
                    status: "active",
                    notes: `Goal: ${GOAL_LABELS[values.goal]}. Trains ${START_PREFERENCE_LABELS[
                      values.startPreference
                    ].toLowerCase()}. Joined online.`,
                  })
                  setJoined(member)
                  goTo(2)
                  toast.success("Welcome to the club", {
                    description: `Membership ${member.membershipNo} is active.`,
                  })
                } catch (error) {
                  toast.error("We couldn't finish that sign-up", {
                    description:
                      error instanceof Error
                        ? error.message
                        : "Try again in a moment.",
                  })
                }
              }}
            />
          ) : (
            <ConfirmationStep
              member={joined}
              onStartOver={() => {
                clear()
                setJoined(null)
                goTo(0)
              }}
            />
          )}
        </WizardTransition>
      </div>

      <aside className="lg:col-span-5">
        <OrderSummary plan={selectedPlan} step={step} />
      </aside>
    </div>
  )
}

// --- Step 1 -----------------------------------------------------------------

function PlanStep({
  plans,
  isPending,
  selectedId,
  onSelect,
  onNext,
}: {
  plans: Plan[]
  isPending: boolean
  selectedId: string | null
  onSelect: (planId: string) => void
  onNext: () => void
}) {
  const [touched, setTouched] = useState(false)

  if (isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <h2 className="display text-display-sm text-ink">Pick your plan</h2>
      <p className="mt-2 text-sm text-steel-600">
        Change it whenever your training changes — there&apos;s no joining fee
        either way.
      </p>

      <fieldset className="mt-6">
        <legend className="sr-only">Membership plans</legend>
        <div className="space-y-3">
          {plans.map((plan) => {
            const checked = plan.id === selectedId
            return (
              <label
                key={plan.id}
                className={cn(
                  "flex cursor-pointer items-start gap-4 border p-5 transition-colors",
                  checked
                    ? "border-2 border-ink bg-paper"
                    : "border-steel-200 bg-chalk hover:border-steel-400"
                )}
              >
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={checked}
                  onChange={() => onSelect(plan.id)}
                  className="mt-1 size-4 accent-[var(--scarlet-600)]"
                />
                <span className="flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="display text-base text-ink">
                      {plan.name}
                    </span>
                    <span className="tnum font-mono text-sm font-bold text-ink">
                      {formatAed(plan.priceAed)}{" "}
                      <span className="font-normal text-steel-500">
                        {PERIOD_LABEL[plan.billingPeriod]}
                      </span>
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-steel-600">
                    {plan.tagline}
                  </span>
                  <span className="mt-2 block font-mono text-[0.6875rem] text-steel-500">
                    {plan.monthlyClassCredits === null
                      ? "Unlimited classes"
                      : `${plan.monthlyClassCredits} ${pluralize(plan.monthlyClassCredits, "class", "classes")} a month`}
                  </span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      {touched && !selectedId ? (
        <p className="mt-4 text-xs font-medium text-destructive">
          Pick a plan to carry on.
        </p>
      ) : null}

      <Button
        size="lg"
        className="mt-8"
        onClick={() => {
          setTouched(true)
          if (selectedId) onNext()
        }}
      >
        Continue <ArrowRight />
      </Button>
    </div>
  )
}

// --- Step 2 -----------------------------------------------------------------

function DetailsStep({
  plan,
  defaults,
  isSaving,
  onBack,
  onSubmit,
}: {
  plan: Plan | null
  defaults: Partial<JoinDetailsValues>
  isSaving: boolean
  onBack: () => void
  onSubmit: (values: JoinDetailsValues) => Promise<void>
}) {
  const form = useForm<JoinDetailsValues>({
    resolver: zodResolver(joinDetailsSchema),
    defaultValues: {
      firstName: defaults.firstName ?? "",
      lastName: defaults.lastName ?? "",
      email: defaults.email ?? "",
      phone: defaults.phone ?? "",
      goal: defaults.goal ?? "strength",
      startPreference: defaults.startPreference ?? "mornings",
      agreesToTerms: defaults.agreesToTerms ?? false,
    },
  })

  return (
    <div>
      <h2 className="display text-display-sm text-ink">Your details</h2>
      <p className="mt-2 text-sm text-steel-600">
        {plan
          ? `Signing up to ${plan.name}. `
          : "Pick a plan on the previous step. "}
        We only ask for what the front desk needs.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-6 grid gap-6 sm:grid-cols-2"
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
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What are you training for?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(GOAL_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Your coach uses this to write your first block.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startPreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>When do you train?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(START_PREFERENCE_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreesToTerms"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <div className="flex items-start gap-3 border border-steel-200 bg-paper p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="grid gap-1">
                    <FormLabel className="normal-case tracking-normal text-sm text-ink">
                      I accept the club rules
                    </FormLabel>
                    <FormDescription>
                      Cancel classes at least four hours ahead, re-rack your
                      plates, wipe the bench.
                    </FormDescription>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <Button type="submit" size="lg" disabled={isSaving}>
              {isSaving ? "Setting you up…" : "Join the club"}
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
  member,
  onStartOver,
}: {
  member: MemberDetail | null
  onStartOver: () => void
}) {
  if (!member) {
    return (
      <div>
        <h2 className="display text-display-sm text-ink">
          That sign-up didn&apos;t save
        </h2>
        <p className="mt-3 text-steel-600">
          Start again and we&apos;ll get you on the floor.
        </p>
        <Button size="lg" className="mt-6" onClick={onStartOver}>
          Start again
        </Button>
      </div>
    )
  }

  return (
    <div>
      <span className="inline-flex size-12 items-center justify-center bg-brand text-white">
        <Check className="size-6" />
      </span>
      <h2 className="display mt-6 text-display-md text-ink">
        You&apos;re in, {member.firstName}
      </h2>
      <p className="mt-3 max-w-[46ch] text-lead text-steel-600">
        Your membership is active from today. Bring trainers and a water bottle —
        we&apos;ll sort the rest at the desk.
      </p>

      <dl className="mt-8 grid gap-px border border-steel-200 bg-steel-200 sm:grid-cols-3">
        <div className="bg-chalk p-5">
          <dt className="eyebrow text-steel-500">Membership no.</dt>
          <dd className="tnum mt-2 font-mono text-xl font-bold text-ink">
            {member.membershipNo}
          </dd>
        </div>
        <div className="bg-chalk p-5">
          <dt className="eyebrow text-steel-500">Plan</dt>
          <dd className="mt-2 text-sm text-steel-700">{member.plan.name}</dd>
        </div>
        <div className="bg-chalk p-5">
          <dt className="eyebrow text-steel-500">Renews</dt>
          <dd className="tnum mt-2 font-mono text-sm text-steel-700">
            {member.renewsAt}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link href="/classes">
            Book your first class <ArrowRight />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/admin/members">See yourself in the admin</Link>
        </Button>
      </div>

      <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500">
        Demo build — no payment was taken and no email was sent.
      </p>
    </div>
  )
}

// --- Summary rail -----------------------------------------------------------

function OrderSummary({ plan, step }: { plan: Plan | null; step: number }) {
  return (
    <div className="sticky top-24 border-2 border-ink">
      <div className="hatch-brand h-24" aria-hidden />
      <div className="p-6">
        <h2 className="eyebrow text-steel-500">Your membership</h2>

        {plan ? (
          <>
            <p className="display mt-4 text-display-sm text-ink">{plan.name}</p>
            <p className="tnum mt-2 font-mono text-2xl font-bold text-ink">
              {formatAed(plan.priceAed)}
              <span className="ml-2 text-xs font-normal text-steel-500">
                {PERIOD_LABEL[plan.billingPeriod]}
              </span>
            </p>
            <ul className="mt-6 space-y-2 border-t border-steel-200 pt-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-steel-600">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  {feature}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-4 text-sm text-steel-600">
            Nothing picked yet. Choose a plan and it shows up here with what it
            includes.
          </p>
        )}

        <p className="mt-6 border-t border-steel-200 pt-4 text-xs text-steel-500">
          {step === 2
            ? "Membership active. Your first class is bookable now."
            : "No payment is taken in this demo — the sign-up writes a member into the in-memory store."}
        </p>
      </div>
    </div>
  )
}
