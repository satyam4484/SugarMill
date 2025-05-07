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
import { AlertTriangle, CheckCircle, Eye, FileText, Search, X } from "lucide-react"

export default function AdminActiveContractsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContract, setSelectedContract] = useState<(typeof mockContracts)[0] | null>(null)

  // Filter active contracts
  const activeContracts = mockContracts.filter(
    (contract) =>
      contract.status === "active" &&
      (contract.millOwnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractorName.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Active Contracts</h1>
          <p className="text-muted-foreground">
            View and manage all active labour contracts between mill owners and contractors.
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
                <CardTitle>Active Contracts</CardTitle>
                <CardDescription>Currently active contracts on the platform</CardDescription>
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
                    <TableHead>Conflict</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeContracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No Active Contracts Found</h3>
                          <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
                            There are no active contracts matching your search criteria.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell>{contract.millOwnerName}</TableCell>
                        <TableCell>{contract.contractorName}</TableCell>
                        <TableCell>
                          {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                        </TableCell>
                        <TableCell>{formatCurrency(contract.advanceAmount)}</TableCell>
                        <TableCell>{contract.totalLabourers}</TableCell>
                        <TableCell>
                          {contract.conflicts ? (
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
                  <h3 className="text-lg font-medium mb-2">Verification Status</h3>
                  {selectedContract.conflicts ? (
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
                          <span className="font-medium">April 15, 2024</span>
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
                {selectedContract.conflicts ? (
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
                  <Button className="sm:ml-auto">
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
