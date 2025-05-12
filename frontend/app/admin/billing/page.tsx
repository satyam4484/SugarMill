"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockInvoices, mockMillOwners } from "@/lib/mock-data"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"
import {
  ArrowUpRight,
  Calendar,
  Check,
  CreditCard,
  Download,
  FileText,
  Plus,
  Receipt,
  Search,
  Settings,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import withAuth from "@/hocs/withAuth"

function AdminBillingPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter invoices based on search term and status
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Billing</h1>
          <p className="text-muted-foreground">Manage mill owner subscriptions, invoices, and payments.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(1650000)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12%</span> from last year
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+5</span> since last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-yellow-500">+2</span> since last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-red-500">+1</span> since last week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="invoices" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
                <TabsTrigger value="settings">Billing Settings</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
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
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Invoice</DialogTitle>
                      <DialogDescription>Create a new invoice for a mill owner.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="mill-owner" className="text-right">
                          Mill Owner
                        </Label>
                        <Select>
                          <SelectTrigger id="mill-owner" className="col-span-3">
                            <SelectValue placeholder="Select mill owner" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockMillOwners.map((owner) => (
                              <SelectItem key={owner.id} value={owner.id}>
                                {owner.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                          Amount (₹)
                        </Label>
                        <Input id="amount" type="number" placeholder="50000" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="due-date" className="text-right">
                          Due Date
                        </Label>
                        <Input id="due-date" type="date" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Input id="description" placeholder="Monthly subscription" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Invoice</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="invoices" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Manage all invoices for mill owners</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Mill Owner</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Created On</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <span className="font-medium">INV-{invoice.id}</span>
                            </div>
                          </TableCell>
                          <TableCell>{invoice.userName}</TableCell>
                          <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                          <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <CreditCard className="h-4 w-4" />
                                <span className="sr-only">Mark as Paid</span>
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

            <TabsContent value="subscriptions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Subscriptions</CardTitle>
                  <CardDescription>Manage mill owner subscriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mill Owner</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockMillOwners.map((owner) => (
                        <TableRow key={owner.id}>
                          <TableCell>
                            <div className="font-medium">{owner.name}</div>
                            <div className="text-sm text-muted-foreground">{owner.email}</div>
                          </TableCell>
                          <TableCell>
                            {owner.id === "1" || owner.id === "2"
                              ? "Premium"
                              : owner.id === "3"
                                ? "Standard"
                                : owner.id === "4"
                                  ? "Enterprise"
                                  : "Basic"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                owner.subscriptionStatus === "active"
                                  ? "default"
                                  : owner.subscriptionStatus === "pending"
                                    ? "outline"
                                    : "destructive"
                              }
                            >
                              {owner.subscriptionStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(
                              new Date(
                                new Date(owner.subscriptionExpiry).getTime() - 365 * 24 * 60 * 60 * 1000,
                              ).toString(),
                            )}
                          </TableCell>
                          <TableCell>{formatDate(owner.subscriptionExpiry)}</TableCell>
                          <TableCell>
                            {formatCurrency(
                              owner.id === "1" || owner.id === "2"
                                ? 75000
                                : owner.id === "3"
                                  ? 50000
                                  : owner.id === "4"
                                    ? 100000
                                    : 25000,
                            )}
                            /year
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Renew
                              </Button>
                              <Button variant="outline" size="sm">
                                Edit
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

            <TabsContent value="plans" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Subscription Plans</CardTitle>
                    <CardDescription>Manage subscription plans and pricing</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Plan
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic</CardTitle>
                        <CardDescription>For small sugar mills</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-4">{formatCurrency(25000)}/year</div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Up to 5 contracts</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Basic conflict detection</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Document storage (5GB)</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Email support</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Edit Plan
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Standard</CardTitle>
                        <CardDescription>For medium sugar mills</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-4">{formatCurrency(50000)}/year</div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Up to 15 contracts</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Advanced conflict detection</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Document storage (15GB)</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Priority email support</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Edit Plan
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Premium</CardTitle>
                        <CardDescription>For large sugar mills</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-4">{formatCurrency(75000)}/year</div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Unlimited contracts</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Real-time conflict detection</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Document storage (50GB)</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>24/7 phone support</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Edit Plan
                        </Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Enterprise</CardTitle>
                        <CardDescription>For sugar mill groups</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold mb-4">{formatCurrency(100000)}/year</div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Unlimited contracts</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Advanced analytics</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Document storage (100GB)</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            <span>Dedicated account manager</span>
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          Edit Plan
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Settings</CardTitle>
                  <CardDescription>Configure billing settings and payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Payment Methods</h3>
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                              <CreditCard className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Online Payment Gateway</p>
                              <p className="text-sm text-muted-foreground">Accept payments via Razorpay</p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          >
                            Active
                          </Badge>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                              <Receipt className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">Manual Payment</p>
                              <p className="text-sm text-muted-foreground">Accept bank transfers and cheques</p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          >
                            Active
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Invoice Settings</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Company Name</Label>
                          <Input id="company-name" defaultValue="Sugar Mill Management System" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-address">Company Address</Label>
                          <Input id="company-address" defaultValue="123 Main Street, Mumbai, Maharashtra" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-gstin">GSTIN</Label>
                          <Input id="company-gstin" defaultValue="27AABCS1429B1ZB" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-pan">PAN</Label>
                          <Input id="company-pan" defaultValue="AABCS1429B" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Notification Settings</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="invoice-reminder">Invoice Reminder (days before due date)</Label>
                          <Input id="invoice-reminder" type="number" defaultValue="7" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="overdue-reminder">Overdue Reminder (days after due date)</Label>
                          <Input id="overdue-reminder" type="number" defaultValue="1" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subscription-reminder">Subscription Expiry Reminder (days before)</Label>
                          <Input id="subscription-reminder" type="number" defaultValue="30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>
                    <Settings className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(AdminBillingPage);