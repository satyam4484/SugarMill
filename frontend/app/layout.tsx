import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import {AppContextProvider} from "@/context/AuthContext" // Import the AuthProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sugar Mill Labour Management",
  description: "Labour Verification & Contract Management Software for Sugar Mills",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AppContextProvider> {/* Wrap children with AuthProvider */}
            {children}
          </AppContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
