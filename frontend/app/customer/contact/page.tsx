"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { CustomerRoles } from "@/lib/contants"
import { customerRequest } from "@/network/agent"
import { HTTP_STATUS_CODE } from "@/lib/contants"

export default function Contact() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    email: "",
    role: "",
    description: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    contactNo: "",
    email: "",
    role: "",
    description: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    setErrors(prev => ({
      ...prev,
      [id]: ""
    }))
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }))
    setErrors(prev => ({
      ...prev,
      role: ""
    }))
  }

  const validateForm = () => {
    const newErrors = {
      name: formData.name ? "" : "Name is required",
      contactNo: formData.contactNo ? "" : "Contact number is required",
      email: formData.email ? "" : "Email is required",
      role: formData.role ? "" : "Role is required",
      description: formData.description ? "" : "Description is required",
    }
    setErrors(newErrors)
    return Object.values(newErrors).every(error => error === "")
  }

  const handleContact = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      // TODO: Replace with actual API call
      const response = await customerRequest.sendRequest(formData);
      if(response.status === HTTP_STATUS_CODE.CREATED) {
        toast({
          title: "Contact request sent",
          description: "We will get back to you shortly",
          variant:"default"
        });
        setFormData({
          name: "",
          contactNo: "",
          email: "",
          role: "",
          description: "",
        })
        // add delay for 1 s
        await new Promise(resolve => setTimeout(resolve, 1000))
        router.push("/")
      }else{
        throw response;
      }
      
    } catch (error) {
      // Handle error (e.g., show error message)
      console.log("error here")
      toast({
        title: "Contact request failed",
        description: (error as any).response.data?.message,
        variant: "destructive",
      });
      router.push("/")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-t-4 border-t-blue-500">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Contact Us</CardTitle>
            <CardDescription className="text-center">Fill in your details and we will get back to you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNo">Contact Number</Label>
              <Input
                id="contactNo"
                placeholder="Enter your contact number"
                value={formData.contactNo}
                onChange={handleInputChange}
              />
              {errors.contactNo && <p className="text-red-500 text-sm">{errors.contactNo}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CustomerRoles.MILL_OWNER}>Mill Owner</SelectItem>
                  <SelectItem value={CustomerRoles.CONTRACTOR}>Contractor</SelectItem>
                  <SelectItem value={CustomerRoles.LABOURER}>Labourer</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter your message"
                value={formData.description}
                onChange={handleInputChange}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              className="w-full"
              onClick={handleContact}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </Button>

            <Button
              className="w-full"
              onClick={() => router.push("/")}
              variant={"destructive"}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}