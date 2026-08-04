"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

/** Numbered rail across the top of a flow. Sentence-case labels, mono numbers. */
export function WizardRail({
  steps,
  current,
  className,
}: {
  steps: string[]
  current: number
  className?: string
}) {
  return (
    <ol className={cn("flex flex-wrap gap-px border border-steel-200 bg-steel-200", className)}>
      {steps.map((label, index) => {
        const state =
          index < current ? "done" : index === current ? "current" : "upcoming"
        return (
          <li
            key={label}
            aria-current={state === "current" ? "step" : undefined}
            className={cn(
              "flex flex-1 items-center gap-3 px-4 py-3",
              state === "current" ? "bg-ink text-steel-25" : "bg-chalk"
            )}
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center font-mono text-[0.6875rem]",
                state === "done"
                  ? "bg-brand text-white"
                  : state === "current"
                    ? "bg-steel-25 text-ink"
                    : "border border-steel-300 text-steel-500"
              )}
            >
              {state === "done" ? (
                <Check className="size-3.5" />
              ) : (
                String(index + 1).padStart(2, "0")
              )}
            </span>
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-[0.1em]",
                state === "upcoming" && "text-steel-500"
              )}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/**
 * Step transition. Slides in the direction of travel so going back feels like
 * going back — and does nothing at all when the OS asks for reduced motion.
 */
export function WizardTransition({
  stepKey,
  direction,
  children,
}: {
  stepKey: string | number
  direction: 1 | -1
  children: React.ReactNode
}) {
  const reduceMotion = useReducedMotion()
  const offset = reduceMotion ? 0 : 28 * direction

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: offset }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -offset }}
        transition={{
          duration: reduceMotion ? 0 : 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
