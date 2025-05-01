"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockMillOwnerStats, mockContracts, mockContractors } from "@/lib/mock-data"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowUpRight, Calendar, CheckCircle, FileCheck, FileText, Plus, Users } from "lucide-react"
import { LineChart } from "@/components/ui/chart"
import "chart.js/auto"
import withAuth from "@/hocs/withAuth"
import { useEffect, useState } from "react"
import { contractors } from "@/network/agent"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ContractDetails } from "@/network/agent"

function MillOwnerDashboardPage() {
  // Sample data for charts
  const labourerData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Active Labourers",
        data: [120, 140, 160, 180, 170, 190],
        backgroundColor: "hsl(var(--chart-1))",
        borderColor: "hsl(var(--chart-1))",
        fill: true,
      },
    ],
  }

  const [activeContracts,setActiveContracts] = useState<any[]>([]);
  
  const router =useRouter();
  const { toast } = useToast()

  // Filter contracts for this mill owner (using ID 1 for demo)
  const millOwnerContracts = mockContracts.filter((contract) => contract.millOwnerId === "1")

  const [contractorsData,setContractors] = useState<any[]>([]);

  const getContractorsHanlder = async () => {
    try{
      const response = await contractors.getAllContractors('limit=5');
      setContractors(response.data);

    }catch(error){
      console.log("error fetching..")
      toast({
        title: "Error",
        description: "Failed to load contractor details. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getActiveContractsHandler = async () => {
    try{
      const response = await ContractDetails.getAllContract('limit=2');
      setActiveContracts(response.data.data);
    }catch(error){
      console.log("error fetching..")
      toast({
        title: "Error",
        description: "Failed to load contractor details. Please try again.",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    getContractorsHanlder();
    getActiveContractsHandler();

  },[])

  return (
    <DashboardLayout role="mill-owner">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Mill Owner Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Ganesh Sugar Mills dashboard. Manage your contracts and labour force.
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
              <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMillOwnerStats.totalContracts}</div>
              <p className="text-xs text-muted-foreground">{mockMillOwnerStats.activeContracts} active contracts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Labourers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMillOwnerStats.totalLabourers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+15</span> since last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conflict Warnings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMillOwnerStats.conflictWarnings}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500">+2</span> new conflicts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Advance Amount</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockMillOwnerStats.advanceAmount)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+8%</span> from last season
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
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="contractors">Contractors</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Labourer Trend</CardTitle>
                    <CardDescription>Number of active labourers over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <LineChart
                      data={labourerData}
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
                    <CardTitle>Upcoming Renewals</CardTitle>
                    <CardDescription>Contracts that are due for renewal soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {millOwnerContracts
                        .filter((contract) => new Date(contract.endDate) > new Date())
                        .slice(0, 3)
                        .map((contract) => (
                          <div key={contract.id} className="flex items-center">
                            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900">
                              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Contract with {contract.contractorName}
                              </p>
                              <p className="text-sm text-muted-foreground">Expires on {formatDate(contract.endDate)}</p>
                            </div>
                            <div className="ml-auto">
                              <Button variant="outline" size="sm">
                                Renew
                              </Button>
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
                    <CardDescription>Recent contracts with potential conflicts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {millOwnerContracts
                        .filter((contract) => contract.conflicts)
                        .map((contract) => (
                          <div key={contract.id} className="flex items-center">
                            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-red-100 dark:bg-red-900">
                              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
                            </div>
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Contract with {contract.contractorName}
                              </p>
                              <p className="text-sm text-muted-foreground">3 labourers with conflicts detected</p>
                            </div>
                            <div className="ml-auto">
                              <Button variant="outline" size="sm">
                                Review
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-4">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Recent actions and updates on your account</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-green-100 dark:bg-green-900">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">Contract #2 Approved</p>
                          <p className="text-sm text-muted-foreground">Contract with Sunil Patil has been approved</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">New Contract Created</p>
                          <p className="text-sm text-muted-foreground">You created a new contract with Rajesh Kumar</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-yellow-100 dark:bg-yellow-900">
                          <Users className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">Labourer Verification</p>
                          <p className="text-sm text-muted-foreground">15 new labourers verified via biometric</p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="contracts" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Active Contracts</CardTitle>
                    <CardDescription>Currently active contracts with contractors</CardDescription>
                  </div>
                  <Button onClick={() => router.push('/mill-owner/contracts/create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Contract
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeContracts.map((contract: any) => (
                      <div
                        key={contract._id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                            <FileCheck className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Contract with {contract.contractor?.user?.name}</p>
                            <p className="text-sm text-muted-foreground">
                            {formatDate(new Date(contract.startDate).toISOString())} - {formatDate(new Date(contract.endDate).toISOString())}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium">{contract.totalLabourers} Labourers</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(contract.advanceAmount)} Advance
                            </p>
                          </div>
                          <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
                          {contract.conflicts && (
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            >
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Conflict
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="contractors" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Available Contractors</CardTitle>
                    <CardDescription>Contractors available for new contracts</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {contractorsData.slice(0, 5).map((contractor) => (
                      <Card key={contractor._id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">{contractor?.user?.name}</CardTitle>
                          <CardDescription>{contractor?.user?.contactNo}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Labourers:</span>
                              <span>{contractor.totalLabourers || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Active Contracts:</span>
                              <span>{contractor.activeContracts || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <Badge variant={contractor.isActive ? "default" : "destructive"}>
                                {contractor.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                        <div className="border-t p-4">
                          <Button className="w-full" onClick={() => router.push('/mill-owner/contracts/create')}>Create Contract</Button>
                        </div>
                      </Card>
                    ))}
                    
                    {/* See All Contractors Card */}
                    <Card className="overflow-hidden flex flex-col justify-center items-center bg-muted/30 border-dashed">
                      <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                        <Users className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">See All Contractors</h3>
                        <p className="text-sm text-muted-foreground text-center mb-4">
                          View and manage all your contractors
                        </p>
                        <Button 
                              className="cursor-pointer" 
                              onClick={() => router.push('/mill-owner/contractors')}
                            >
                              View All
                            </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Alerts & Notifications</CardTitle>
                  <CardDescription>Important alerts and notifications for your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <h4 className="font-medium text-yellow-600 dark:text-yellow-400">Contract Expiring Soon</h4>
                      </div>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-2">
                        Your contract with Rajesh Kumar is expiring in 30 days on June 30, 2024.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Renew Contract
                      </Button>
                    </div>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <h4 className="font-medium text-red-600 dark:text-red-400">Conflict Warning</h4>
                      </div>
                      <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                        3 labourers in your contract with Sunil Patil have conflicts with other contracts.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Review Conflicts
                      </Button>
                    </div>
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <h4 className="font-medium text-green-600 dark:text-green-400">Contract Approved</h4>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                        Your contract with Sunil Patil has been approved and is now active.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        View Contract
                      </Button>
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


export default withAuth(MillOwnerDashboardPage);