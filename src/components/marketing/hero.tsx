"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { NextSessions } from "@/features/classes/components/next-sessions"
import { Button } from "@/components/ui/button"
import { VENUE } from "@/lib/club"

export function Hero() {
  const reduceMotion = useReducedMotion()

  // One reveal on load, staggered down the column. Nothing else on the page moves.
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.08, delayChildren: 0.05 },
    },
  }
  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  return (
    <section className="border-b border-steel-200">
      <div className="container-forge">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24"
        >
          <div className="lg:col-span-7">
            <motion.p variants={item} className="eyebrow flex items-center gap-3 text-steel-500">
              <span className="h-[2px] w-8 bg-brand-bright" aria-hidden />
              {VENUE.area} · Est. 2019
            </motion.p>

            <motion.h1
              variants={item}
              className="display mt-6 text-display-xl text-ink"
            >
              The work is simple.
              <br />
              The coaching
              <span className="text-brand"> isn&apos;t.</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-8 max-w-[46ch] text-lead text-steel-600"
            >
              A strength and conditioning club in Dubai. Sixty coached
              sessions a week, twelve people to a class, and coaches who know
              your name and your numbers.
            </motion.p>

            <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/join">
                  Join now <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/classes">See the timetable</Link>
              </Button>
            </motion.div>

            <motion.p
              variants={item}
              className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-steel-500"
            >
              No joining fee · Freeze any time · Day passes welcome
            </motion.p>
          </div>

          <motion.div variants={item} className="lg:col-span-5">
            <NextSessions />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
