"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useState } from "react"
import { Save } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const handleSave = () => {
    setSaving(true)
    
    // Simulate saving
    setTimeout(() => {
      setSaving(false)
      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground">Configure platform settings and preferences.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure general platform settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Platform Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="platform-name">Platform Name</Label>
                        <Input id="platform-name" defaultValue="Sugar Mill Management System" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="platform-url">Platform URL</Label>
                        <Input id="platform-url" defaultValue="https://sugarmillmanagement.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Admin Email</Label>
                        <Input id="admin-email" defaultValue="admin@sugarmillmanagement.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="support-email">Support Email</Label>
                        <Input id="support-email" defaultValue="support@sugarmillmanagement.com" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Regional Settings</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="Asia/Kolkata">
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                            <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date-format">Date Format</Label>
                        <Select defaultValue="dd/MM/yyyy">
                          <SelectTrigger id="date-format">
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select defaultValue="INR">
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                            <SelectItem value="USD">US Dollar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                            <SelectItem value="GBP">British Pound (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="mr">Marathi</SelectItem>
                            <SelectItem value="ta">Tamil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">Contact Phone</Label>
                        <Input id="contact-phone" defaultValue="+91 1234567890" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-address">Contact Address</Label>
                        <Input id="contact-address" defaultValue="123 Main Street, Mumbai, Maharashtra" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="about">About</Label>
                        <Textarea
                          id="about"
                          defaultValue="Sugar Mill Management System is a comprehensive platform for managing labour contracts and verification in sugar mills."
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure security settings for the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Authentication</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Require two-factor authentication for all admin users
                          </p>
                        </div>
                        <Switch id="two-factor" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="password-expiry">Password Expiry</Label>
                          <p className="text-sm text-muted-foreground">
                            Force password reset every 90 days for all users
                          </p>
                        </div>
                        <Switch id="password-expiry" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="session-timeout">Session Timeout</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically log out users after 30 minutes of inactivity
                          </p>
                        </div>
                        <Switch id="session-timeout" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Password Policy</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="min-length">Minimum Password Length</Label>
                          <p className="text-sm text-muted-foreground">
                            Require passwords to be at least 8 characters long
                          </p>
                        </div>
                        <Switch id="min-length" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="complexity">Password Complexity</Label>
                          <p className="text-sm text-muted-foreground">
                            Require passwords to include uppercase, lowercase, numbers, and special characters
                          </p>
                        </div>
                        <Switch id="complexity" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="history">Password History</Label>
                          <p className="text-sm text-muted-foreground">
                            Prevent reuse of the last 5 passwords
                          </p>
                        </div>
                        <Switch id="history" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Login Security</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="lockout">Account Lockout</Label>
                          <p className="text-sm text-muted-foreground">
                            Lock account after 5 failed login attempts
                          </p>
                        </div>
                        <Switch id="lockout" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="ip-restriction">IP Restriction</Label>
                          <p className="text-sm text-muted-foreground">
                            Restrict admin access to specific IP addresses
                          </p>
                        </div>
                        <Switch id="ip-restriction" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="login-notification">Login Notification</Label>
                          <p className="text-sm text-muted-foreground">
                            Send email notification for new login from unknown device
                          </p>
                        </div>
                        <Switch id="login-notification" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure notification settings for the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="new-user">New User Registration</Label>
                          <p className="text-sm text-muted-foreground">
                            Send email when a new user registers on the platform
                          </p>
                        </div>
                        <Switch id="new-user" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="new-contract">New Contract Creation</Label>
                          <p className="text-sm text-muted-foreground">
                            Send email when a new contract is created
                          </p>
                        </div>
                        <Switch id="new-contract" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="conflict-detection">Conflict Detection</Label>
                          <p className="text-sm text-muted-foreground">
                            Send email when a conflict is detected in contracts
                          </p>
                        </div>
                        <Switch id="conflict-detection" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="subscription-expiry">Subscription Expiry</Label>
                          <p className="text-sm text-muted-foreground">
                            Send email when a subscription is about to expire
                          </p>
                        </div>
                        <Switch id="subscription-expiry" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">System Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="system-updates">System Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Send notification for system updates and maintenance
                          </p>
                        </div>
                        <Switch id="system-updates" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="security-alerts">Security Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Send notification for security alerts and breaches
                          </p>
                        </div>
                        <Switch id="security-alerts" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Configure the appearance of the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add appearance settings content here */}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Configure advanced platform settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add advanced settings content here */}
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
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
