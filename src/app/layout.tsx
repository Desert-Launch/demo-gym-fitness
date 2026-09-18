import type { Metadata } from "next"
import { Archivo, Archivo_Black, JetBrains_Mono } from "next/font/google"

import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./providers"
import { DemoBar } from "@/components/layout/demo-bar"
import { demoJsonLd, demoMetadata } from "@/lib/desert-launch"

import "./globals.css"

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
})

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Forge Athletic Club — Dubai",
    template: "%s · Forge Athletic Club",
  },
  // Share preview, robots, canonical host and the link back to the studio.
  ...demoMetadata(),
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${archivoBlack.variable} ${jetbrainsMono.variable}`}
      >
        <DemoBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(demoJsonLd()) }}
        />
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
