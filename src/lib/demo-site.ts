/**
 * What this demo is, in one place. The Desert Launch bar, the share-preview
 * card, the metadata and the structured data all read from here, so they can
 * never disagree about the name, the URL or the language.
 */
export type DemoLang = "en" | "ar";

export const DEMO = {
  /** Short id the landing site uses; also the subdomain and utm_campaign. */
  slug: "gym",
  name: "Demo Gym",
  /** Latin-only name for the share-preview image, whose default font has no Arabic. */
  latinName: "Demo Gym",
  url: "https://gym.demos.desertlaunch.dev",
  /** Language of the bar and the metadata. Typed as the union so the shared
   *  code that handles both languages stays identical in every demo. */
  lang: "en" as DemoLang,
  /** Interface languages the demo itself offers. */
  languages: ["en"],
  kind: "gym and fitness club",
  city: "Dubai",
  /** One paragraph for share previews and search snippets. */
  description:
    "A working demo of a gym website with its club admin, by Desert Launch: a weekly class timetable with live spots left and a waitlist, membership sign-up, and admin over members and classes. Fictional club, sample data.",
  /** Plain statement that the business is invented. */
  fiction:
    "A fictional business: the names, prices, address and phone numbers are invented, and the data is sample data that resets on refresh.",
  features: [
      "Weekly class timetable with live spots left",
      "Waitlist when a session is full",
      "Join flow that issues a membership number",
      "Club admin with stats, an eight-week joins chart and today's schedule",
      "Full CRUD on members and classes",
      "Optimistic cancellation with a deliberate ~10% failure to show rollback"
  ],
  repo: "https://github.com/Desert-Launch/demo-gym-fitness",
} as const;
