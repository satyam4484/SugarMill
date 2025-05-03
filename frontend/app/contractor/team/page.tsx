"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockLabourers } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { useState,useEffect } from "react"
import { AlertTriangle, CheckCircle, Edit, FileUp, Fingerprint, Plus, Search, Trash, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { labourers } from "@/network/agent"
import withAuth from "@/hocs/withAuth"
import { HTTP_STATUS_CODE } from "@/lib/contants"
import ListView from "@/components/labours/listView"
import LabourGrid from "@/components/labours/grid"
import LabourEntry from "@/components/labours/LabourEntry"

function ContractorTeamPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [labourDetails,setLabourDetails] = useState<any>([]);
  const [statusFilter, setStatusFilter] = useState("all")
  const [showBiometricCapture, setShowBiometricCapture] = useState(false)
  const [captureComplete, setCaptureComplete] = useState(false)

  const laboursDetailsHandler = async() => {
    try{
      const response = await labourers.getAllLabours();
      if(response.status === HTTP_STATUS_CODE.OK) {
        setLabourDetails(response.data);
      }
    }catch(error) {
      toast({
        title: "Failed to fetch Labours",
        variant:"destructive"
      })
    }
  }

  useEffect(() => {
    laboursDetailsHandler();

  },[]);

  // Filter labourers based on search term and status
  const filteredLabourers = labourDetails.filter((labourer: any) => {
    const matchesSearch =
      labourer.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labourer.documents.aadhar.aadharNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labourer.user.contactNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      labourer.documents.pancard.panNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && labourer.isActive) ||
      (statusFilter === "inactive" && !labourer.isActive)

    return matchesSearch && matchesStatus
  })

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

  const handleAddLabourer = () => {
    toast({
      title: "Labourer Added",
      description: "New labourer has been added to your team.",
    })
  }

  return (
    <DashboardLayout role="contractor">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">Manage your team of labourers and their details.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="list" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <LabourEntry/>
              </div>
            </div>

            <ListView filteredLabourers={filteredLabourers}/>

           <LabourGrid filteredLabourers={filteredLabourers} />
            
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default withAuth(ContractorTeamPage);
