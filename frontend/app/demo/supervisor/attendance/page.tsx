"use client"

import { Label } from "@/components/ui/label"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockLabourers, mockAttendance } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import { useState } from "react"
import { CalendarIcon, CheckCircle, Download, Filter, Fingerprint, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function SupervisorAttendancePage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [date, setDate] = useState<Date>(new Date())
  const [showBiometricCapture, setShowBiometricCapture] = useState(false)
  const [captureComplete, setCaptureComplete] = useState(false)
  const [selectedLabourer, setSelectedLabourer] = useState<string | null>(null)

  // Filter labourers for this team (using contractor ID 1 for demo)
  const teamLabourers = mockLabourers.filter((labourer) => labourer.contractorId === "1")

  // Filter attendance records based on search term and status
  const filteredAttendance = mockAttendance.filter((record) => {
    const matchesSearch = record.labourerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || record.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleCaptureBiometric = (labourerId: string) => {
    setSelectedLabourer(labourerId)
    setShowBiometricCapture(true)

    // Simulate biometric capture process
    setTimeout(() => {
      setCaptureComplete(true)

      toast({
        title: "Biometric Verified",
        description: "Thumbprint has been successfully captured and verified.",
      })
    }, 2000)
  }

  const handleSaveAttendance = () => {
    toast({
      title: "Attendance Saved",
      description: "Today's attendance has been saved successfully.",
    })
  }

  return (
    <DashboardLayout role="supervisor">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground">Mark and manage attendance for your team members.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="mark" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
                <TabsTrigger value="history">Attendance History</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
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
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="half-day">Half Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="mark" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mark Today's Attendance</CardTitle>
                  <CardDescription>
                    Mark attendance for your team members for {format(new Date(), "MMMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Today: {format(new Date(), "MMMM d, yyyy")}</span>
                      </div>
                      <Button onClick={handleSaveAttendance}>Save Attendance</Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Labourer</TableHead>
                          <TableHead>Aadhar Number</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamLabourers.map((labourer) => (
                          <TableRow key={labourer.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={labourer.photoUrl || "/placeholder.svg"} alt={labourer.name} />
                                  <AvatarFallback>{labourer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{labourer.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{labourer.aadharNumber}</TableCell>
                            <TableCell>
                              <select
                                className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                defaultValue="present"
                              >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="half-day">Half Day</option>
                                <option value="leave">Leave</option>
                              </select>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => handleCaptureBiometric(labourer.id)}>
                                <Fingerprint className="mr-2 h-4 w-4" />
                                Verify
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {showBiometricCapture && (
                <Card>
                  <CardHeader>
                    <CardTitle>Biometric Verification</CardTitle>
                    <CardDescription>Verify labourer's identity using biometric thumbprint</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center p-6">
                      {!captureComplete ? (
                        <>
                          <div className="animate-pulse">
                            <Fingerprint className="h-24 w-24 text-primary mb-4" />
                          </div>
                          <p className="text-lg font-medium mb-2">Scanning Thumbprint...</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Please ask the labourer to place their thumb on the scanner
                          </p>
                          <div className="w-full max-w-xs bg-muted rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full animate-[progress_2s_ease-in-out_infinite]"
                              style={{ width: "70%" }}
                            ></div>
                          </div>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-24 w-24 text-green-500 mb-4" />
                          <p className="text-lg font-medium mb-2">Verification Successful</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Labourer's identity has been verified successfully
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowBiometricCapture(false)
                                setCaptureComplete(false)
                                setSelectedLabourer(null)
                              }}
                            >
                              Close
                            </Button>
                            <Button>Mark as Present</Button>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Attendance History</CardTitle>
                    <CardDescription>View past attendance records</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <Button variant="outline">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Labourer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verified By</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.labourerName}</TableCell>
                          <TableCell>{format(new Date(record.date), "MMM d, yyyy")}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                record.status === "present"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : record.status === "absent"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.verifiedBy}</TableCell>
                          <TableCell>{record.notes || "-"}</TableCell>
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
                  <CardTitle>Attendance Reports</CardTitle>
                  <CardDescription>Generate and download attendance reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Daily Report</CardTitle>
                          <CardDescription>Attendance report for a specific day</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <Label>Select Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !date && "text-muted-foreground",
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : "Pick a date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                        </CardContent>
                        <CardContent className="pt-0">
                          <Button className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Generate Report
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Weekly Report</CardTitle>
                          <CardDescription>Attendance report for a specific week</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <Label>Select Week</Label>
                              <Select defaultValue="current">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select week" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="current">Current Week</SelectItem>
                                  <SelectItem value="previous">Previous Week</SelectItem>
                                  <SelectItem value="twoWeeksAgo">Two Weeks Ago</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                        <CardContent className="pt-0">
                          <Button className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Generate Report
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Monthly Report</CardTitle>
                          <CardDescription>Attendance report for a specific month</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <Label>Select Month</Label>
                              <Select defaultValue="current">
                                <SelectTrigger>
                                  <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="current">Current Month</SelectItem>
                                  <SelectItem value="previous">Previous Month</SelectItem>
                                  <SelectItem value="twoMonthsAgo">Two Months Ago</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                        <CardContent className="pt-0">
                          <Button className="w-full">
                            <Download className="mr-2 h-4 w-4" />
                            Generate Report
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Custom Report</CardTitle>
                        <CardDescription>Generate a custom attendance report</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {date ? format(date, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !date && "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {date ? format(date, "PPP") : "Pick a date"}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2">
                            <Label>Labourers</Label>
                            <Select defaultValue="all">
                              <SelectTrigger>
                                <SelectValue placeholder="Select labourers" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Labourers</SelectItem>
                                <SelectItem value="active">Active Labourers</SelectItem>
                                <SelectItem value="selected">Selected Labourers</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Report Format</Label>
                            <Select defaultValue="pdf">
                              <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="excel">Excel</SelectItem>
                                <SelectItem value="csv">CSV</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                      <CardContent className="pt-0 flex justify-end">
                        <Button>
                          <Download className="mr-2 h-4 w-4" />
                          Generate Custom Report
                        </Button>
                      </CardContent>
                    </Card>
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
