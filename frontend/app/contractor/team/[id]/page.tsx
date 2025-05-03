"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { type Labourer } from "@/lib/mock-data"
import { ArrowLeft, Calendar, Edit, FileText, FingerprintIcon as FingerPrint, Phone, User } from "lucide-react"
import Image from "next/image"
import { labourers } from "@/network/agent"
import { HTTP_STATUS_CODE } from "@/lib/contants"
import withAuth from "@/hocs/withAuth"

// Add this to your imports
import { Eye } from "lucide-react"

function LabourerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [labourer, setLabourer] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getLabourDetailsHandler = async () => {
    try {
      const response = await labourers.getLabourById(id)
      if (response.status === HTTP_STATUS_CODE.OK) {
        setLabourer(response.data)
        setError(null)
      } else {
        setLabourer(null)
        setError('Failed to fetch labourer details')
      }
    } catch (error) {
      setLabourer(null)
      setError((error as any)?.message || 'An error occurred while fetching labourer details')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getLabourDetailsHandler()
    }
  }, [id])

  console.log("lbouu==",labourer)

  if (isLoading) {
    return (
      <DashboardLayout role="contractor">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading labourer details...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!labourer) {
    return (
      <DashboardLayout role="contractor">
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold tracking-tight">Labourer Not Found</h1>
          <p>The labourer you are looking for does not exist or you do not have permission to view their details.</p>
          <Button variant="outline" onClick={() => router.push("/contractor/team")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="contractor">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Labourer Details</h1>
            <p className="text-muted-foreground">View detailed information about your team member.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/contractor/team")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team
            </Button>
            <Button onClick={() => router.push(`/contractor/team/${id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Details
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Personal information and status.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary/10">
                <Image
                  src={`http://localhost:8000/${labourer.profilePicture}` || "/placeholder.jpg?height=128&width=128"}
                  alt={labourer.user.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">{labourer.user.name}</h3>
              <p className="text-muted-foreground mb-4">ID: {labourer.user.userId}</p>
              
              <div className="flex gap-2 mb-4">
                <Badge variant={labourer.isActive ? "default" : "secondary"}>
                  {labourer.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant={labourer.verificationStatus === "APPROVED" ? "outline" : "destructive"}>
                  {labourer.verificationStatus === "APPROVED" ? "Verified" : "Pending"}
                </Badge>
              </div>
              
              <Separator className="my-4" />
              
              <div className="w-full space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Age: {labourer.Age}, {labourer.Gender.charAt(0).toUpperCase() + labourer.Gender.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{labourer.user.contactNo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Aadhar: {labourer.documents.aadhar.aadharNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Pancard: {labourer.documents.pancard.panNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Joined: {new Date(labourer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Biometric verification and document status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                      <FingerPrint className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Verification Status</h4>
                      <p className="text-sm text-muted-foreground">Overall verification status</p>
                    </div>
                  </div>
                  <Badge variant={labourer.verificationStatus === "APPROVED" ? "default" : "destructive"}>
                    {labourer.verificationStatus}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Document Verification</h4>
                      <p className="text-sm text-muted-foreground">Aadhar and PAN verification</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <Badge variant={labourer.documents?.aadhar?.verified ? "default" : "destructive"}>
                        Aadhar {labourer.documents?.aadhar?.verified ? "Verified" : "Not Verified"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`http://localhost:8000/${labourer.documents.aadhar.aadharPhoto}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <Badge variant={labourer.documents?.pancard?.verified ? "default" : "destructive"}>
                        PAN {labourer.documents?.pancard?.verified ? "Verified" : "Not Verified"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`http://localhost:8000/${labourer.documents.pancard.panPhoto}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
                {/* <Separator /> */}
{/* 
                <div>
                  <h4 className="font-medium mb-3">Attendance History</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 rounded-md bg-secondary/20">
                      <span>April 2024</span>
                      <span className="font-medium">22/30 days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-md bg-secondary/20">
                      <span>March 2024</span>
                      <span className="font-medium">28/31 days</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-md bg-secondary/20">
                      <span>February 2024</span>
                      <span className="font-medium">25/29 days</span>
                    </div>
                  </div>
                </div> */}

                {/* <Separator /> */}

                {/* <div>
                  <h4 className="font-medium mb-3">Contract Assignments</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 rounded-md bg-secondary/20">
                      <div>
                        <p className="font-medium">Ganesh Sugar Mills</p>
                        <p className="text-sm text-muted-foreground">Jan 2024 - Jun 2024</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-md bg-secondary/20">
                      <div>
                        <p className="font-medium">Krishna Sugar Factory</p>
                        <p className="text-sm text-muted-foreground">Jul 2023 - Dec 2023</p>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                  </div>
                </div> */}

                {/* <Separator />

                <div>
                  <h4 className="font-medium mb-3">Payment History</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 rounded-md bg-secondary/20">
                      <div>
                        <span className="font-medium">April 2024</span>
                        <p className="text-sm text-muted-foreground">22 working days</p>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">₹12,500</span>
                        <Badge className="ml-2" variant="outline">Pending</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-md bg-secondary/20">
                      <div>
                        <span className="font-medium">March 2024</span>
                        <p className="text-sm text-muted-foreground">28 working days</p>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">₹15,000</span>
                        <Badge className="ml-2" variant="default">Paid</Badge>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* <Separator /> */}

                {/* <div>
                  <h4 className="font-medium mb-3">Contract Assignments</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 rounded-md bg-secondary/20">
                      <div>
                        <p className="font-medium">Ganesh Sugar Mills</p>
                        <p className="text-sm text-muted-foreground">Jan 2024 - Jun 2024</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-md bg-secondary/20">
                      <div>
                        <p className="font-medium">Krishna Sugar Factory</p>
                        <p className="text-sm text-muted-foreground">Jul 2023 - Dec 2023</p>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>  
                  </div>
                </div> */}

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Emergency Contact</h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-md bg-secondary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{labourer.emergencyContact?.name || "Not provided"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{labourer.emergencyContact?.phone || "Not provided"}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Relation: {labourer.emergencyContact?.relation || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(LabourerDetailsPage as React.ComponentType);
