"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  header: string
  /** Applied to both the header cell and every body cell in the column. */
  className?: string
  cell: (row: T) => React.ReactNode
  srOnlyHeader?: boolean
}

/**
 * Thin wrapper over the shadcn table: columns in, rows out, with loading,
 * empty and animated enter/exit handled once instead of in every admin screen.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  isPending = false,
  skeletonRows = 8,
  empty,
  caption,
  className,
}: {
  columns: Column<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  isPending?: boolean
  skeletonRows?: number
  empty?: React.ReactNode
  caption?: string
  className?: string
}) {
  const reduceMotion = useReducedMotion()

  if (!isPending && rows.length === 0 && empty) {
    return <>{empty}</>
  }

  return (
    <div className={cn("overflow-x-auto border border-steel-200 bg-paper", className)}>
      <Table>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <TableHeader>
          <TableRow className="border-steel-200 hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(
                  "h-11 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-steel-500",
                  column.className
                )}
              >
                {column.srOnlyHeader ? (
                  <span className="sr-only">{column.header}</span>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            Array.from({ length: skeletonRows }).map((_, index) => (
              <TableRow key={index} className="border-steel-200">
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    <Skeleton className="h-4 w-full max-w-[140px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.tr
                  key={getRowKey(row)}
                  layout={reduceMotion ? false : "position"}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                  className="border-b border-steel-200 transition-colors last:border-b-0 hover:bg-chalk"
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn("py-3 align-middle", column.className)}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
