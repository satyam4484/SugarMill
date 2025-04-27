"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import {
  BarChart3,
  Building,
  ChevronDown,
  Clipboard,
  CreditCard,
  FileText,
  Fingerprint,
  LayoutDashboard,
  Menu,
  MessageSquare,
  PanelLeft,
  Settings,
  Users,
  UserCircle,
  AlertTriangle,
  Bell,
  FileCheck,
  Truck,
  CalendarCheck,
} from "lucide-react"
import { CustomerRoles } from "@/lib/contants"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: "ADMIN" | typeof CustomerRoles[keyof typeof CustomerRoles]
}

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: { title: string; href: string }[]
}

export function Sidebar({ className, role = "admin", ...props }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  // Define navigation items based on role
  const getNavItems = (): SidebarItem[] => {
    switch (role) {
      case "ADMIN":
        return [
          {
            title: "Dashboard",
            href: "/admin/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
          },
          {
            title: "User Management",
            href: "/admin/users",
            icon: <Users className="h-5 w-5" />,
            submenu: [
              { title: "Mill Owners", href: "/admin/users/mill-owners" },
              { title: "Contractors", href: "/admin/users/contractors" },
            ],
          },
          {
            title: "Contract Validation",
            href: "/admin/contracts",
            icon: <FileCheck className="h-5 w-5" />,
          },
          {
            title: "Analytics",
            href: "/admin/analytics",
            icon: <BarChart3 className="h-5 w-5" />,
          },
          {
            title: "Billing",
            href: "/admin/billing",
            icon: <CreditCard className="h-5 w-5" />,
          },
          {
            title: "Documents",
            href: "/admin/documents",
            icon: <FileText className="h-5 w-5" />,
          },
          {
            title: "Settings",
            href: "/admin/settings",
            icon: <Settings className="h-5 w-5" />,
          },
        ]
      case CustomerRoles.MILL_OWNER:
        return [
          {
            title: "Dashboard",
            href: "/mill-owner/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
          },
          {
            title: "Contracts",
            href: "/mill-owner/contracts",
            icon: <Clipboard className="h-5 w-5" />,
            submenu: [
              { title: "Active Contracts", href: "/mill-owner/contracts/active" },
              { title: "Create Contract", href: "/mill-owner/contracts/create" },
              { title: "History", href: "/mill-owner/contracts/history" },
            ],
          },
          {
            title: "Contractors",
            href: "/mill-owner/contractors",
            icon: <UserCircle className="h-5 w-5" />,
          },
          // {
          //   title: "Verification",
          //   href: "/mill-owner/verification",
          //   icon: <Fingerprint className="h-5 w-5" />,
          // },
          // {
          //   title: "Notifications",
          //   href: "/mill-owner/notifications",
          //   icon: <Bell className="h-5 w-5" />,
          // },
          // {
          //   title: "Reports",
          //   href: "/mill-owner/reports",
          //   icon: <FileText className="h-5 w-5" />,
          // },
          // {
          //   title: "Settings",
          //   href: "/mill-owner/settings",
          //   icon: <Settings className="h-5 w-5" />,
          // },
        ]
      case CustomerRoles.LABOURER:
        return [
          {
            title: "Dashboard",
            href: "/contractor/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
          },
          {
            title: "Team Management",
            href: "/contractor/team",
            icon: <Users className="h-5 w-5" />,
          },
          {
            title: "Contracts",
            href: "/contractor/contracts",
            icon: <Clipboard className="h-5 w-5" />,
            submenu: [
              { title: "Active Contracts", href: "/contractor/contracts/active" },
              { title: "Contract Offers", href: "/contractor/contracts/offers" },
              { title: "History", href: "/contractor/contracts/history" },
            ],
          },
          {
            title: "Conflict Warnings",
            href: "/contractor/conflicts",
            icon: <AlertTriangle className="h-5 w-5" />,
          },
          // {
          //   title: "Vehicles",
          //   href: "/contractor/vehicles",
          //   icon: <Truck className="h-5 w-5" />,
          // },
          {
            title: "Contracts History",
            href: "/contractor/history",
            icon: <FileText className="h-5 w-5" />,
          },
          {
            title: "Settings",
            href: "/contractor/settings",
            icon: <Settings className="h-5 w-5" />,
          },
        ]
      case CustomerRoles.CONTRACTOR:
        return [
          {
            title: "Dashboard",
            href: "/supervisor/dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
          },
          {
            title: "Team Overview",
            href: "/supervisor/team",
            icon: <Users className="h-5 w-5" />,
          },
          {
            title: "Attendance",
            href: "/supervisor/attendance",
            icon: <CalendarCheck className="h-5 w-5" />,
          },
          {
            title: "Chat",
            href: "/supervisor/chat",
            icon: <MessageSquare className="h-5 w-5" />,
          },
          {
            title: "Reports",
            href: "/supervisor/reports",
            icon: <FileText className="h-5 w-5" />,
          },
          {
            title: "Settings",
            href: "/supervisor/settings",
            icon: <Settings className="h-5 w-5" />,
          },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px] pr-0">
          <MobileSidebar
            navItems={navItems}
            pathname={pathname}
            openSubmenu={openSubmenu}
            toggleSubmenu={toggleSubmenu}
            setOpen={setOpen}
          />
        </SheetContent>
      </Sheet>
      <div
        className={cn("hidden border-r bg-background h-screen md:flex md:w-[240px] lg:w-[300px] flex-col", className)}
        {...props}
      >
        {/* <div className="py-4 px-3 border-b">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Building className="h-5 w-5" />
            <span>Sugar Mill Management</span>
          </Link>
        </div> */}
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {navItems.map((item) => (
              <div key={item.title} className="mb-1">
                {item.submenu ? (
                  <>
                    <Button
                      variant="ghost"
                      className={cn("w-full justify-start", pathname.startsWith(item.href) && "bg-accent")}
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                      <ChevronDown
                        className={cn(
                          "ml-auto h-4 w-4 transition-transform",
                          openSubmenu === item.title && "rotate-180",
                        )}
                      />
                    </Button>
                    {openSubmenu === item.title && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Button
                            key={subItem.title}
                            variant="ghost"
                            asChild
                            className={cn(
                              "w-full justify-start pl-6 text-sm",
                              pathname === subItem.href && "bg-accent",
                            )}
                          >
                            <Link href={subItem.href}>{subItem.title}</Link>
                          </Button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    asChild
                    className={cn("w-full justify-start", pathname === item.href && "bg-accent")}
                  >
                    <Link href={item.href}>
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-auto p-4 border-t">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/">
              <PanelLeft className="mr-2 h-4 w-4" />
              Collapse Sidebar
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}

interface MobileSidebarProps {
  navItems: SidebarItem[]
  pathname: string
  openSubmenu: string | null
  toggleSubmenu: (title: string) => void
  setOpen: (open: boolean) => void
}

function MobileSidebar({ navItems, pathname, openSubmenu, toggleSubmenu, setOpen }: MobileSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="py-4 px-3 border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
          <Building className="h-5 w-5" />
          <span>Sugar Mill Management</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {navItems.map((item) => (
            <div key={item.title} className="mb-1">
              {item.submenu ? (
                <>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start", pathname.startsWith(item.href) && "bg-accent")}
                    onClick={() => toggleSubmenu(item.title)}
                  >
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                    <ChevronDown
                      className={cn("ml-auto h-4 w-4 transition-transform", openSubmenu === item.title && "rotate-180")}
                    />
                  </Button>
                  {openSubmenu === item.title && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Button
                          key={subItem.title}
                          variant="ghost"
                          asChild
                          className={cn("w-full justify-start pl-6 text-sm", pathname === subItem.href && "bg-accent")}
                          onClick={() => setOpen(false)}
                        >
                          <Link href={subItem.href}>{subItem.title}</Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Button
                  variant="ghost"
                  asChild
                  className={cn("w-full justify-start", pathname === item.href && "bg-accent")}
                  onClick={() => setOpen(false)}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span className="ml-2">{item.title}</span>
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
