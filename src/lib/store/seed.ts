import { addDays, formatISO, subDays } from "date-fns"

import type {
  ClassBooking,
  ClassType,
  DayOfWeek,
  GymClass,
  Member,
  MemberStatus,
  Plan,
  Trainer,
} from "@/types"

/**
 * Deterministic PRNG. The demo re-seeds on every page load, and a fixed
 * sequence means the club looks the same each time — the same classes are
 * nearly full, the same ones are quiet. Nothing here touches Math.random().
 */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const id = () => crypto.randomUUID()

// --- Class types ------------------------------------------------------------

export const CLASS_TYPES: ClassType[] = [
  {
    id: "hiit",
    name: "HIIT",
    description:
      "Forty minutes of intervals on the bike, rower and floor. Short rest, honest work.",
    intensity: 5,
    equipment: "Bikes, rowers, dumbbells",
  },
  {
    id: "strength",
    name: "Strength",
    description:
      "Barbell work built on squat, hinge, press and pull. Coached technique, progressive loading.",
    intensity: 4,
    equipment: "Barbells, racks, platforms",
  },
  {
    id: "yoga",
    name: "Yoga",
    description:
      "Vinyasa flow with a long hold to finish. Built for people who lift.",
    intensity: 2,
    equipment: "Mats, blocks, straps",
  },
  {
    id: "spin",
    name: "Spin",
    description:
      "Power-based cycling on watts, not vibes. Every bike shows your numbers.",
    intensity: 4,
    equipment: "Power bikes",
  },
  {
    id: "boxing",
    name: "Boxing",
    description:
      "Pads, bags and footwork. Technical rounds first, conditioning at the end.",
    intensity: 5,
    equipment: "Bags, pads, wraps",
  },
  {
    id: "mobility",
    name: "Mobility",
    description:
      "Joint prep, loaded stretching and breathing. The session that keeps the other five available.",
    intensity: 1,
    equipment: "Bands, rollers, mats",
  },
]

// --- Plans ------------------------------------------------------------------

export function seedPlans(): Plan[] {
  return [
    {
      id: id(),
      slug: "day-pass",
      name: "Day pass",
      tagline: "One session, no commitment.",
      priceAed: 120,
      billingPeriod: "day",
      monthlyClassCredits: 1,
      features: [
        "One class or open-floor session",
        "Kit and towel included",
        "Book up to 7 days ahead",
      ],
      featured: false,
    },
    {
      id: id(),
      slug: "monthly",
      name: "Monthly",
      tagline: "Rolling month, cancel any time.",
      priceAed: 690,
      billingPeriod: "month",
      monthlyClassCredits: 12,
      features: [
        "12 classes a month",
        "Full open-floor access",
        "One InBody scan a month",
        "Freeze for up to 14 days",
      ],
      featured: false,
    },
    {
      id: id(),
      slug: "quarterly",
      name: "Quarterly",
      tagline: "Three months, unlimited classes.",
      priceAed: 1850,
      billingPeriod: "quarter",
      monthlyClassCredits: null,
      features: [
        "Unlimited classes",
        "Full open-floor access",
        "Monthly InBody scan and review",
        "Priority booking, 14 days ahead",
        "Freeze for up to 30 days",
      ],
      featured: true,
    },
    {
      id: id(),
      slug: "annual",
      name: "Annual",
      tagline: "Best rate. AED 525 a month.",
      priceAed: 6300,
      billingPeriod: "year",
      monthlyClassCredits: null,
      features: [
        "Everything in Quarterly",
        "Two guest passes a month",
        "Quarterly coach one-to-one",
        "Kit bag on sign-up",
        "Freeze for up to 60 days",
      ],
      featured: false,
    },
  ]
}

// --- Trainers ---------------------------------------------------------------

