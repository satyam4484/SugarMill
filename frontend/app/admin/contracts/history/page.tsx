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
import { useState } from "react"
import { CheckCircle, Eye, FileText, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminContractHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedContract, setSelectedContract] = useState<(typeof mockContracts)[0] | null>(null)

  // Filter completed or expired contracts
  const historyContracts = mockContracts.filter((contract) => {
    const matchesSearch =
      contract.millOwnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractorName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && contract.status === "completed") ||
      (statusFilter === "expired" && contract.status === "expired") ||
      (statusFilter === "rejected" && contract.status === "rejected")

    return (
      (contract.status === "completed" || contract.status === "expired" || contract.status === "rejected") &&
      matchesSearch &&
      matchesStatus
    )
  })

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Contract History</h1>
          <p className="text-muted-foreground">
            View completed, expired, and rejected contracts between mill owners and contractors.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contract History</CardTitle>
                <CardDescription>Past contracts on the platform</CardDescription>
              </div>
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
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyContracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No Contracts Found</h3>
                          <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
                            There are no contracts matching your search criteria.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    historyContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell>{contract.millOwnerName}</TableCell>
                        <TableCell>{contract.contractorName}</TableCell>
                        <TableCell>
                          {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                        </TableCell>
                        <TableCell>{formatCurrency(contract.advanceAmount)}</TableCell>
                        <TableCell>{contract.totalLabourers}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setSelectedContract(contract)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contract Details Dialog */}
        {selectedContract && (
          <Dialog open={!!selectedContract} onOpenChange={(open) => !open && setSelectedContract(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Contract Details</DialogTitle>
                <DialogDescription>
                  Contract #{selectedContract.id} between {selectedContract.millOwnerName} and{" "}
                  {selectedContract.contractorName}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Contract Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mill Owner:</span>
                      <span className="font-medium">{selectedContract.millOwnerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contractor:</span>
                      <span className="font-medium">{selectedContract.contractorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="font-medium">{formatDate(selectedContract.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End Date:</span>
                      <span className="font-medium">{formatDate(selectedContract.endDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Advance Amount:</span>
                      <span className="font-medium">{formatCurrency(selectedContract.advanceAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Labourers:</span>
                      <span className="font-medium">{selectedContract.totalLabourers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge className={getStatusColor(selectedContract.status)}>{selectedContract.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created On:</span>
                      <span className="font-medium">{formatDate(selectedContract.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Completion Details</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completion Date:</span>
                        <span className="font-medium">
                          {selectedContract.status === "completed" ? formatDate(selectedContract.endDate) : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reason:</span>
                        <span className="font-medium">
                          {selectedContract.status === "completed"
                            ? "Contract completed successfully"
                            : selectedContract.status === "expired"
                              ? "Contract period ended"
                              : "Contract was rejected"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Final Payment:</span>
                        <span className="font-medium">
                          {selectedContract.status === "completed"
                            ? formatCurrency(selectedContract.advanceAmount * 2)
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

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
              <DialogFooter>
                <Button className="ml-auto">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  )
}
