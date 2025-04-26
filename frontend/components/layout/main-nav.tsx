"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Icons } from "@/components/icons"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">Sugar Mill Management</span>
      </Link>
      {/* <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500 to-blue-700 p-6 no-underline outline-none focus:shadow-md"
                      href="/admin/dashboard"
                    >
                      <Icons.logo className="h-6 w-6 text-white" />
                      <div className="mb-2 mt-4 text-lg font-medium text-white">Admin Dashboard</div>
                      <p className="text-sm leading-tight text-white/90">
                        Manage mill owners, contractors, and system settings
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/admin/users" title="User Management">
                  Add, edit, and manage mill owners and contractors
                </ListItem>
                <ListItem href="/admin/contracts" title="Contract Validation">
                  Review and validate labour contracts
                </ListItem>
                <ListItem href="/admin/analytics" title="Analytics">
                  View system analytics and reports
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Mill Owner</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem href="/mill-owner/dashboard" title="Dashboard">
                  Overview of contracts and operations
                </ListItem>
                <ListItem href="/mill-owner/contracts" title="Contracts">
                  Manage labour contracts
                </ListItem>
                <ListItem href="/mill-owner/contractors" title="Contractors">
                  View and manage contractors
                </ListItem>
                <ListItem href="/mill-owner/reports" title="Reports">
                  Generate and view reports
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Contractor</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <ListItem href="/contractor/dashboard" title="Dashboard">
                  Overview of teams and contracts
                </ListItem>
                <ListItem href="/contractor/team" title="Team Management">
                  Manage your labour team
                </ListItem>
                <ListItem href="/contractor/contracts" title="Contracts">
                  View and manage contracts
                </ListItem>
                <ListItem href="/contractor/conflicts" title="Conflict Warnings">
                  View and resolve conflicts
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/supervisor/dashboard" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Supervisor</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/biometric" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Biometric Entry</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu> */}
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
