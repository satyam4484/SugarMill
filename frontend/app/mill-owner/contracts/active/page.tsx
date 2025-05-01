"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockContracts } from "@/lib/mock-data"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle, Eye, FileCheck, FileText, Pencil, Search, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import withAuth from "@/hocs/withAuth"
import { ContractDetails } from "@/network/agent"
import { HTTP_STATUS_CODE } from "@/lib/contants"

function AdminContractsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedContract, setSelectedContract] = useState<any[]>([]);
  const [viewContractDetails,setViewContractDetails] = useState<any>(null);

  // Filter contracts based on search term and status
  const filteredContracts = selectedContract.filter((contract) => {
    const matchesSearch =
      contract.millOwner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractor?.user?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || contract.status === statusFilter

    return matchesSearch && matchesStatus
  })
  const getAllContractsHandler = async () => {
    try {
      const response = await ContractDetails.getAllContract();
      if(response.status === HTTP_STATUS_CODE.OK){
        console.log("response", response.data)
        setSelectedContract(response.data.data);
      }
    } catch (error) {
      console.log("error", error)
    }
  }
  

  useEffect(() => {
    getAllContractsHandler();
  },[])

  // Contracts with conflicts
  const conflictContracts = filteredContracts.filter((contract) => contract.conflicts)

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Contract Validation</h1>
          <p className="text-muted-foreground">
            Review and validate labour contracts between mill owners and contractors.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="all">All Contracts</TabsTrigger>
                <TabsTrigger value="conflicts">
                  Conflicts
                  {conflictContracts.length > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {conflictContracts.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search contracts..."
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
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    {/* <SelectItem value="expired">Expired</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Contracts</CardTitle>
                  <CardDescription>Review all contracts between mill owners and contractors.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mill Owner</TableHead>
                        <TableHead>Contractor</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Advance</TableHead>
                        <TableHead>Labourers</TableHead>
                        <TableHead>Status</TableHead>
                        {/* <TableHead>Conflict</TableHead>  */}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContracts.length > 0 && filteredContracts.map((contract: any) => (
                        <TableRow key={contract._id}>
                          <TableCell>{contract.millOwner?.name}</TableCell>
                          <TableCell>{contract.contractor?.user?.name}</TableCell>
                          <TableCell>
                            {formatDate(new Date(contract.startDate).toISOString())} - {formatDate(new Date(contract.endDate).toISOString())}
                          </TableCell>
                          <TableCell>{formatCurrency(contract?.advanceAmount)}</TableCell>
                          <TableCell>{contract.totalLabourers}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(contract?.status)}>{contract?.status}</Badge>
                          </TableCell>
                          {/* <TableCell>
                            {contract?.conflicts ? (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              >
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Conflict
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Verified
                              </Badge>
                            )}
                          </TableCell> */}
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => setViewContractDetails(contract)}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              {/* <Button variant="ghost" size="icon" onClick={() => handleEditContract(contract)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button> */}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conflicts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Conflict Warnings</CardTitle>
                  <CardDescription>Contracts with potential conflicts that need review and resolution.</CardDescription>
                </CardHeader>
                <CardContent>
                  {conflictContracts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                      <h3 className="text-lg font-medium">No Conflicts Found</h3>
                      <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
                        All contracts have been verified and no conflicts were detected.
                      </p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mill Owner</TableHead>
                          <TableHead>Contractor</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Labourers</TableHead>
                          <TableHead>Conflict Type</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {conflictContracts.map((contract: any) => (
                          <TableRow key={contract.id}>
                            <TableCell>{contract.millOwnerName}</TableCell>
                            <TableCell>{contract.contractorName}</TableCell>
                            <TableCell>
                              {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                            </TableCell>
                            <TableCell>{contract.totalLabourers}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              >
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Labourer Overlap
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => setSelectedContract(contract)}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <FileCheck className="h-4 w-4" />
                                  <span className="sr-only">Resolve</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Contract Details Dialog */}
        {viewContractDetails && (
          <Dialog open={!!viewContractDetails} onOpenChange={(open) => !open && setViewContractDetails(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Contract Details</DialogTitle>
                <DialogDescription>
                  Contract #{viewContractDetails._id} between {viewContractDetails.millOwner?.name} and{" "}
                  {viewContractDetails.contractor?.user?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Contract Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mill Owner:</span>
                      <span className="font-medium">{viewContractDetails.millOwner?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contractor:</span>
                      <span className="font-medium">{viewContractDetails.contractor?.user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="font-medium">{formatDate(new Date(viewContractDetails.startDate).toISOString())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End Date:</span>
                      <span className="font-medium">{formatDate(new Date(viewContractDetails.endDate).toISOString())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Advance Amount:</span>
                      <span className="font-medium">{formatCurrency(viewContractDetails.advanceAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Labourers:</span>
                      <span className="font-medium">{viewContractDetails.totalLabourers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(viewContractDetails.status)}>{viewContractDetails.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created On:</span>
                      <span className="font-medium">{formatDate(viewContractDetails.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Verification Status</h3>
                  {viewContractDetails.conflicts ? (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        <h4 className="font-medium text-red-600 dark:text-red-400">Conflict Detected</h4>
                      </div>
                      <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                        This contract has potential conflicts that need to be resolved.
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Conflict Type:</span>
                          <span className="font-medium">Labourer Overlap</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Affected Labourers:</span>
                          <span className="font-medium">3</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Conflicting Contract:</span>
                          <span className="font-medium">Contract #3</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <h4 className="font-medium text-green-600 dark:text-green-400">Verified</h4>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                        This contract has been verified and no conflicts were detected.
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Verified On:</span>
                          <span className="font-medium">{formatDate(new Date(viewContractDetails.createdAt).toISOString())}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Verified By:</span>
                          <span className="font-medium">System</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Contract Document</h3>
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span>Contract_Agreement.pdf</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {viewContractDetails.conflicts ? (
                  <>
                    <Button variant="outline" className="sm:mr-auto">
                      <Eye className="mr-2 h-4 w-4" />
                      View Conflicts
                    </Button>
                    <Button variant="destructive">
                      <X className="mr-2 h-4 w-4" />
                      Reject Contract
                    </Button>
                    <Button>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Anyway
                    </Button>
                  </>
                ) : (
                  <Button className="sm:ml-auto" onClick={() => setViewContractDetails(null)}> 
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Close
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminContractsPage);