"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockContractorStats, mockContracts, mockLabourers } from "@/lib/mock-data"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowUpRight, Calendar, CheckCircle, FileCheck, FileText, Plus, Users } from "lucide-react"
import { BarChart } from "@/components/ui/chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import "chart.js/auto"
import { labourers,ContractDetails } from "@/network/agent"
import withAuth from "@/hocs/withAuth"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { HTTP_STATUS_CODE } from "@/lib/contants"

function ContractorDashboardPage() {

  const router = useRouter();
  const [labourDetails,setLabourDetails] = useState<any>([]);
  const [contractDetails,setContractDetails] = useState<any>([]);
  const { toast } = useToast()

  const laboursDetailsHandler = async() => {
    try{
      const response = await labourers.getAllLabours('limit=6');
      if(response.status === HTTP_STATUS_CODE.OK) {
        setLabourDetails(response.data);
      }
    }catch(error) {
      toast({
        title: "Failed to fetch Labours",
        variant:"destructive"
      })
    }
  }

  const contractsDetailsHandler = async() => {
    try{
      const response = await ContractDetails.getAllContract();
      if(response.status === HTTP_STATUS_CODE.OK) {
        setContractDetails(response.data.data);
      }
    }catch(error) {
      toast({
        title: "Failed to fetch Contracts",
        variant:"destructive"
      })
    }
  }

  console.log("contract-details--",contractDetails);

  useEffect(() => {
    const resolvePromises = [
      laboursDetailsHandler(),
      contractsDetailsHandler()
    ];
    Promise.all(resolvePromises)
  },[]);
  
  const statusChangeHandler = async (id:string,status:string) => {
    try{
      const response = await ContractDetails.UpdateContractDetils(id,{status:status});
      if(response.status === HTTP_STATUS_CODE.OK) {
        toast({
          title:`Contract ${status}`,
          variant:"default"
        })
        setContractDetails(contractDetails.filter((contract: any)  => contract._id != id));
      }
    }catch(error){
      toast({
        title:`Failed to ${status} Contract `,
        variant:"destructive"
      })
    }
  }
  // Sample data for charts
  const earningsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Earnings",
        data: [85000, 95000, 110000, 105000, 120000, 115000],
        backgroundColor: "hsl(var(--chart-1))",
        borderColor: "hsl(var(--chart-1))",
      },
    ],
  }

  // Filter contracts for this contractor (using ID 1 for demo)
  // const contractorContracts = contractDetails.filter((contract) => contract.contractorId === "1")

  // Filter labourers for this contractor
  const contractorLabourers = mockLabourers.filter((labourer) => labourer.contractorId === "1")
  return (
    <DashboardLayout role="contractor">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Contractor Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Rajesh Kumar's dashboard. Manage your team and contracts.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Labourers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockContractorStats.totalLabourers}</div>
              <p className="text-xs text-muted-foreground">{mockContractorStats.activeLabourers} active labourers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockContractorStats.activeContracts}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+1</span> since last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Contracts</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockContractorStats.pendingContracts}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-yellow-500">+2</span> new offers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(mockContractorStats.totalEarnings)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+8%</span> from last year
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
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Monthly Earnings</CardTitle>
                    <CardDescription>Your earnings over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <BarChart
                      data={earningsData}
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
                    <CardTitle>Contract Offers</CardTitle>
                    <CardDescription>Recent contract offers from mill owners</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contractDetails
                        .filter((contract: any) => contract.status === "PENDING")
                        .map((contract: any) => (
                          <div key={contract._id} className="flex items-center">
                            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900">
                              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">Offer from {contract.millOwner.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {contract.totalLabourers} labourers, {formatCurrency(contract.advanceAmount)} advance
                              </p>
                            </div>
                            <div className="ml-auto flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => statusChangeHandler( contract._id,'REJECT')}>
                                Reject
                              </Button>
                              <Button size="sm" onClick={() =>statusChangeHandler(contract._id,'ACTIVE')}>Accept</Button>
                            </div>
                          </div>
                        ))}
                      {contractDetails.filter((contract: any) => contract.status === "PENDING").length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">No pending contract offers</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Conflict Warnings</CardTitle>
                    <CardDescription>Labourers with potential conflicts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contractorLabourers
                        .filter((labourer) => labourer.conflicts)
                        .map((labourer) => (
                          <div key={labourer.id} className="flex items-center">
                            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-red-100 dark:bg-red-900">
                              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
                            </div>
                            <div className="ml-4 space-y-1">
                              <p className="text-sm font-medium leading-none">{labourer.name}</p>
                              <p className="text-sm text-muted-foreground">Appears in multiple active contracts</p>
                            </div>
                            <div className="ml-auto">
                              <Button variant="outline" size="sm">
                                Resolve
                              </Button>
                            </div>
                          </div>
                        ))}
                      {contractorLabourers.filter((labourer) => labourer.conflicts).length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground">No conflicts detected</p>
                        </div>
                      )}
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
                          <p className="text-sm font-medium leading-none">Contract Accepted</p>
                          <p className="text-sm text-muted-foreground">
                            You accepted a contract with Ganesh Sugar Mills
                          </p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">New Labourer Added</p>
                          <p className="text-sm text-muted-foreground">You added 3 new labourers to your team</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-yellow-100 dark:bg-yellow-900">
                          <FileText className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">New Contract Offer</p>
                          <p className="text-sm text-muted-foreground">
                            You received a new contract offer from EID Parry Sugar
                          </p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>Manage your team of labourers</CardDescription>
                  </div>
                  {/* <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Labourer
                  </Button> */}
                </CardHeader>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {labourDetails && labourDetails.slice(0, 5).map((labourer: any) => (
                      <Card key={labourer._id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={labourer.profilePicture || "/placeholder.jpg"} alt={labourer.user.name} />
                              <AvatarFallback>{labourer.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{labourer.user.name}</CardTitle>
                              <CardDescription>{labourer.user.contactNo}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Aadhar:</span>
                              <span>{labourer.documents.aadhar.aadharNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Age:</span>
                              <span>{labourer.Age} years</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Biometric:</span>
                              {labourer.verificationStatus === "APPROVED" ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                >
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Verified
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                >
                                  Pending
                                </Badge>
                              )}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <Badge variant={labourer.isActive ? "default" : "destructive"}>
                                {labourer.isActive ? "Active":"In-Active"}
                              </Badge>
                            </div>
                            {/* {labourer?.conflicts && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Conflicts:</span>
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                >
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  Conflict
                                </Badge>
                              </div>
                            )} */}
                          </div>
                        </CardContent>
                        <div className="border-t p-4 flex justify-between">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </Card>
                    ))}
                  
                  {labourDetails && labourDetails.length > 5 && (
                    <Card className="overflow-hidden flex flex-col justify-center items-center p-6 cursor-pointer" onClick={() => router.push('/contractor/team')}>
                      <div className="text-center space-y-4">
                        <div className="bg-primary/10 rounded-full p-3 inline-block">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">View All Labourers</h3>
                          <p className="text-sm text-muted-foreground">{labourDetails.length - 5} more labourers</p>
                        </div>
                        <Button asChild >
                          See All Labourers
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="contracts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Contracts</CardTitle>
                  <CardDescription>Your currently active contracts with mill owners</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contractDetails
                      .filter((contract:any) => contract.status === "ACTIVE")
                      .map((contract:any) => (
                        <div
                          key={contract._id}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                              <FileCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Contract with {contract.millOwner.Name}</p>
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
            <TabsContent value="conflicts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Conflict Warnings</CardTitle>
                  <CardDescription>Labourers with potential conflicts that need resolution</CardDescription>
                </CardHeader>
                <CardContent>
                  {contractorLabourers.filter((labourer) => labourer.conflicts).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                      <h3 className="text-lg font-medium">No Conflicts Found</h3>
                      <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
                        All your labourers have been verified and no conflicts were detected.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {contractorLabourers
                        .filter((labourer) => labourer.conflicts)
                        .map((labourer) => (
                          <div key={labourer.id} className="rounded-lg border p-4">
                            <div className="flex items-center gap-4 mb-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={labourer.photoUrl || "/placeholder.svg"} alt={labourer.name} />
                                <AvatarFallback>{labourer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{labourer.name}</h3>
                                <p className="text-sm text-muted-foreground">Aadhar: {labourer.aadharNumber}</p>
                              </div>
                              <Badge
                                variant="outline"
                                className="ml-auto bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              >
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Conflict
                              </Badge>
                            </div>
                            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20 mb-4">
                              <h4 className="font-medium mb-2">Conflict Details:</h4>
                              <p className="text-sm mb-2">
                                This labourer appears to be engaged in multiple active contracts:
                              </p>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Contract with Ganesh Sugar Mills (Your contract)</li>
                                <li>Contract with Krishna Sugar Factory (Another contractor)</li>
                              </ul>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Contact Mill Owner</Button>
                              <Button>Resolve Conflict</Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}


export default withAuth(ContractorDashboardPage);