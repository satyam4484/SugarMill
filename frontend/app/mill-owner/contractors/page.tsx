"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { AlertTriangle, CheckCircle, Edit, FileUp, Fingerprint, List, Plus, Search, Trash, Upload, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import withAuth from "@/hocs/withAuth"
import GridView from "@/components/contractors/grid"
import ListView from "@/components/contractors/listView"
import AddForm from "@/components/contractors/form"
import { contractors } from "@/network/agent"
import { ContractorConstant } from "@/lib/contants"

function ContractorTeamPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [contractorDetails, setContractorDetails] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getContractorDetails = async () => {
    setIsLoading(true)
    try {
      const response = await contractors.getAllContractors()
      setContractorDetails(response.data)
    } catch (error) {
      console.error("Error fetching contractor details:", error)
      toast({
        title: "Error",
        description: "Failed to load contractor details. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    getContractorDetails()
  }, [])

  console.log("contractosr details", contractorDetails)

  const filteredcontractor = contractorDetails.filter((contractor) => {
    // Apply status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      if ((contractor).isActive !== isActive) return false;
    }
    
    // Apply search filter - search across multiple fields
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      return (
        // Search in user details
        contractor.user.name.toLowerCase().includes(search) ||
        contractor.user.email.toLowerCase().includes(search) ||
        contractor.user.contactNo.includes(search) ||
        // Search in document details
        contractor.documents.aadhar.aadharNumber.includes(search) ||
        contractor.documents.pancard.panNumber.toLowerCase().includes(search) ||
        // Search in other fields
        String(contractor.experience).includes(search) ||
        contractor.verificationStatus.toLowerCase().includes(search)
      );
    }
    
    return true; // Include all items if no search term
  });

  

  return (
    <DashboardLayout role="contractor">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">Manage your team of labourers and their details.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="list" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search labourers..."
                    className="w-[200px] pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {/* <AddForm/> */}
              </div>
            </div>

            <TabsContent value="list" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>List of all {ContractorConstant.NAME} in your team</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2 text-lg">Loading contractors...</span>
                    </div>
                  ) : contractorDetails.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No contractors found</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Owner Name</TableHead>
                          <TableHead>Location</TableHead>
                          {/* <TableHead>Aadhar Number</TableHead> */}
                          <TableHead>Status</TableHead>
                          <TableHead>Verifcation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredcontractor.map((contractor) => (
                          <ListView key={contractor._id} contractor={contractor}/>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grid" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Grid view of all labourers in your team</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2 text-lg">Loading contractors...</span>
                    </div>
                  ) : contractorDetails.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No contractors found</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredcontractor.map((contractor) => (
                        <GridView key={contractor._id} contractor={contractor} />
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

export default withAuth(ContractorTeamPage)