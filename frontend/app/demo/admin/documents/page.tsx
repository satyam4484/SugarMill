"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockContracts, mockLabourers } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"
import { Download, Eye, FileCheck, FileText, Fingerprint, ImageIcon, Search, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminDocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  // Sample document data
  const documents = [
    {
      id: "1",
      name: "Contract_Ganesh_Sugar_Mills_001.pdf",
      type: "contract",
      relatedTo: "Ganesh Sugar Mills & Rajesh Kumar",
      uploadedBy: "Admin",
      uploadedDate: "2024-01-15",
      size: "2.4 MB",
    },
    {
      id: "2",
      name: "Aadhar_Verification_Batch_Jan2024.pdf",
      type: "verification",
      relatedTo: "Multiple Labourers",
      uploadedBy: "System",
      uploadedDate: "2024-01-20",
      size: "5.8 MB",
    },
    {
      id: "3",
      name: "Biometric_Database_Backup_Q1_2024.zip",
      type: "biometric",
      relatedTo: "System Backup",
      uploadedBy: "System",
      uploadedDate: "2024-03-31",
      size: "128 MB",
    },
    {
      id: "4",
      name: "Contract_Krishna_Sugar_Factory_002.pdf",
      type: "contract",
      relatedTo: "Krishna Sugar Factory & Sunil Patil",
      uploadedBy: "Admin",
      uploadedDate: "2024-02-10",
      size: "2.1 MB",
    },
    {
      id: "5",
      name: "Labourer_Photo_Batch_Feb2024.zip",
      type: "photo",
      relatedTo: "Multiple Labourers",
      uploadedBy: "Contractor",
      uploadedDate: "2024-02-15",
      size: "45 MB",
    },
    {
      id: "6",
      name: "Conflict_Resolution_Report_Mar2024.pdf",
      type: "report",
      relatedTo: "System Generated",
      uploadedBy: "System",
      uploadedDate: "2024-03-15",
      size: "1.2 MB",
    },
  ]

  // Filter documents based on search term and type
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.relatedTo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || doc.type === typeFilter

    return matchesSearch && matchesType
  })

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Document Storage</h1>
          <p className="text-muted-foreground">
            Access and manage all documents uploaded to the platform, including contracts, verification documents, and
            more.
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
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="contracts">Contracts</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search documents..."
                    className="w-[200px] pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="contract">Contracts</SelectItem>
                    <SelectItem value="verification">Verification</SelectItem>
                    <SelectItem value="biometric">Biometric</SelectItem>
                    <SelectItem value="photo">Photos</SelectItem>
                    <SelectItem value="report">Reports</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Documents</CardTitle>
                  <CardDescription>All documents uploaded to the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Related To</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10">
                                {doc.type === "contract" ? (
                                  <FileText className="h-5 w-5 text-primary" />
                                ) : doc.type === "verification" ? (
                                  <FileCheck className="h-5 w-5 text-primary" />
                                ) : doc.type === "biometric" ? (
                                  <Fingerprint className="h-5 w-5 text-primary" />
                                ) : doc.type === "photo" ? (
                                  <ImageIcon className="h-5 w-5 text-primary" />
                                ) : (
                                  <FileText className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <span className="font-medium">{doc.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                doc.type === "contract"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : doc.type === "verification"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : doc.type === "biometric"
                                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                      : doc.type === "photo"
                                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                              }
                            >
                              {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{doc.relatedTo}</TableCell>
                          <TableCell>{doc.uploadedBy}</TableCell>
                          <TableCell>{formatDate(doc.uploadedDate)}</TableCell>
                          <TableCell>{doc.size}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contracts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Documents</CardTitle>
                  <CardDescription>All contract documents uploaded to the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contract Name</TableHead>
                        <TableHead>Mill Owner</TableHead>
                        <TableHead>Contractor</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockContracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <span className="font-medium">Contract #{contract.id}</span>
                            </div>
                          </TableCell>
                          <TableCell>{contract.millOwnerName}</TableCell>
                          <TableCell>{contract.contractorName}</TableCell>
                          <TableCell>{formatDate(contract.startDate)}</TableCell>
                          <TableCell>{formatDate(contract.endDate)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                contract.status === "active"
                                  ? "default"
                                  : contract.status === "pending"
                                    ? "outline"
                                    : contract.status === "completed"
                                      ? "secondary"
                                      : "destructive"
                              }
                            >
                              {contract.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Documents</CardTitle>
                  <CardDescription>Aadhar cards, photos, and biometric data for labourers</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Labourer</TableHead>
                        <TableHead>Aadhar</TableHead>
                        <TableHead>Photo</TableHead>
                        <TableHead>Biometric</TableHead>
                        <TableHead>Contractor</TableHead>
                        <TableHead>Verified On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLabourers.map((labourer) => (
                        <TableRow key={labourer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={labourer.photoUrl || "/placeholder.svg"} alt={labourer.name} />
                                <AvatarFallback>{labourer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{labourer.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            >
                              <FileCheck className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            >
                              <ImageIcon className="mr-1 h-3 w-3" />
                              Available
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {labourer.biometricVerified ? (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              >
                                <Fingerprint className="mr-1 h-3 w-3" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              >
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{labourer.contractorName}</TableCell>
                          <TableCell>{formatDate(labourer.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Reports</CardTitle>
                  <CardDescription>Generated reports and system logs</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Generated On</TableHead>
                        <TableHead>Generated By</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        {
                          id: "1",
                          name: "Monthly Subscription Report - April 2024",
                          type: "subscription",
                          generatedOn: "2024-04-01",
                          generatedBy: "System",
                          size: "1.2 MB",
                        },
                        {
                          id: "2",
                          name: "Conflict Resolution Report - April 2024",
                          type: "conflict",
                          generatedOn: "2024-04-01",
                          generatedBy: "System",
                          size: "0.8 MB",
                        },
                        {
                          id: "3",
                          name: "System Health Report - April 2024",
                          type: "system",
                          generatedOn: "2024-04-01",
                          generatedBy: "System",
                          size: "2.5 MB",
                        },
                        {
                          id: "4",
                          name: "User Activity Report - March 2024",
                          type: "activity",
                          generatedOn: "2024-03-31",
                          generatedBy: "Admin",
                          size: "3.2 MB",
                        },
                        {
                          id: "5",
                          name: "Verification Audit Report - March 2024",
                          type: "audit",
                          generatedOn: "2024-03-31",
                          generatedBy: "System",
                          size: "1.5 MB",
                        },
                      ].map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <span className="font-medium">{report.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                report.type === "subscription"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : report.type === "conflict"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    : report.type === "system"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : report.type === "activity"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              }
                            >
                              {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(report.generatedOn)}</TableCell>
                          <TableCell>{report.generatedBy}</TableCell>
                          <TableCell>{report.size}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
