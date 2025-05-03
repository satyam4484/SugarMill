"use client"

import { useState, useRef, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileUp, Fingerprint, Plus, Upload, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { labourers } from "@/network/agent"
import { userDetails, documents } from "@/network/agent"

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

const initialLabourState = {
  user: {
    name: "",
    email: "",
    role: "LABOURER",
    contactNo: ""
  },
  documents: {
    aadhar: {
      aadharNumber: "",
      aadharPhoto: ""
    },
    pancard: {
      panNumber: "",
      panPhoto: ""
    },
  },
  Age: "",
  Gender: "",
  profilePicture: "",
}

export default function LabourEntry() {
  const [formData, setFormData] = useState(initialLabourState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [showBiometricCapture, setShowBiometricCapture] = useState(false)
  const [captureComplete, setCaptureComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const aadharFileRef = useRef<HTMLInputElement>(null)
  const panFileRef = useRef<HTMLInputElement>(null)
  const profileFileRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    if (id === "aadhar") {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          aadhar: {
            ...prev.documents.aadhar,
            aadharNumber: value
          }
        }
      }))
      if (errors.aadharNumber) setErrors(prev => ({ ...prev, aadharNumber: undefined }))
    } else if (id === "pancard") {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          pancard: {
            ...prev.documents.pancard,
            panNumber: value
          }
        }
      }))
      if (errors.panNumber) setErrors(prev => ({ ...prev, panNumber: undefined }))
    } else if (id === "name" || id === "email" || id === "contactNo") {
      setFormData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          [id]: value
        }
      }))
      if (errors[id]) setErrors(prev => ({ ...prev, [id]: undefined }))
    } else if (id === "age") {
      setFormData(prev => ({ ...prev, Age: value }))
      if (errors.age) setErrors(prev => ({ ...prev, age: undefined }))
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, Gender: value }))
    if (errors.gender) setErrors(prev => ({ ...prev, gender: undefined }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'aadhar' | 'pancard' | 'profile') => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string

      if (type === 'aadhar') {
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            aadhar: {
              ...prev.documents.aadhar,
              aadharPhoto: base64String
            }
          }
        }))
        if (errors.aadharPhoto) setErrors(prev => ({ ...prev, aadharPhoto: undefined }))
      } else if (type === 'pancard') {
        setFormData(prev => ({
          ...prev,
          documents: {
            ...prev.documents,
            pancard: {
              ...prev.documents.pancard,
              panPhoto: base64String
            }
          }
        }))
        if (errors.panPhoto) setErrors(prev => ({ ...prev, panPhoto: undefined }))
      } else if (type === 'profile') {
        setFormData(prev => ({ ...prev, profilePicture: base64String }))
        if (errors.profilePicture) setErrors(prev => ({ ...prev, profilePicture: undefined }))
      }
    }
    reader.readAsDataURL(file)
  }

  const validateForm = async (): Promise<boolean> => {
    const newErrors: FormErrors = {}

    if (!formData.user.name.trim()) newErrors.name = "Name is required"

    if (!formData.user.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.user.email)) {
      newErrors.email = "Email is invalid"
    } else {
      try {
        const response = await userDetails.validateEmailAndContact({ email: formData.user.email })
        if (response.data.success === false) {
          newErrors.email = "This email is already registered"
        }
      } catch (error) {
        console.error("Error validating email:", error)
      }
    }

    if (!formData.user.contactNo.trim()) {
      newErrors.contactNo = "Phone number is required"
    } else if (!/^\+?[0-9]{10,12}$/.test(formData.user.contactNo.replace(/\s/g, ''))) {
      newErrors.contactNo = "Phone number is invalid"
    } else {
      try {
        const response = await userDetails.validateEmailAndContact({ contactNo: formData.user.contactNo })
        if (response.data.success === false) {
          newErrors.contactNo = "This phone number is already registered"
        }
      } catch (error) {
        console.error("Error validating contact number:", error)
      }
    }

    if (!formData.Age) {
      newErrors.age = "Age is required"
    } else if (parseInt(formData.Age) < 18 || parseInt(formData.Age) > 100) {
      newErrors.age = "Age must be between 18 and 100"
    }

    if (!formData.Gender) newErrors.gender = "Gender is required"

    if (!formData.documents.aadhar.aadharNumber.trim()) {
      newErrors.aadharNumber = "Aadhar number is required"
    } else if (!/^\d{12}$/.test(formData.documents.aadhar.aadharNumber.replace(/\s/g, ''))) {
      newErrors.aadharNumber = "Aadhar number must be 12 digits"
    } else {
      try {
        const response = await documents.validateDocuments({ aadharNumber: formData.documents.aadhar.aadharNumber })
        if (response.data.success === false) {
          newErrors.aadharNumber = "This Aadhar number is already registered"
        }
      } catch (error) {
        console.error("Error validating Aadhar number:", error)
      }
    }

    if (!formData.documents.pancard.panNumber.trim()) {
      newErrors.panNumber = "PAN number is required"
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.documents.pancard.panNumber.replace(/\s/g, ''))) {
      newErrors.panNumber = "Invalid PAN number format"
    } else {
      try {
        const response = await documents.validateDocuments({ panNumber: formData.documents.pancard.panNumber })
        if (response.data.success === false) {
          newErrors.panNumber = "This PAN number is already registered"
        }
      } catch (error) {
        console.error("Error validating PAN number:", error)
      }
    }

    if (!formData.documents.aadhar.aadharPhoto) newErrors.aadharPhoto = "Aadhar photo is required"
    if (!formData.documents.pancard.panPhoto) newErrors.panPhoto = "PAN card photo is required"
    if (!formData.profilePicture) newErrors.profilePicture = "Profile photo is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
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

  const handleAddLabourer = async () => {
    if (!await validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)



    try {
      const formDataObj = new FormData()

      // Add user details
      formDataObj.append('name', formData.user.name)
      formDataObj.append('email', formData.user.email)
      formDataObj.append('role', formData.user.role)
      formDataObj.append('contactNo', formData.user.contactNo)

      // Add document details
      formDataObj.append('documents[aadhar][aadharNumber]', formData.documents.aadhar.aadharNumber)
      formDataObj.append('documents[pancard][panNumber]', formData.documents.pancard.panNumber)

      // Add other details
      formDataObj.append('Age', formData.Age)
      formDataObj.append('Gender', formData.Gender)

      // Convert and append files
      const aadharFile = dataURLtoFile(formData.documents.aadhar.aadharPhoto, 'aadhar.jpg')
      const panFile = dataURLtoFile(formData.documents.pancard.panPhoto, 'pancard.jpg')
      const profileFile = dataURLtoFile(formData.profilePicture, 'profile.jpg')

      formDataObj.append('files', aadharFile)
      formDataObj.append('files', panFile)
      formDataObj.append('files', profileFile)
      const response = await labourers.createLabourer(formDataObj)

      if (response.status === 201) {
        const credentials = response.data
        toast({
          title: "Labour Added Successfully",
          description: (
              <div className="mt-2 space-y-2">
                  <p>Contractor has been added. Here are the login credentials:</p>
                  <div className="bg-slate-100 p-3 rounded-md">
                      <div className="flex justify-between items-center">
                          <p><strong>Username:</strong> {credentials.userId}</p>
                          <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                  navigator.clipboard.writeText(credentials.userId);
                                  toast({
                                      title: "Copied!",
                                      description: "Username copied to clipboard",
                                      duration: 2000,
                                  });
                              }}
                          >
                              Copy
                          </Button>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                          <p><strong>Password:</strong> {credentials.password}</p>
                          <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                  navigator.clipboard.writeText(credentials.password);
                                  toast({
                                      title: "Copied!",
                                      description: "Password copied to clipboard",
                                      duration: 2000,
                                  });
                              }}
                          >
                              Copy
                          </Button>
                      </div>
                      <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => {
                              const credText = `Username: ${credentials.userId}\nPassword: ${credentials.password}`;
                              navigator.clipboard.writeText(credText);
                              toast({
                                  title: "Copied!",
                                  description: "All credentials copied to clipboard",
                                  duration: 2000,
                              });
                          }}
                      >
                          Copy All Credentials
                      </Button>
                  </div>
                  <p className="text-xs text-amber-600">Please save these credentials or share with the contractor.</p>
              </div>
          ),
          duration: 10000, // Show for 20 seconds
      });

        setFormData(initialLabourState)
        setCaptureComplete(false)
        setShowBiometricCapture(false)
        setIsOpen(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as any).response?.data?.message || "Failed to add labourer",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
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
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={formData.user.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                value={formData.user.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNo">Phone Number <span className="text-red-500">*</span></Label>
              <Input
                id="contactNo"
                value={formData.user.contactNo}
                onChange={handleInputChange}
                placeholder="+91 XXXXX XXXXX"
                className={errors.contactNo ? "border-red-500" : ""}
              />
              {errors.contactNo && <p className="text-red-500 text-xs mt-1">{errors.contactNo}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="aadhar">Aadhar Number <span className="text-red-500">*</span></Label>
              <Input
                id="aadhar"
                value={formData.documents.aadhar.aadharNumber}
                onChange={handleInputChange}
                placeholder="XXXX XXXX XXXX"
                className={errors.aadharNumber ? "border-red-500" : ""}
              />
              {errors.aadharNumber && <p className="text-red-500 text-xs mt-1">{errors.aadharNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pancard">PAN Number <span className="text-red-500">*</span></Label>
              <Input
                id="pancard"
                value={formData.documents.pancard.panNumber}
                onChange={handleInputChange}
                placeholder="ABCDE1234F"
                className={errors.panNumber ? "border-red-500" : ""}
              />
              {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age <span className="text-red-500">*</span></Label>
              <Input
                id="age"
                type="number"
                value={formData.Age}
                onChange={handleInputChange}
                placeholder="Enter age"
                className={errors.age ? "border-red-500" : ""}
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
              <Select value={formData.Gender} onValueChange={handleSelectChange}>
                <SelectTrigger id="gender" className={errors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Photo <span className="text-red-500">*</span></Label>
              <input
                type="file"
                ref={profileFileRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'profile')}
              />
              <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer
                  ${errors.profilePicture ? "border-red-500" : ""}`}
                onClick={() => profileFileRef.current?.click()}
              >
                {formData.profilePicture ? (
                  <img
                    src={formData.profilePicture}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload profile photo
                    </p>
                  </>
                )}
              </div>
              {errors.profilePicture && <p className="text-red-500 text-xs mt-1">{errors.profilePicture}</p>}
            </div>

            <div className="space-y-2">
              <Label>Aadhar Card Photo <span className="text-red-500">*</span></Label>
              <input
                type="file"
                ref={aadharFileRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'aadhar')}
              />
              <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer
                  ${errors.aadharPhoto ? "border-red-500" : ""}`}
                onClick={() => aadharFileRef.current?.click()}
              >
                {formData.documents.aadhar.aadharPhoto ? (
                  <img
                    src={formData.documents.aadhar.aadharPhoto}
                    alt="Aadhar Preview"
                    className="w-50 h-32 object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload Aadhar photo
                    </p>
                  </>
                )}
              </div>
              {errors.aadharPhoto && <p className="text-red-500 text-xs mt-1">{errors.aadharPhoto}</p>}
            </div>

            <div className="space-y-2">
              <Label>PAN Card Photo <span className="text-red-500">*</span></Label>
              <input
                type="file"
                ref={panFileRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'pancard')}
              />
              <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer
                  ${errors.panPhoto ? "border-red-500" : ""}`}
                onClick={() => panFileRef.current?.click()}
              >
                {formData.documents.pancard.panPhoto ? (
                  <img
                    src={formData.documents.pancard.panPhoto}
                    alt="PAN Preview"
                    className="w-50 h-32 object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload PAN photo
                    </p>
                  </>
                )}
              </div>
              {errors.panPhoto && <p className="text-red-500 text-xs mt-1">{errors.panPhoto}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Biometric Verification <span className="text-red-500">*</span></Label>
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

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleAddLabourer} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></span>
                Adding Labourer...
              </>
            ) : (
              'Add Labourer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Add this after the file upload sections
