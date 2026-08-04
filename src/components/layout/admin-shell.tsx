"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import {
  CalendarDays,
  ChevronDown,
  ExternalLink,
  LayoutDashboard,
  Menu,
  RotateCcw,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SkipLink } from "@/components/layout/skip-link"
import { useResetDemoData } from "@/features/dashboard"
import { STAFF, useStaffSession } from "@/features/staff/store"
import { cn, initials } from "@/lib/utils"

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/members", label: "Members", icon: Users, exact: false },
  { href: "/admin/classes", label: "Classes", icon: CalendarDays, exact: false },
] as const

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-dvh bg-chalk">
      <SkipLink />
      <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col border-r border-steel-800 bg-sidebar lg:flex">
        <SidebarContent />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-steel-200 bg-chalk/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <Menu />
                  <span className="sr-only">Open admin menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[248px] border-steel-800 bg-sidebar p-0"
              >
                <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <p className="eyebrow text-steel-500">Staff view</p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-steel-500">
              <Link href="/">
                Public site <ExternalLink />
              </Link>
            </Button>
            <StaffSwitcher />
          </div>
        </header>

        <main id="main" className="flex-1 px-4 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const resetDemoData = useResetDemoData()

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-steel-800 px-5 py-5">
        <Link
          href="/admin"
          className="inline-flex items-baseline gap-2"
          onClick={onNavigate}
        >
          <span className="display text-lg leading-none text-steel-25">Forge</span>
          <span aria-hidden className="h-[3px] w-5 bg-brand-bright" />
        </Link>
        <p className="eyebrow mt-3 text-steel-400">Club admin</p>
      </div>

      <nav aria-label="Admin" className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {NAV.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-steel-800 text-steel-0"
                      : "text-steel-400 hover:bg-steel-800/60 hover:text-steel-100"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                  {active ? (
                    <span aria-hidden className="ml-auto h-4 w-[2px] bg-brand-bright" />
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-steel-800 p-4">
        <p className="text-xs leading-relaxed text-steel-400">
          Demo data lives in memory. Resetting rebuilds the club from seed.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full border-steel-700 bg-transparent text-steel-300 hover:bg-steel-800 hover:text-steel-0"
          disabled={resetDemoData.isPending}
          onClick={() => {
            resetDemoData.mutate(undefined, {
              onSuccess: () =>
                toast.success("Demo data reset", {
                  description: "Members, classes and bookings are back to seed.",
                }),
            })
          }}
        >
          <RotateCcw />
          {resetDemoData.isPending ? "Resetting…" : "Reset demo data"}
        </Button>
      </div>
    </div>
  )
}

function StaffSwitcher() {
  const { current, signInAs } = useStaffSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className="flex size-6 items-center justify-center bg-ink font-mono text-[0.625rem] text-steel-25">
            {initials(current.name)}
          </span>
          <span className="hidden sm:inline">{current.name}</span>
          <ChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {STAFF.map((member) => (
          <DropdownMenuItem
            key={member.id}
            onSelect={() => signInAs(member.id)}
            className={cn(member.id === current.id && "bg-muted")}
          >
            <span className="flex flex-col">
              <span className="text-sm">{member.name}</span>
              <span className="text-xs text-steel-500">{member.role}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
