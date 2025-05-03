"use client"

import { useState, useEffect, use, useRef, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, FileUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { labourers } from "@/network/agent"
import { HTTP_STATUS_CODE } from "@/lib/contants"
import withAuth from "@/hocs/withAuth"
import Image from "next/image"

type FormErrors = {
  name?: string
  email?: string
  contactNo?: string
  age?: string
  gender?: string
  aadharNumber?: string
  panNumber?: string
  aadharPhoto?: string
  panPhoto?: string
  profilePicture?: string
}

function EditLabourerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<any>(null)

  const aadharFileRef = useRef<HTMLInputElement>(null)
  const panFileRef = useRef<HTMLInputElement>(null)
  const profileFileRef = useRef<HTMLInputElement>(null)

  const { toast } = useToast()

  const getLabourDetailsHandler = async () => {
    try {
      const response = await labourers.getLabourById(id)
      if (response.status === HTTP_STATUS_CODE.OK) {
        setFormData(response.data)
      } else {
        setFormData(null)
        toast({
          title: "Error",
          description: "Failed to fetch labourer details",
          variant: "destructive"
        })
      }
    } catch (error) {
      setFormData(null)
      toast({
        title: "Error",
        description: (error as any)?.message || "An error occurred while fetching labourer details",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getLabourDetailsHandler()
    }
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    if (id === "aadhar") {
      setFormData((prev: any) => ({
        ...prev,
        documents: {
          ...prev.documents,
          aadhar: {
            ...prev.documents.aadhar,
            aadharNumber: value
          }
        }
      }))
    } else if (id === "pancard") {
      setFormData((prev: any) => ({
        ...prev,
        documents: {
          ...prev.documents,
          pancard: {
            ...prev.documents.pancard,
            panNumber: value
          }
        }
      }))
    } else if (id === "name" || id === "email" || id === "contactNo") {
      setFormData((prev: any) => ({
        ...prev,
        user: {
          ...prev.user,
          [id]: value
        }
      }))
    } else if (id === "age") {
      setFormData((prev: any) => ({ ...prev, Age: value }))
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev: any) => ({ ...prev, Gender: value }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'aadhar' | 'pancard' | 'profile') => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string

      if (type === 'aadhar') {
        setFormData((prev: any) => ({
          ...prev,
          documents: {
            ...prev.documents,
            aadhar: {
              ...prev.documents.aadhar,
              aadharPhoto: base64String
            }
          }
        }))
      } else if (type === 'pancard') {
        setFormData((prev: any) => ({
          ...prev,
          documents: {
            ...prev.documents,
            pancard: {
              ...prev.documents.pancard,
              panPhoto: base64String
            }
          }
        }))
      } else if (type === 'profile') {
        setFormData((prev: any) => ({ ...prev, profilePicture: base64String }))
      }
    }
    reader.readAsDataURL(file)
  }

  const handleUpdate = async () => {
    setIsLoading(true)
    try {
      const response = await labourers.updateLabourer(id, formData)
      if (response.status === HTTP_STATUS_CODE.OK) {
        toast({
          title: "Success",
          description: "Labourer details updated successfully"
        })
        router.push(`/contractor/team/${id}`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as any)?.response?.data?.message || "Failed to update labourer",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  if (!formData) {
    return (
      <DashboardLayout role="contractor">
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl font-bold tracking-tight">Labourer Not Found</h1>
          <p>The labourer you are looking for does not exist or you do not have permission to edit them.</p>
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
            <h1 className="text-3xl font-bold tracking-tight">Edit Labourer</h1>
            <p className="text-muted-foreground">Update the details of your team member.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/contractor/team/${id}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Details
            </Button>
            <Button onClick={handleUpdate} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update basic details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.user.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.user.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNo">Phone Number</Label>
                <Input
                  id="contactNo"
                  value={formData.user.contactNo}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.Age}
                  onChange={handleInputChange}
                  placeholder="Enter age"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.Gender} onValueChange={handleSelectChange}>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents & Photos</CardTitle>
              <CardDescription>Update identification documents and photos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadhar">Aadhar Number</Label>
                <Input
                  id="aadhar"
                  value={formData.documents.aadhar.aadharNumber}
                  onChange={handleInputChange}
                  placeholder="XXXX XXXX XXXX"
                />
              </div>

              <div className="space-y-2">
                <Label>Aadhar Card Photo</Label>
                <input
                  type="file"
                  ref={aadharFileRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'aadhar')}
                />
                <div
                  className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => aadharFileRef.current?.click()}
                >
                  {formData.documents.aadhar.aadharPhoto ? (
                    <div className="relative w-full h-32">
                      <Image
                        src={`http://localhost:8000/${formData.documents.aadhar.aadharPhoto}`}
                        alt="Aadhar Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <>
                      <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload Aadhar photo</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pancard">PAN Number</Label>
                <Input
                  id="pancard"
                  value={formData.documents.pancard.panNumber}
                  onChange={handleInputChange}
                  placeholder="ABCDE1234F"
                />
              </div>

              <div className="space-y-2">
                <Label>PAN Card Photo</Label>
                <input
                  type="file"
                  ref={panFileRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'pancard')}
                />
                <div
                  className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => panFileRef.current?.click()}
                >
                  {formData.documents.pancard.panPhoto ? (
                    <div className="relative w-full h-32">
                      <Image
                        src={`http://localhost:8000/${formData.documents.pancard.panPhoto}`}
                        alt="PAN Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <>
                      <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload PAN photo</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <input
                  type="file"
                  ref={profileFileRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'profile')}
                />
                <div
                  className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => profileFileRef.current?.click()}
                >
                  {formData.profilePicture ? (
                    <div className="relative w-32 h-32 mx-auto">
                      <Image
                        src={`http://localhost:8000/${formData.profilePicture}`}
                        alt="Profile Preview"
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                  ) : (
                    <>
                      <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload profile photo</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(EditLabourerPage as React.ComponentType);
