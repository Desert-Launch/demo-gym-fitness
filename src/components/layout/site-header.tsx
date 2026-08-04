"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu } from "lucide-react"

import { Logo } from "@/components/layout/logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/classes", label: "Timetable" },
  { href: "/membership", label: "Membership" },
  { href: "/trainers", label: "Coaches" },
  { href: "/about", label: "The club" },
  { href: "/contact", label: "Contact" },
] as const

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 border-b border-steel-200 bg-chalk/90 backdrop-blur supports-[backdrop-filter]:bg-chalk/75">
      <div className="container-forge flex h-16 items-center justify-between gap-6 md:h-20">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "relative inline-flex h-10 items-center px-3 text-sm font-medium text-steel-600 transition-colors hover:text-ink",
                    isActive(item.href) && "text-ink"
                  )}
                >
                  {item.label}
                  {isActive(item.href) ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-3 bottom-1.5 h-[2px] bg-brand-bright"
                    />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden text-steel-500 md:inline-flex"
          >
            <Link href="/admin">Staff view</Link>
          </Button>
          <Button asChild size="lg" className="hidden sm:inline-flex">
            <Link href="/join">Join now</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-chalk">
              <SheetHeader className="border-b border-steel-200">
                <SheetTitle className="text-left">
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobile" className="px-4 py-2">
                <ul className="flex flex-col">
                  {NAV.map((item) => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "display flex items-center justify-between border-b border-steel-200 py-4 text-display-sm text-ink",
                            isActive(item.href) && "text-brand"
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                  <li>
                    <SheetClose asChild>
                      <Link
                        href="/admin"
                        className="eyebrow flex items-center py-4 text-steel-500"
                      >
                        Staff view
                      </Link>
                    </SheetClose>
                  </li>
                </ul>
              </nav>
              <div className="px-4">
                <SheetClose asChild>
                  <Button asChild size="lg" className="w-full">
                    <Link href="/join">Join now</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