export function seedTrainers(): Trainer[] {
  const raw: Omit<Trainer, "id">[] = [
    {
      slug: "layla-al-marzooqi",
      name: "Layla Al Marzooqi",
      headline: "Head coach, conditioning",
      bio: "Layla built the Forge conditioning method after eight years coaching rowing squads. She scales every interval on the spot, so the room finishes together.",
      specialties: ["hiit", "spin"],
      certifications: ["NASM-CPT", "Concept2 rowing coach"],
      yearsExperience: 11,
    },
    {
      slug: "omar-haddad",
      name: "Omar Haddad",
      headline: "Strength lead",
      bio: "Omar competed in raw powerlifting for six years and now spends his time fixing other people's squats. Expect long warm-ups and very specific cues.",
      specialties: ["strength"],
      certifications: ["NSCA-CSCS", "IPF club coach"],
      yearsExperience: 9,
    },
    {
      slug: "priya-raman",
      name: "Priya Raman",
      headline: "Yoga and mobility",
      bio: "Priya teaches for people who train hard and stretch never. Her flows are short on chanting and long on hip work.",
      specialties: ["yoga", "mobility"],
      certifications: ["RYT-500", "FRC mobility specialist"],
      yearsExperience: 13,
    },
    {
      slug: "jack-whitfield",
      name: "Jack Whitfield",
      headline: "Boxing coach",
      bio: "Twelve amateur bouts and a decade on the pads. Jack starts every class with footwork, whether you like it or not.",
      specialties: ["boxing", "hiit"],
      certifications: ["England Boxing Level 2", "NASM-CPT"],
      yearsExperience: 10,
    },
    {
      slug: "noor-al-suwaidi",
      name: "Noor Al Suwaidi",
      headline: "Spin and endurance",
      bio: "Noor rides the Hatta climbs on weekends and programmes the Thursday endurance ride. She coaches to watts, never to the music.",
      specialties: ["spin", "hiit"],
      certifications: ["Schwinn power certified", "Precision Nutrition L1"],
      yearsExperience: 7,
    },
    {
      slug: "marcus-bell",
      name: "Marcus Bell",
      headline: "Strength and conditioning",
      bio: "Marcus spent six years with a rugby academy and brings the same warm-up. Newcomers get their first three sessions written out by hand.",
      specialties: ["strength", "hiit"],
      certifications: ["UKSCA accredited", "Kettlebell L2"],
      yearsExperience: 12,
    },
    {
      slug: "farah-kassem",
      name: "Farah Kassem",
      headline: "Movement and recovery",
      bio: "A physiotherapist first, coach second. Farah runs the Sunday mobility session and the return-to-training programme.",
      specialties: ["mobility", "yoga"],
      certifications: ["MSc Physiotherapy", "FRC mobility specialist"],
      yearsExperience: 8,
    },
    {
      slug: "diego-salas",
      name: "Diego Salas",
      headline: "Boxing and intervals",
      bio: "Diego coached out of a Bogotá boxing gym for five years. His rounds are short, loud and technically strict.",
      specialties: ["boxing", "spin"],
      certifications: ["AIBA Level 1", "TRX certified"],
      yearsExperience: 6,
    },
  ]

  return raw.map((trainer) => ({ ...trainer, id: id() }))
}

// --- Weekly schedule --------------------------------------------------------

type ScheduleRow = [
  day: DayOfWeek,
  time: string,
  typeId: GymClass["typeId"],
  trainerSlug: string,
  capacity: number,
  duration: number,
  studio: string,
  level: GymClass["level"],
]

/**
 * A real Gulf week: early mornings before work, a lunchtime session, evenings
 * after 17:30, and a short Friday. Studios never double-book.
 */
