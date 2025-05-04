import type React from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { useGlobalContext } from "@/context/AuthContext"
// import { useGlobalContext } from "@/context/AuthContext"

interface DashboardLayoutProps {
  children: React.ReactNode
  role?: "admin" | "mill-owner" | "contractor" | "supervisor"
  user?: {
    name: string
    email: string
    image?: string
    role?: string
  }
}

export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const {userDetails} = useGlobalContext();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar role={(userDetails as any)?.role} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}
