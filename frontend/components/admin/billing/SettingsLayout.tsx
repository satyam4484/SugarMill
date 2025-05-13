import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    CreditCard,
    Download,
    FileText,
    Receipt,
    Settings,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SettingsLayout() {
    return (
        <TabsContent value="settings" className="space-y-4">
              <Card className="flex flex-row items-center justify-between">
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
    )
}