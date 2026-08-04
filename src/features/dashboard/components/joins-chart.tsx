"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Skeleton } from "@/components/ui/skeleton"
import { pluralize } from "@/lib/utils"

/** New members a week over the last eight weeks. Colours come from tokens. */
export function JoinsChart({
  data,
  isPending,
}: {
  data: { week: string; joins: number }[]
  isPending: boolean
}) {
  if (isPending) return <Skeleton className="h-[240px] w-full" />

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid
            vertical={false}
            stroke="var(--steel-200)"
            strokeDasharray="2 4"
          />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={{ stroke: "var(--steel-300)" }}
            tick={{ fill: "var(--steel-500)", fontSize: 11 }}
            dy={4}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--steel-400)", fontSize: 11 }}
            width={40}
          />
          <Tooltip
            cursor={{ fill: "var(--steel-100)" }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const joins = Number(payload[0]?.value ?? 0)
              return (
                <div className="border border-ink bg-popover px-3 py-2 shadow-overlay">
                  <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-steel-500">
                    Week of {label}
                  </p>
                  <p className="tnum mt-1 font-mono text-sm font-bold text-ink">
                    {joins} new {pluralize(joins, "member", "members")}
                  </p>
                </div>
              )
            }}
          />
          <Bar dataKey="joins" fill="var(--chart-1)" maxBarSize={38} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