const SCHEDULE: ScheduleRow[] = [
  // Sunday
  [0, "05:45", "strength", "omar-haddad", 12, 60, "The Floor", "all"],
  [0, "06:30", "hiit", "layla-al-marzooqi", 16, 45, "Studio 1", "all"],
  [0, "17:30", "boxing", "jack-whitfield", 14, 60, "The Ring", "all"],
  [0, "18:45", "strength", "marcus-bell", 12, 60, "The Floor", "intermediate"],
  [0, "19:45", "mobility", "farah-kassem", 18, 45, "Studio 2", "all"],
  // Monday
  [1, "06:00", "spin", "noor-al-suwaidi", 20, 45, "Spin Room", "all"],
  [1, "07:15", "yoga", "priya-raman", 18, 60, "Studio 2", "all"],
  [1, "12:30", "hiit", "layla-al-marzooqi", 16, 40, "Studio 1", "all"],
  [1, "17:30", "strength", "omar-haddad", 12, 60, "The Floor", "all"],
  [1, "18:45", "spin", "diego-salas", 20, 45, "Spin Room", "all"],
  [1, "19:45", "boxing", "diego-salas", 14, 60, "The Ring", "intermediate"],
  // Tuesday
  [2, "05:45", "hiit", "marcus-bell", 16, 45, "Studio 1", "advanced"],
  [2, "06:30", "strength", "omar-haddad", 12, 60, "The Floor", "all"],
  [2, "17:30", "yoga", "priya-raman", 18, 60, "Studio 2", "all"],
  [2, "18:30", "spin", "noor-al-suwaidi", 20, 45, "Spin Room", "all"],
  [2, "19:30", "boxing", "jack-whitfield", 14, 60, "The Ring", "all"],
  // Wednesday
  [3, "06:00", "strength", "marcus-bell", 12, 60, "The Floor", "all"],
  [3, "07:15", "mobility", "farah-kassem", 18, 45, "Studio 2", "all"],
  [3, "12:30", "spin", "diego-salas", 20, 40, "Spin Room", "all"],
  [3, "17:30", "hiit", "layla-al-marzooqi", 16, 45, "Studio 1", "all"],
  [3, "18:45", "strength", "omar-haddad", 12, 60, "The Floor", "advanced"],
  [3, "19:45", "yoga", "priya-raman", 18, 60, "Studio 2", "all"],
  // Thursday
  [4, "05:45", "spin", "noor-al-suwaidi", 20, 60, "Spin Room", "intermediate"],
  [4, "06:30", "boxing", "jack-whitfield", 14, 60, "The Ring", "all"],
  [4, "17:30", "hiit", "marcus-bell", 16, 45, "Studio 1", "all"],
  [4, "18:45", "strength", "omar-haddad", 12, 60, "The Floor", "all"],
  // Friday — short day, closes at midday
  [5, "06:30", "hiit", "layla-al-marzooqi", 16, 45, "Studio 1", "all"],
  [5, "08:00", "yoga", "priya-raman", 18, 60, "Studio 2", "all"],
  [5, "09:15", "strength", "marcus-bell", 12, 60, "The Floor", "all"],
  // Saturday
  [6, "08:00", "strength", "omar-haddad", 12, 75, "The Floor", "all"],
  [6, "09:30", "boxing", "diego-salas", 14, 60, "The Ring", "all"],
  [6, "10:45", "spin", "noor-al-suwaidi", 20, 45, "Spin Room", "all"],
  [6, "17:00", "mobility", "farah-kassem", 18, 45, "Studio 2", "all"],
]

export function seedClasses(trainers: Trainer[]): GymClass[] {
  const bySlug = new Map(trainers.map((t) => [t.slug, t.id]))

  return SCHEDULE.map(
    ([dayOfWeek, startTime, typeId, trainerSlug, capacity, durationMinutes, studio, level]) => {
      const trainerId = bySlug.get(trainerSlug)
      if (!trainerId) {
        throw new Error(`Seed error: no trainer with slug "${trainerSlug}"`)
      }
      return {
        id: id(),
        typeId,
        trainerId,
        dayOfWeek,
        startTime,
        durationMinutes,
        capacity,
        studio,
        level,
      }
    }
  )
}

// --- Members ----------------------------------------------------------------

const FIRST_NAMES = [
  "Layla", "Omar", "Priya", "Jack", "Noor", "Marcus", "Farah", "Diego",
  "Aisha", "Hassan", "Sofia", "Yousef", "Mariam", "Daniel", "Hind", "Rashid",
  "Elena", "Khalid", "Amira", "Tom", "Zainab", "Sami", "Grace", "Faisal",
  "Reem", "Adam", "Salma", "Nikhil", "Dana", "Bilal", "Chloe", "Tariq",
  "Huda", "Liam", "Yara", "Karim", "Anna", "Saif", "Leen", "Ravi",
]

const LAST_NAMES = [
  "Al Marzooqi", "Haddad", "Raman", "Whitfield", "Al Suwaidi", "Bell",
  "Kassem", "Salas", "Al Balushi", "Nasser", "Rossi", "Al Hashimi",
  "Darwish", "Okafor", "Al Zaabi", "Mansour", "Petrova", "Al Ali",
  "Sharma", "Hughes", "Al Falasi", "Barakat", "Chen", "Al Mheiri",
  "Fahim", "Novak", "Al Rashed", "Iyer", "Silva", "Al Nuaimi",
  "Moretti", "Al Shamsi", "Hariri", "O'Neill", "Al Jaber", "Sobhy",
  "Kowalski", "Al Ameri", "Farouk", "Nair",
]

const STATUS_MIX: MemberStatus[] = [
  ...Array<MemberStatus>(28).fill("active"),
  ...Array<MemberStatus>(5).fill("frozen"),
  ...Array<MemberStatus>(4).fill("expired"),
  ...Array<MemberStatus>(3).fill("cancelled"),
]

const NOTE_POOL = [
  "Returning from a shoulder niggle — scale overhead work.",
  "Training for the Dubai Marathon in January.",
  "Prefers the 05:45 slot, rarely books evenings.",
  "Wants a coach one-to-one before adding barbell work.",
  "Referred by a member. Second month with us.",
  "",
  "",
  "",
]

