"use client"

import { Input } from "@/components/ui/input"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockSupervisorStats, mockLabourers, mockAttendance } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { AlertTriangle, ArrowUpRight, Calendar, CheckCircle, ClipboardCheck, MessageSquare, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SupervisorDashboardPage() {
  // Filter labourers for this team (using contractor ID 1 for demo)
  const teamLabourers = mockLabourers.filter((labourer) => labourer.contractorId === "1")

  return (
    <DashboardLayout role="supervisor">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Supervisor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Team Supervisor dashboard. Manage your team's attendance and performance.
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
              <CardTitle className="text-sm font-medium">Team Size</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSupervisorStats.teamSize}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+3</span> new members this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockSupervisorStats.presentToday} / {mockSupervisorStats.teamSize}
              </div>
              <p className="text-xs text-muted-foreground">{mockSupervisorStats.absentToday} absent today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSupervisorStats.averageAttendance}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+2%</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSupervisorStats.activeContracts}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+1</span> new contract this month
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
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Today's Attendance</CardTitle>
                    <CardDescription>Attendance status for today, {new Date().toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">Present</p>
                          <p className="text-sm text-muted-foreground">{mockSupervisorStats.presentToday} labourers</p>
                        </div>
                        <div className="font-bold">
                          {Math.round((mockSupervisorStats.presentToday / mockSupervisorStats.teamSize) * 100)}%
                        </div>
                      </div>
                      <Progress
                        value={(mockSupervisorStats.presentToday / mockSupervisorStats.teamSize) * 100}
                        className="h-2"
                      />

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">Absent</p>
                          <p className="text-sm text-muted-foreground">{mockSupervisorStats.absentToday} labourers</p>
                        </div>
                        <div className="font-bold">
                          {Math.round((mockSupervisorStats.absentToday / mockSupervisorStats.teamSize) * 100)}%
                        </div>
                      </div>
                      <Progress
                        value={(mockSupervisorStats.absentToday / mockSupervisorStats.teamSize) * 100}
                        className="h-2 bg-muted"
                      />

                      <div className="pt-4">
                        <Button>Mark Today's Attendance</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                    <CardDescription>Recent messages from the team chat</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Contractor" />
                          <AvatarFallback>RC</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">Rajesh Kumar (Contractor)</p>
                          <p className="text-sm text-muted-foreground">
                            Please ensure all labourers are present tomorrow for the new contract.
                          </p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Mill Owner" />
                          <AvatarFallback>MO</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">Mill Owner</p>
                          <p className="text-sm text-muted-foreground">
                            We need to increase the daily output. Please coordinate with your team.
                          </p>
                          <p className="text-xs text-muted-foreground">5 hours ago</p>
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Open Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Pending Tasks</CardTitle>
                    <CardDescription>Tasks that need your attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-yellow-100 dark:bg-yellow-900">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">Verify New Labourers</p>
                          <p className="text-sm text-muted-foreground">3 new labourers need biometric verification</p>
                        </div>
                        <div className="ml-auto">
                          <Button variant="outline" size="sm">
                            Complete
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900">
                          <ClipboardCheck className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">Submit Weekly Report</p>
                          <p className="text-sm text-muted-foreground">Weekly performance report is due tomorrow</p>
                        </div>
                        <div className="ml-auto">
                          <Button variant="outline" size="sm">
                            Complete
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-green-100 dark:bg-green-900">
                          <Users className="h-5 w-5 text-green-600 dark:text-green-300" />
                        </div>
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">Team Meeting</p>
                          <p className="text-sm text-muted-foreground">
                            Schedule team meeting for new contract briefing
                          </p>
                        </div>
                        <div className="ml-auto">
                          <Button variant="outline" size="sm">
                            Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Attendance</CardTitle>
                    <CardDescription>Attendance records for the past few days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Labourer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Verified By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockAttendance.slice(0, 5).map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.labourerName}</TableCell>
                            <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>All labourers in your team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {teamLabourers.map((labourer) => (
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
                          </div>
                        </CardContent>
                        <div className="border-t p-4 flex justify-between">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Mark Attendance
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="attendance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mark Attendance</CardTitle>
                  <CardDescription>Mark attendance for your team members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Today: {new Date().toLocaleDateString()}</span>
                      </div>
                      <Button>Save Attendance</Button>
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
                              <Button variant="outline" size="sm">
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
            </TabsContent>
            <TabsContent value="chat" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team Chat</CardTitle>
                  <CardDescription>Communicate with your team and contractors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg h-[400px] flex flex-col">
                    <div className="p-4 border-b">
                      <h3 className="font-medium">Team Communication</h3>
                    </div>
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Contractor" />
                          <AvatarFallback>RC</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                          <p className="text-xs text-muted-foreground mb-1">Rajesh Kumar (Contractor)</p>
                          <p className="text-sm">
                            Good morning team. We have a new contract starting tomorrow with Ganesh Sugar Mills. Please
                            ensure all labourers are present.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">9:30 AM</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 justify-end">
                        <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                          <p className="text-sm">
                            Understood. I'll make sure everyone is informed and ready for tomorrow.
                          </p>
                          <p className="text-xs text-primary-foreground/70 mt-1">9:35 AM</p>
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="You" />
                          <AvatarFallback>YO</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Mill Owner" />
                          <AvatarFallback>MO</AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                          <p className="text-xs text-muted-foreground mb-1">Mill Owner</p>
                          <p className="text-sm">
                            We need to increase the daily output. Please coordinate with your team to ensure we meet the
                            targets.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">10:15 AM</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input placeholder="Type your message..." className="flex-1" />
                        <Button>Send</Button>
                      </div>
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
