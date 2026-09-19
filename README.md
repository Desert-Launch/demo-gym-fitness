# Demo Gym — gym & fitness demo

A frontend-only marketing, membership and class-booking site for a fictional
strength and conditioning club in Dubai. Everything works — joining a
plan, booking a class, running the club from the admin — but there is no
backend, no database and no auth. All data lives in memory for the life of the
browser tab.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`,
`npm run typecheck`. Both `lint` and `typecheck` pass clean.

## What to show in a demo

1. **`/classes`** — the weekly timetable. A real day × time grid with live
   spots-left on every session, filters by class type and coach, and a
   day-at-a-time view on mobile. This is the signature screen.
2. **Book a class** — click any session. Full sessions offer a waitlist place
   instead of a spot. The booking writes to the store, so the timetable and the
   admin both show it immediately.
3. **`/join`** — pick a plan, fill in details, get a membership number. The new
   member appears in `/admin/members` with their goal and preferred training
   time in their notes.
4. **`/admin`** — staff view. Stats, an eight-week joins chart and today's
   schedule with fill rates. Full CRUD on members and classes.
5. **Optimistic rollback** — open a class in `/admin/classes` → *See bookings* →
   cancel a spot. The row updates before the call returns, and roughly one call
   in ten fails on purpose so you can watch it snap back with an error toast.
6. **Reset demo data** — bottom of the admin sidebar. Re-seeds the club.

## Where the data lives

`src/lib/store/` is the entire backend:

- `seed.ts` — deterministic seed data: 4 plans, 8 coaches, 6 class types, a
  33-session weekly schedule, 40 members and ~400 bookings. A fixed PRNG means
  the club looks the same on every load, so demos are repeatable.
- `db.ts` — the module-level tables plus derivation. Capacity and spots-left are
  **always counted from bookings**, never stored on the class, so the two can't
  drift apart.
- `index.ts` — the public surface: typed CRUD for members, classes and bookings,
  read-only plans and coaches, `resetStore()` and `sleep()`.

Data resets on a hard refresh and persists across in-app navigation, which is
what the demo needs. Nothing is written to `localStorage`, and no request leaves
the page.

Seed volume differs from the original brief in one place: the brief asked for
~60 bookings, which leaves a 33-session timetable about 12% full and makes both
the spots-left meter and the full-class waitlist impossible to demo. It seeds
~400 instead, which is what 1,240 members actually looks like. The comment in
`seed.ts` records the reason.

## Architecture

The rule is one direction: **`app/` → `features/` → `lib/store/`**.

```
src/
  app/         routes only — thin pages that render a feature component
  features/    one folder per domain (classes, members, bookings, plans,
               trainers, dashboard, join, contact, staff). Each holds its
               components/, hooks/, api.ts, schema.ts and an index.ts barrel
  components/  ui/ (shadcn primitives), layout/ (shells), shared/ (DataTable,
               StatCard, EmptyState, ConfirmDialog, Wizard)
  lib/         store/ (the in-memory backend), utils, week helpers, query client
  styles/      tokens.css — every design value as a CSS variable
  types/       cross-feature entity types
```

No UI component touches the store. It goes component → feature hook (TanStack
Query) → `api.ts` (async, latency-padded) → store. `features/` never imports
from `app/`, cross-feature imports go through the barrel, and there is no `any`
or `@ts-ignore` in the codebase. Every `api.ts` call awaits a small `sleep()`,
so loading skeletons, pending buttons and optimistic updates are states you can
actually see rather than dead code.

Mutations invalidate queries across feature boundaries through exported query
keys — cancelling a booking invalidates classes, members and the dashboard —
which is why a change in the admin shows up on the public timetable without a
refresh.

## Design

An industrial poster: chalk paper, graphite ink, one scarlet signal colour and
an ice accent held back for capacity and chart data. Square corners, heavy
rules, Archivo Black display type over Archivo body text, and JetBrains Mono for
every number that matters. All values live in `src/styles/tokens.css` and reach
components through the Tailwind theme — no hardcoded hex in any component.

Accessibility: axe reports zero WCAG 2.1 AA violations across all ten routes and
the dialog, sheet and mobile states. Skip links, visible focus rings, semantic
tables for the timetable and the plan comparison, and `prefers-reduced-motion`
respected everywhere — motion is limited to the hero reveal, wizard step
transitions and admin row enter/exit.

## Not real

Fictional club, fictional coaches and members, no photography of anyone —
hatched panels stand in for images by design. Prices are plausible AED figures,
not a real price list. Nothing is emailed, charged or stored: the contact form,
the join flow and the booking flow all stop at the in-memory store.
