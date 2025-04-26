"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { mockLabourers } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useState } from "react"
import { AlertTriangle, CheckCircle, FileText, Fingerprint, Phone, Search, UserCircle, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SupervisorTeamPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLabourer, setSelectedLabourer] = useState<(typeof mockLabourers)[0] | null>(null)

  // Filter labourers for this team (using contractor ID 1 for demo)
  const teamLabourers = mockLabourers.filter((labourer) => labourer.contractorId === "1")

  // Filter labourers based on search term and status
  const filteredLabourers = teamLabourers.filter((labourer) => {
    const matchesSearch =
      labourer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labourer.aadharNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labourer.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || labourer.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const teamStats = {
    totalLabourers: teamLabourers.length,
    activeLabourers: teamLabourers.filter((l) => l.status === "active").length,
    inactiveLabourers: teamLabourers.filter((l) => l.status === "inactive").length,
    verifiedLabourers: teamLabourers.filter((l) => l.biometricVerified).length,
    pendingVerification: teamLabourers.filter((l) => !l.biometricVerified).length,
    conflicts: teamLabourers.filter((l) => l.conflicts).length,
  }

  return (
    <DashboardLayout role="supervisor">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Team Overview</h1>
          <p className="text-muted-foreground">View and manage your team members and their details.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats.totalLabourers}</div>
              <p className="text-xs text-muted-foreground">
                {teamStats.activeLabourers} active, {teamStats.inactiveLabourers} inactive
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verification Status</CardTitle>
              <Fingerprint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamStats.verifiedLabourers} / {teamStats.totalLabourers}
              </div>
              <p className="text-xs text-muted-foreground">{teamStats.pendingVerification} pending verification</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Conflicts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamStats.conflicts}</div>
              <p className="text-xs text-muted-foreground">
                {teamStats.conflicts > 0 ? `${teamStats.conflicts} labourers with conflicts` : "No conflicts detected"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>View all labourers in your team</CardDescription>
                </div>
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                </TabsList>

                <TabsContent value="list" className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Aadhar Number</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verification</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLabourers.map((labourer) => (
                        <TableRow key={labourer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={labourer.photoUrl || "/placeholder.svg"} alt={labourer.name} />
                                <AvatarFallback>{labourer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{labourer.name}</p>
                                <p className="text-xs text-muted-foreground">{labourer.phone}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{labourer.aadharNumber}</TableCell>
                          <TableCell>{labourer.age}</TableCell>
                          <TableCell>{labourer.gender}</TableCell>
                          <TableCell>
                            <Badge variant={labourer.status === "active" ? "default" : "destructive"}>
                              {labourer.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {labourer.biometricVerified ? (
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
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedLabourer(labourer)}>
                              <UserCircle className="mr-2 h-4 w-4" />
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="grid" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredLabourers.map((labourer) => (
                      <Card key={labourer.id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={labourer.photoUrl || "/placeholder.svg"} alt={labourer.name} />
                              <AvatarFallback>{labourer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{labourer.name}</CardTitle>
                              <CardDescription>{labourer.phone}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Aadhar:</span>
                              <span>{labourer.aadharNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Age:</span>
                              <span>{labourer.age} years</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Gender:</span>
                              <span>{labourer.gender}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <Badge variant={labourer.status === "active" ? "default" : "destructive"}>
                                {labourer.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Verification:</span>
                              {labourer.biometricVerified ? (
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
                            {labourer.conflicts && (
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
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="border-t p-4 flex justify-end">
                          <Button size="sm" onClick={() => setSelectedLabourer(labourer)}>
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Team Verification Status</CardTitle>
              <CardDescription>Overview of team verification and documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between items-center">
                    <p className="text-sm font-medium">Biometric Verification</p>
                    <p className="text-sm text-muted-foreground">
                      {teamStats.verifiedLabourers} of {teamStats.totalLabourers} verified
                    </p>
                  </div>
                  <Progress value={(teamStats.verifiedLabourers / teamStats.totalLabourers) * 100} className="h-2" />
                </div>
                <div>
                  <div className="mb-2 flex justify-between items-center">
                    <p className="text-sm font-medium">Document Verification</p>
                    <p className="text-sm text-muted-foreground">
                      {teamStats.totalLabourers} of {teamStats.totalLabourers} verified
                    </p>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="mb-2 flex justify-between items-center">
                    <p className="text-sm font-medium">Conflict Resolution</p>
                    <p className="text-sm text-muted-foreground">
                      {teamStats.conflicts > 0
                        ? `${teamStats.conflicts} conflicts to resolve`
                        : "All conflicts resolved"}
                    </p>
                  </div>
                  <Progress
                    value={
                      teamStats.conflicts > 0
                        ? ((teamStats.totalLabourers - teamStats.conflicts) / teamStats.totalLabourers) * 100
                        : 100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {selectedLabourer && (
          <Dialog open={!!selectedLabourer} onOpenChange={(open) => !open && setSelectedLabourer(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Labourer Details</DialogTitle>
                <DialogDescription>View complete details for {selectedLabourer.name}</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedLabourer.photoUrl || "/placeholder.svg"} alt={selectedLabourer.name} />
                      <AvatarFallback>{selectedLabourer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{selectedLabourer.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {selectedLabourer.phone}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Personal Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Age</p>
                          <p className="font-medium">{selectedLabourer.age} years</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Gender</p>
                          <p className="font-medium">{selectedLabourer.gender}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Aadhar Number</p>
                          <p className="font-medium">{selectedLabourer.aadharNumber}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <Badge variant={selectedLabourer.status === "active" ? "default" : "destructive"}>
                            {selectedLabourer.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Verification Status</h4>
                      <div className="rounded-lg border p-3">
                        {selectedLabourer.biometricVerified ? (
                          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            <p className="font-medium">Biometrically Verified</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                            <Fingerprint className="h-4 w-4" />
                            <p className="font-medium">Verification Pending</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Documents</h4>
                    <div className="rounded-lg border p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <p>Aadhar Card</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>

                  {selectedLabourer.conflicts && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Conflict Warning</h4>
                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                        <div className="flex items-center gap-2 mb-2 text-red-600 dark:text-red-400">
                          <AlertTriangle className="h-4 w-4" />
                          <p className="font-medium">Contract Conflict Detected</p>
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          This labourer appears to be engaged in multiple active contracts. Please resolve this conflict
                          with the contractor before proceeding.
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline">Mark Attendance</Button>
                      <Button variant="outline">Contact</Button>
                      <Button variant="outline">View History</Button>
                      <Button variant="outline">Generate Report</Button>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedLabourer(null)}>
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
