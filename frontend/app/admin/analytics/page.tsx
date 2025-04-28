"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockAdminStats } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import { BarChart, LineChart } from "@/components/ui/chart"
import { motion } from "framer-motion"
import { Download, Filter, PieChart, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import "chart.js/auto"

export default function AdminAnalyticsPage() {
  // Sample data for charts
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

  const userGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Mill Owners",
        data: [32, 36, 38, 42, 45, 48],
        backgroundColor: "hsl(var(--chart-1))",
        borderColor: "hsl(var(--chart-1))",
      },
      {
        label: "Contractors",
        data: [48, 52, 56, 60, 65, 68],
        backgroundColor: "hsl(var(--chart-2))",
        borderColor: "hsl(var(--chart-2))",
      },
    ],
  }

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
      {
        label: "Conflict Contracts",
        data: [3, 5, 2, 4, 3, 5],
        backgroundColor: "hsl(var(--chart-4))",
        borderColor: "hsl(var(--chart-4))",
      },
    ],
  }

  const conflictData = {
    labels: ["Labourer Overlap", "Document Issues", "Verification Failures", "Contract Disputes", "Other"],
    datasets: [
      {
        label: "Conflicts by Type",
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          "hsl(var(--chart-1))",
          "hsl(var(--chart-2))",
          "hsl(var(--chart-3))",
          "hsl(var(--chart-4))",
          "hsl(var(--chart-5))",
        ],
        borderColor: [
          "hsl(var(--chart-1))",
          "hsl(var(--chart-2))",
          "hsl(var(--chart-3))",
          "hsl(var(--chart-4))",
          "hsl(var(--chart-5))",
        ],
      },
    ],
  }

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and reports on platform usage, contracts, and revenue.
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
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(1650000)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12%</span> from last year
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mill Owners</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminStats.totalMillOwners}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+8%</span> from last quarter
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contractors</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminStats.totalContractors}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+15%</span> from last quarter
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Labourers</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAdminStats.totalLabourers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+10%</span> from last quarter
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="contracts">Contracts</TabsTrigger>
                <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Select defaultValue="6months">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last 1 Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
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
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>Mill owners and contractors growth over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <BarChart
                      data={userGrowthData}
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
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Activity</CardTitle>
                    <CardDescription>New, completed, and conflict contracts over the last 6 months</CardDescription>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Conflict Distribution</CardTitle>
                    <CardDescription>Distribution of conflicts by type</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="aspect-[2/1]">
                      <PieChart
                        data={conflictData}
                        options={{
                          plugins: {
                            legend: {
                              position: "right",
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Detailed revenue breakdown and analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Revenue by Subscription Type</h3>
                      <div className="relative h-80">
                        <BarChart
                          data={{
                            labels: ["Basic", "Standard", "Premium", "Enterprise"],
                            datasets: [
                              {
                                label: "Revenue",
                                data: [250000, 450000, 650000, 300000],
                                backgroundColor: "hsl(var(--chart-1))",
                                borderColor: "hsl(var(--chart-1))",
                              },
                            ],
                          }}
                          options={{
                            scales: {
                              y: {
                                beginAtZero: true,
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Monthly Recurring Revenue</h3>
                        <div className="relative h-60">
                          <LineChart
                            data={{
                              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                              datasets: [
                                {
                                  label: "MRR",
                                  data: [120000, 125000, 130000, 140000, 145000, 150000],
                                  backgroundColor: "hsl(var(--chart-2))",
                                  borderColor: "hsl(var(--chart-2))",
                                  fill: true,
                                },
                              ],
                            }}
                            options={{
                              scales: {
                                y: {
                                  beginAtZero: true,
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-4">Revenue by Region</h3>
                        <div className="relative h-60">
                          <PieChart
                            data={{
                              labels: ["North", "South", "East", "West", "Central"],
                              datasets: [
                                {
                                  label: "Revenue by Region",
                                  data: [350000, 450000, 250000, 300000, 300000],
                                  backgroundColor: [
                                    "hsl(var(--chart-1))",
                                    "hsl(var(--chart-2))",
                                    "hsl(var(--chart-3))",
                                    "hsl(var(--chart-4))",
                                    "hsl(var(--chart-5))",
                                  ],
                                  borderColor: [
                                    "hsl(var(--chart-1))",
                                    "hsl(var(--chart-2))",
                                    "hsl(var(--chart-3))",
                                    "hsl(var(--chart-4))",
                                    "hsl(var(--chart-5))",
                                  ],
                                },
                              ],
                            }}
                            options={{
                              plugins: {
                                legend: {
                                  position: "right",
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Analytics</CardTitle>
                  <CardDescription>Detailed user statistics and growth analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">User Growth Trend</h3>
                      <div className="relative h-80">
                        <LineChart
                          data={{
                            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                            datasets: [
                              {
                                label: "Mill Owners",
                                data: [32, 36, 38, 42, 45, 48],
                                backgroundColor: "hsl(var(--chart-1))",
                                borderColor: "hsl(var(--chart-1))",
                              },
                              {
                                label: "Contractors",
                                data: [48, 52, 56, 60, 65, 68],
                                backgroundColor: "hsl(var(--chart-2))",
                                borderColor: "hsl(var(--chart-2))",
                              },
                              {
                                label: "Labourers",
                                data: [850, 950, 1050, 1150, 1200, 1250],
                                backgroundColor: "hsl(var(--chart-3))",
                                borderColor: "hsl(var(--chart-3))",
                              },
                            ],
                          }}
                          options={{
                            scales: {
                              y: {
                                beginAtZero: true,
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-4">User Distribution by Role</h3>
                        <div className="relative h-60">
                          <PieChart
                            data={{
                              labels: ["Mill Owners", "Contractors", "Supervisors"],
                              datasets: [
                                {
                                  label: "Users by Role",
                                  data: [48, 68, 120],
                                  backgroundColor: [
                                    "hsl(var(--chart-1))",
                                    "hsl(var(--chart-2))",
                                    "hsl(var(--chart-3))",
                                  ],
                                  borderColor: ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"],
                                },
                              ],
                            }}
                            options={{
                              plugins: {
                                legend: {
                                  position: "right",
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-4">User Activity</h3>
                        <div className="relative h-60">
                          <BarChart
                            data={{
                              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                              datasets: [
                                {
                                  label: "Active Users",
                                  data: [95, 105, 115, 125, 135, 145],
                                  backgroundColor: "hsl(var(--chart-2))",
                                  borderColor: "hsl(var(--chart-2))",
                                },
                                {
                                  label: "New Users",
                                  data: [15, 12, 18, 22, 16, 20],
                                  backgroundColor: "hsl(var(--chart-1))",
                                  borderColor: "hsl(var(--chart-1))",
                                },
                              ],
                            }}
                            options={{
                              scales: {
                                y: {
                                  beginAtZero: true,
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contracts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Analytics</CardTitle>
                  <CardDescription>Detailed contract statistics and analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Contract Status Distribution</h3>
                      <div className="relative h-80">
                        <BarChart
                          data={{
                            labels: ["Active", "Pending", "Completed", "Rejected", "Expired"],
                            datasets: [
                              {
                                label: "Contracts by Status",
                                data: [78, 25, 45, 12, 18],
                                backgroundColor: [
                                  "hsl(var(--chart-2))",
                                  "hsl(var(--chart-5))",
                                  "hsl(var(--chart-1))",
                                  "hsl(var(--chart-4))",
                                  "hsl(var(--chart-3))",
                                ],
                                borderColor: [
                                  "hsl(var(--chart-2))",
                                  "hsl(var(--chart-5))",
                                  "hsl(var(--chart-1))",
                                  "hsl(var(--chart-4))",
                                  "hsl(var(--chart-3))",
                                ],
                              },
                            ],
                          }}
                          options={{
                            scales: {
                              y: {
                                beginAtZero: true,
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Contract Creation Trend</h3>
                        <div className="relative h-60">
                          <LineChart
                            data={{
                              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                              datasets: [
                                {
                                  label: "New Contracts",
                                  data: [18, 25, 20, 30, 22, 35],
                                  backgroundColor: "hsl(var(--chart-1))",
                                  borderColor: "hsl(var(--chart-1))",
                                  fill: true,
                                },
                              ],
                            }}
                            options={{
                              scales: {
                                y: {
                                  beginAtZero: true,
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-4">Average Contract Value</h3>
                        <div className="relative h-60">
                          <BarChart
                            data={{
                              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                              datasets: [
                                {
                                  label: "Avg. Contract Value (₹)",
                                  data: [220000, 235000, 245000, 250000, 260000, 270000],
                                  backgroundColor: "hsl(var(--chart-3))",
                                  borderColor: "hsl(var(--chart-3))",
                                },
                              ],
                            }}
                            options={{
                              scales: {
                                y: {
                                  beginAtZero: true,
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conflicts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Conflict Analytics</CardTitle>
                  <CardDescription>Detailed conflict statistics and analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Conflict Types Distribution</h3>
                      <div className="relative h-80">
                        <PieChart
                          data={{
                            labels: [
                              "Labourer Overlap",
                              "Document Issues",
                              "Verification Failures",
                              "Contract Disputes",
                              "Other",
                            ],
                            datasets: [
                              {
                                label: "Conflicts by Type",
                                data: [45, 25, 15, 10, 5],
                                backgroundColor: [
                                  "hsl(var(--chart-1))",
                                  "hsl(var(--chart-2))",
                                  "hsl(var(--chart-3))",
                                  "hsl(var(--chart-4))",
                                  "hsl(var(--chart-5))",
                                ],
                                borderColor: [
                                  "hsl(var(--chart-1))",
                                  "hsl(var(--chart-2))",
                                  "hsl(var(--chart-3))",
                                  "hsl(var(--chart-4))",
                                  "hsl(var(--chart-5))",
                                ],
                              },
                            ],
                          }}
                          options={{
                            plugins: {
                              legend: {
                                position: "right",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Conflict Trend</h3>
                        <div className="relative h-60">
                          <LineChart
                            data={{
                              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                              datasets: [
                                {
                                  label: "Conflicts",
                                  data: [8, 12, 6, 10, 8, 12],
                                  backgroundColor: "hsl(var(--chart-4))",
                                  borderColor: "hsl(var(--chart-4))",
                                  fill: true,
                                },
                              ],
                            }}
                            options={{
                              scales: {
                                y: {
                                  beginAtZero: true,
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-4">Resolution Rate</h3>
                        <div className="relative h-60">
                          <BarChart
                            data={{
                              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                              datasets: [
                                {
                                  label: "Conflicts",
                                  data: [8, 12, 6, 10, 8, 12],
                                  backgroundColor: "hsl(var(--chart-4))",
                                  borderColor: "hsl(var(--chart-4))",
                                },
                                {
                                  label: "Resolved",
                                  data: [7, 10, 5, 8, 6, 9],
                                  backgroundColor: "hsl(var(--chart-2))",
                                  borderColor: "hsl(var(--chart-2))",
                                },
                              ],
                            }}
                            options={{
                              scales: {
                                y: {
                                  beginAtZero: true,
                                },
                              },
                            }}
                          />
                        </div>
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
