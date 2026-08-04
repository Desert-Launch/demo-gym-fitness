import type { Metadata } from "next"
import { Archivo, Archivo_Black, JetBrains_Mono } from "next/font/google"

import { Toaster } from "@/components/ui/sonner"
import { Providers } from "./providers"

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
  description:
    "Strength, conditioning and 60 coached classes a week in Al Quoz, Dubai. Train with coaches who know your name.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.variable} ${archivoBlack.variable} ${jetbrainsMono.variable}`}
      >
        <Providers>{children}</Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
