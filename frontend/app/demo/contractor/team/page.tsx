"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockLabourers } from "@/lib/mock-data"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { useState } from "react"
import { AlertTriangle, CheckCircle, Edit, FileUp, Fingerprint, Plus, Search, Trash, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function ContractorTeamPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showBiometricCapture, setShowBiometricCapture] = useState(false)
  const [captureComplete, setCaptureComplete] = useState(false)

  // Filter labourers based on search term and status
  const filteredLabourers = mockLabourers.filter((labourer) => {
    const matchesSearch =
      labourer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labourer.aadharNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labourer.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || labourer.status === statusFilter

    return matchesSearch && matchesStatus && labourer.contractorId === "1" // Only show labourers for this contractor (ID 1)
  })

  const handleCaptureBiometric = () => {
    setShowBiometricCapture(true)

    // Simulate biometric capture process
    setTimeout(() => {
      setCaptureComplete(true)

      toast({
        title: "Biometric Captured",
        description: "Thumbprint has been successfully captured and verified.",
      })
    }, 2000)
  }

  const handleAddLabourer = () => {
    toast({
      title: "Labourer Added",
      description: "New labourer has been added to your team.",
    })
  }

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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Labourer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Add New Labourer</DialogTitle>
                      <DialogDescription>
                        Enter the details of the new labourer to add them to your team.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" placeholder="Enter full name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="aadhar">Aadhar Number</Label>
                          <Input id="aadhar" placeholder="XXXX XXXX XXXX" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="+91 XXXXX XXXXX" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input id="age" type="number" placeholder="Enter age" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select defaultValue="male">
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Upload Photo</Label>
                          <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                            <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">
                              Drag and drop a photo here, or click to browse
                            </p>
                            <Button variant="outline" size="sm">
                              <Upload className="mr-2 h-4 w-4" />
                              Browse Files
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Biometric Thumbprint</Label>
                          {!showBiometricCapture ? (
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                              <Fingerprint className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground mb-2">
                                Capture the labourer's thumbprint for verification
                              </p>
                              <Button variant="outline" size="sm" onClick={handleCaptureBiometric}>
                                <Fingerprint className="mr-2 h-4 w-4" />
                                Capture Thumbprint
                              </Button>
                            </div>
                          ) : (
                            <div className="border rounded-lg p-6 flex flex-col items-center justify-center">
                              {!captureComplete ? (
                                <>
                                  <div className="animate-pulse">
                                    <Fingerprint className="h-12 w-12 text-primary mb-2" />
                                  </div>
                                  <p className="text-sm font-medium mb-2">Scanning Thumbprint...</p>
                                  <p className="text-xs text-muted-foreground">
                                    Please keep the thumb pressed on the scanner
                                  </p>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                                  <p className="text-sm font-medium mb-2">Thumbprint Captured Successfully</p>
                                  <p className="text-xs text-muted-foreground">
                                    Biometric data has been verified and stored
                                  </p>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={handleAddLabourer}>Add Labourer</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="list" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>List of all labourers in your team</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Aadhar Number</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Biometric</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Conflicts</TableHead>
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
                          <TableCell>
                            <Badge variant={labourer.status === "active" ? "default" : "destructive"}>
                              {labourer.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {labourer.conflicts ? (
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
                                None
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
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

            <TabsContent value="grid" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Grid view of all labourers in your team</CardDescription>
                </CardHeader>
                <CardContent>
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
                              <span className="text-muted-foreground">Biometric:</span>
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
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <Badge variant={labourer.status === "active" ? "default" : "destructive"}>
                                {labourer.status}
                              </Badge>
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
