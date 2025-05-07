"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { type MillOwner, mockMillOwners } from "@/lib/mock-data"
import { ArrowLeft, Save, Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import withAuth from "@/hocs/withAuth"

function EditMillOwnerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [millOwner, setMillOwner] = useState<MillOwner | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    // In a real app, this would be an API call
    const foundMillOwner = mockMillOwners.find((m) => m.id === params.id)
    setMillOwner(foundMillOwner || null)

    if (foundMillOwner) {
      setExpiryDate(new Date(foundMillOwner.subscriptionExpiry))
    }
  }, [params.id])

  const handleChange = (field: keyof MillOwner, value: any) => {
    if (millOwner) {
      setMillOwner({ ...millOwner, [field]: value })
    }
  }

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Mill Owner updated",
        description: "The mill owner details have been successfully updated.",
      })
      router.push("/admin/users")
    }, 1000)
  }

  const handleDelete = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Mill Owner deleted",
        description: "The mill owner has been successfully removed from the platform.",
        variant: "destructive",
      })
      router.push("/admin/users")
    }, 1000)
  }

  if (!millOwner) {
    return (
      <DashboardLayout role="admin">
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold tracking-tight">Mill Owner Not Found</h1>
          <p>The mill owner you are looking for does not exist or you do not have permission to edit them.</p>
          <Button variant="outline" onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Mill Owner</h1>
            <p className="text-muted-foreground">Update the details of the sugar mill owner.</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mill Owner Information</CardTitle>
            <CardDescription>Update the details of the sugar mill owner registered on the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Mill Name</Label>
                <Input id="name" value={millOwner.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={millOwner.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={millOwner.phone} onChange={(e) => handleChange("phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={millOwner.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={millOwner.status}
                  onValueChange={(value: "active" | "inactive") => handleChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subscriptionStatus">Subscription Status</Label>
                <Select
                  value={millOwner.subscriptionStatus}
                  onValueChange={(value: "active" | "expired" | "pending") => handleChange("subscriptionStatus", value)}
                >
                  <SelectTrigger id="subscriptionStatus">
                    <SelectValue placeholder="Select subscription status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscriptionExpiry">Subscription Expiry</Label>
                <Calendar
                  selected=
                  setDate={(date) => {
                    setExpiryDate(date)
                    if (date) {
                      handleChange("subscriptionExpiry", date.toISOString().split("T")[0])
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalContracts">Total Contracts</Label>
                <Input
                  id="totalContracts"
                  type="number"
                  value={millOwner.totalContracts}
                  onChange={(e) => handleChange("totalContracts", Number.parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Mill Owner
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the mill owner from the platform and
                    remove all associated data including contracts.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}


export default withAuth(EditMillOwnerPage as React.ComponentType);
