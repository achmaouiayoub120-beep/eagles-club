import type React from "react"
import type { Metadata } from "next"
import { Outfit, Geist_Mono } from "next/font/google"
import "./globals.css"

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "Club Eagles Management System",
  description: "Plateforme premium de gestion du Club Eagles — Membres, Cotisations, Événements, Galerie, Annonces",
  icons: {
    icon: "/logos/eagles-logo.png",
    apple: "/logos/eagles-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} ${geistMono.variable} font-sans antialiased bg-[#080808] text-[#F5F5F5]`}>
        {children}
      </body>
    </html>
  )
}