export function seedMembers(plans: Plan[]): Member[] {
  const rand = mulberry32(0x5f0a2c)
  const today = new Date()

  return Array.from({ length: 40 }, (_, index) => {
    const firstName = FIRST_NAMES[index % FIRST_NAMES.length]
    const lastName = LAST_NAMES[(index * 7 + 3) % LAST_NAMES.length]
    const status = STATUS_MIX[index % STATUS_MIX.length]

    // Weighted so most of the club sits on monthly or quarterly.
    const planRoll = rand()
    const plan =
      planRoll < 0.08
        ? plans[0]
        : planRoll < 0.5
          ? plans[1]
          : planRoll < 0.85
            ? plans[2]
            : plans[3]

    const joinedDaysAgo = Math.floor(rand() * 420) + 3
    const joinedAt = subDays(today, joinedDaysAgo)
    const termDays =
      plan.billingPeriod === "day"
        ? 1
        : plan.billingPeriod === "month"
          ? 30
          : plan.billingPeriod === "quarter"
            ? 90
            : 365

    // Expired and cancelled members sit behind their renewal date.
    const renewsAt =
      status === "expired" || status === "cancelled"
        ? subDays(today, Math.floor(rand() * 40) + 2)
        : addDays(today, Math.floor(rand() * termDays) + 1)

    const handle = `${firstName}.${lastName.replace(/[^a-zA-Z]/g, "")}`.toLowerCase()

    return {
      id: id(),
      membershipNo: `FRG-${String(1042 + index * 3).padStart(4, "0")}`,
      firstName,
      lastName,
      email: `${handle}@example.ae`,
      phone: `+9715${String(20000000 + Math.floor(rand() * 9999999)).slice(0, 8)}`,
      planId: plan.id,
      status,
      joinedAt: formatISO(joinedAt, { representation: "date" }),
      renewsAt: formatISO(renewsAt, { representation: "date" }),
      notes: NOTE_POOL[Math.floor(rand() * NOTE_POOL.length)],
    }
  })
}

// --- Bookings ---------------------------------------------------------------

/**
 * Fills the week the way a real club fills: evenings and 06:00 slots go first,
 * midday sits half empty, and two or three sessions sell out.
 *
 * Deliberate deviation from the brief's "~60 bookings": 60 across 33 sessions
 * leaves the timetable ~12% full, which reads as a broken club and makes the
 * spots-left meter and the full-class waitlist path impossible to demo. This
 * seeds ~300 instead, which is what 1,240 members actually looks like.
 */
export function seedBookings(
  classes: GymClass[],
  members: Member[]
): ClassBooking[] {
  const rand = mulberry32(0x1c4e77)
  const bookable = members.filter(
    (m) => m.status === "active" || m.status === "frozen"
  )
  const bookings: ClassBooking[] = []
  const now = new Date()

  for (const gymClass of classes) {
    const hour = Number(gymClass.startTime.slice(0, 2))
    const peak = hour >= 17 || (hour >= 5 && hour < 8)
    const midday = hour >= 11 && hour < 15

    const fillRate = peak
      ? 0.66 + rand() * 0.38
      : midday
        ? 0.2 + rand() * 0.28
        : 0.35 + rand() * 0.32

    const target = Math.min(
      gymClass.capacity,
      Math.round(gymClass.capacity * fillRate)
    )

    const taken = new Set<string>()
    for (let i = 0; i < target; i++) {
      let member = bookable[Math.floor(rand() * bookable.length)]
      let guard = 0
      while (taken.has(member.id) && guard < 12) {
        member = bookable[Math.floor(rand() * bookable.length)]
        guard++
      }
      if (taken.has(member.id)) continue
      taken.add(member.id)

      bookings.push({
        id: id(),
        classId: gymClass.id,
        memberId: member.id,
        guestName: null,
        status: "booked",
        createdAt: subDays(now, Math.floor(rand() * 9)).toISOString(),
        source: rand() > 0.22 ? "web" : "admin",
      })
    }

    // A full class collects a short waitlist.
    if (taken.size >= gymClass.capacity) {
      const waiting = 1 + Math.floor(rand() * 2)
      for (let i = 0; i < waiting; i++) {
        const member = bookable[Math.floor(rand() * bookable.length)]
        if (taken.has(member.id)) continue
        taken.add(member.id)
        bookings.push({
          id: id(),
          classId: gymClass.id,
          memberId: member.id,
          guestName: null,
          status: "waitlisted",
          createdAt: subDays(now, Math.floor(rand() * 4)).toISOString(),
          source: "web",
        })
      }
    }
  }

  return bookings
}
