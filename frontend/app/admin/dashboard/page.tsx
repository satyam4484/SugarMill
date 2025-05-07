"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockAdminStats, mockContracts, mockMillOwners } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { BarChart, LineChart } from "@/components/ui/chart"
import { AlertTriangle, ArrowUpRight, Building, CheckCircle, FileCheck, Users } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import "chart.js/auto"
import withAuth from "@/hocs/withAuth"
function AdminDashboardPage() {
  // Sample data for charts
  const contractsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Contracts",
        data: [18, 25, 20, 30, 22, 35],
        backgroundColor: "hsl(var(--chart-1))",
        borderColor: "hsl(var(--chart-1))",
      },
      {
        label: "Completed Contracts",
        data: [15, 20, 18, 25, 20, 30],
        backgroundColor: "hsl(var(--chart-2))",
        borderColor: "hsl(var(--chart-2))",
      },
    ],
  }

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [150000, 180000, 210000, 220000, 250000, 280000],
        backgroundColor: "hsl(var(--chart-3))",
        borderColor: "hsl(var(--chart-3))",
        fill: true,
      },
    ],
  }

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Super Admin Panel. Monitor and manage the entire platform from here.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminStats.totalAgreements}</div>
              <p className="text-xs text-muted-foreground">+{mockAdminStats.activeAgreements} active agreements</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conflict Warnings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminStats.conflictWarnings}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500">+2</span> since last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminStats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+5</span> since last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockAdminStats.revenueThisMonth)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12%</span> from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Contract Activity</CardTitle>
                    <CardDescription>Number of new and completed contracts over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <BarChart
                      data={contractsData}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                      className="aspect-[2/1]"
                    />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Mill Owners</CardTitle>
                    <CardDescription>Recently added mill owners and their subscription status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockMillOwners.slice(0, 5).map((owner) => (
                        <div key={owner.id} className="flex items-center">
                          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10">
                            <Building className="h-5 w-5 text-primary" />
                          </div>
                          <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{owner.name}</p>
                            <p className="text-sm text-muted-foreground">{owner.location}</p>
                          </div>
                          <div className="ml-auto">
                            <Badge
                              variant={
                                owner.subscriptionStatus === "active"
                                  ? "default"
                                  : owner.subscriptionStatus === "pending"
                                    ? "outline"
                                    : "destructive"
                              }
                            >
                              {owner.subscriptionStatus}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Conflict Warnings</CardTitle>
                    <CardDescription>Recent contracts with potential conflicts that need review</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockContracts
                        .filter((contract) => contract.conflicts)
                        .slice(0, 4)
                        .map((contract) => (
                          <div key={contract.id} className="flex items-center">
                            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-red-100 dark:bg-red-900">
                              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
                            </div>
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {contract.millOwnerName} & {contract.contractorName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Contract #{contract.id} - {new Date(contract.startDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="ml-auto">
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              >
                                Conflict
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <LineChart
                      data={revenueData}
                      options={{
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                      className="aspect-[2/1]"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                  <CardDescription>Detailed analytics of platform usage and performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Mill Owners</p>
                      <p className="text-3xl font-bold">{mockAdminStats.totalMillOwners}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Contractors</p>
                      <p className="text-3xl font-bold">{mockAdminStats.totalContractors}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Labourers</p>
                      <p className="text-3xl font-bold">{mockAdminStats.totalLabourers}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Verification Rate</p>
                      <p className="text-3xl font-bold">87%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Reports</CardTitle>
                  <CardDescription>Generated reports and system health</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Monthly Subscription Report</p>
                        <p className="text-sm text-muted-foreground">April 2024</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        >
                          Generated
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Conflict Resolution Report</p>
                        <p className="text-sm text-muted-foreground">April 2024</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        >
                          Generated
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">System Health Report</p>
                        <p className="text-sm text-muted-foreground">April 2024</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        >
                          Generated
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Notifications</CardTitle>
                  <CardDescription>Recent system notifications and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 border-b pb-4">
                      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">New Mill Owner Registration</p>
                        <p className="text-sm text-muted-foreground">Shree Durga Sugar Mills has registered</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 border-b pb-4">
                      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-yellow-100 dark:bg-yellow-900">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Conflict Detection Alert</p>
                        <p className="text-sm text-muted-foreground">3 new conflicts detected in recent contracts</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 border-b pb-4">
                      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-green-100 dark:bg-green-900">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">System Update Completed</p>
                        <p className="text-sm text-muted-foreground">System updated to version 2.4.0</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}


export default withAuth(AdminDashboardPage as React.ComponentType);