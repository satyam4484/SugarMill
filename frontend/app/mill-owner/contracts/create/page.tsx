"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { mockContractors, mockLabourers } from "@/lib/mock-data"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { CalendarIcon, CheckCircle, FileUp, Fingerprint, Plus, Trash, Upload, X, Users } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { contractors } from "@/network/agent"
import withAuth from "@/hocs/withAuth"

function CreateContractPage() {
  const { toast } = useToast()
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectedContractor, setSelectedContractor] = useState("")
  const [advanceAmount, setAdvanceAmount] = useState("")
  const [selectedLabourers, setSelectedLabourers] = useState<typeof mockLabourers>([])
  const [showVerificationResult, setShowVerificationResult] = useState(false)
  const [hasConflicts, setHasConflicts] = useState(false)
  const [notes, setNotes] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [errors, setErrors] = useState<{
    contractor?: string;
    dates?: string;
    advance?: string;
    agreement?: string;
  }>({})
  const [agreement, setAgreement] = useState<File | null>(null)
  const [agreementPreview, setAgreementPreview] = useState<string | null>(null)

  const [contractorDetails, setContractorDetails] = useState<any[]>([]);

  const getContractorsHandler = async () => {
    try{
      const response: any = await contractors.getAllContractors();
      setContractorDetails(response.data);
    }catch(error) {
      console.log("Error fetchging contractors")
    }
  }


  useEffect(() => {
    getContractorsHandler();
  },[])



  const handleAddLabourer = (labourer: (typeof mockLabourers)[0]) => {
    if (!selectedLabourers.find((l) => l.id === labourer.id)) {
      setSelectedLabourers([...selectedLabourers, labourer])
    }
  }

  const handleRemoveLabourer = (id: string) => {
    setSelectedLabourers(selectedLabourers.filter((l) => l.id !== id))
  }

  const handleVerify = () => {
    // Simulate verification process
    setShowVerificationResult(true)

    // Randomly set conflicts for demo
    setHasConflicts(Math.random() > 0.5)

    toast({
      title: "Verification Complete",
      description: "Contract has been verified for conflicts.",
    })
  }

  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    if (!selectedContractor) {
      newErrors.contractor = "Please select a contractor";
    }

    if (!startDate || !endDate) {
      newErrors.dates = "Please select both start and end dates";
    } else if (startDate >= endDate) {
      newErrors.dates = "Start date must be before end date";
    }

    if (!advanceAmount) {
      newErrors.advance = "Please enter an advance amount";
    }

    if (!agreement) {
      newErrors.agreement = "Please upload an agreement file";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      toast({
        title: "Contract Created",
        description: "Your contract has been created successfully.",
      })
    }
  }


const handleAgreementChange = (file: File | null) => {
  if (!file) {
    setAgreement(null);
    setAgreementPreview(null);
    return;
  }

  // Validate file type
  if (file.type !== 'application/pdf') {
    setErrors(prev => ({ ...prev, agreement: "Only PDF files are allowed" }));
    return;
  }

  // Validate file size (5MB = 5 * 1024 * 1024 bytes)
  if (file.size > 5 * 1024 * 1024) {
    setErrors(prev => ({ ...prev, agreement: "File size should not exceed 5MB" }));
    return;
  }

  setErrors(prev => ({ ...prev, agreement: undefined }));
  setAgreement(file);
  
  // Revoke previous preview URL to prevent memory leaks
  if (agreementPreview) {
    URL.revokeObjectURL(agreementPreview);
  }
  
  const fileUrl = URL.createObjectURL(file);
  setAgreementPreview(fileUrl);
}




  const validateDatesBeforeAddingLabourers = () => {
    if(!selectedContractor)  {
      setErrors(prev => ({
        ...prev,
        contractor: "Please select a contractor before adding labourers"
      }))
    }
    if (!startDate || !endDate) {
      setErrors(prev => ({
        ...prev,
        dates: "Please select start and end dates before adding labourers"
      }));
      return false;
    }

    if (startDate >= endDate) {
      setErrors(prev => ({
        ...prev,
        dates: "Start date must be before end date"
      }));
      return false;
    }
    setErrors(prev => ({ ...prev, dates: undefined }));
    return true;
  }

  console.log("contractor details--",contractorDetails)

  return (
    <DashboardLayout role="mill-owner">
      <div className="flex flex-col gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight">Create New Contract</h1>
          <p className="text-muted-foreground">Create a new labour contract with a contractor.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-6 md:grid-cols-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
              <CardDescription>Enter the basic details of the contract</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contractor">Select Contractor</Label>
                <Select value={selectedContractor} onValueChange={(value) => {
                  setSelectedContractor(value);
                  setErrors(prev => ({ ...prev, contractor: undefined }));
                }}>
                  <SelectTrigger id="contractor" className={errors.contractor ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a contractor" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <div className="px-3 py-2 sticky top-0 bg-background z-10">
                      <Input 
                        placeholder="Search contractor..." 
                        className="h-9"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const searchInput = e.target.value.toLowerCase();
                          const searchResults = document.querySelectorAll('[data-contractor-item]');
                          searchResults.forEach((item) => {
                            const text = item.textContent?.toLowerCase() || '';
                            if (text.includes(searchInput)) {
                              item.classList.remove('hidden');
                            } else {
                              item.classList.add('hidden');
                            }
                          });
                        }}
                      />
                    </div>
                    {contractorDetails && contractorDetails.map((contractor) => (
                      <SelectItem 
                        key={contractor._id} 
                        value={contractor._id}
                        data-contractor-item
                      >
                        {contractor?.user?.name} (ID: {contractor?.user?.userId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.contractor && (
                  <p className="text-sm text-red-500 col-span-2 mt-1">{errors.contractor}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                          errors.dates && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                          errors.dates && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                {errors.dates && (
                  <p className="text-sm text-red-500 col-span-2 mt-1">{errors.dates}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="advance">Advance Amount (₹)</Label>
                <Input
                  id="advance"
                  type="number"
                  placeholder="Enter advance amount"
                  value={advanceAmount}
                  onChange={(e) => {
                    setAdvanceAmount(e.target.value);
                    setErrors(prev => ({ ...prev, advance: undefined }));
                  }}
                  className={errors.advance ? "border-red-500" : ""}
                />
                {errors.advance && (
                  <p className="text-sm text-red-500 mt-1">{errors.advance}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Enter any additional notes or terms" 
                  className="min-h-[100px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Agreement</Label>
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6",
                    errors.agreement ? "border-red-500" : ""
                  )}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files[0];
                    handleAgreementChange(file);
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id="agreement-upload"
                    onChange={(e) => handleAgreementChange(e.target.files?.[0] || null)}
                  />
                  {!agreement ? (
                    <label 
                      htmlFor="agreement-upload" 
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your agreement file here, or click to browse
                      </p>
                      <Button variant="outline" size="sm" type="button">
                        <Upload className="mr-2 h-4 w-4" />
                        Browse Files
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Only PDF files up to 5MB are allowed
                      </p>
                    </label>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileUp className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium">{agreement.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAgreement(null);
                            setAgreementPreview(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {agreementPreview && (
                        <div className="border rounded-lg overflow-hidden">
                          <iframe
                            src={agreementPreview}
                            className="w-full h-[400px]"
                            title="Agreement Preview"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {errors.agreement && (
                  <p className="text-sm text-red-500 mt-1">{errors.agreement}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Labourers</CardTitle>
                  <CardDescription>Add labourers to this contract</CardDescription>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={(e) => {
                      e.preventDefault();
                      if (validateDatesBeforeAddingLabourers()) {
                        setDialogOpen(true);
                      }
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Labourer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Labourer</DialogTitle>
                      <DialogDescription>
                        Select labourers from the contractor's team to add to this contract.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[400px] overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Aadhar</TableHead>
                            <TableHead>Verified</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockLabourers
                            .filter((l) => !selectedLabourers.find((sl) => sl.id === l.id))
                            .map((labourer) => (
                              <TableRow key={labourer.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={labourer.photoUrl || "/placeholder.svg"} alt={labourer.name} />
                                      <AvatarFallback>{labourer.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">{labourer.name}</p>
                                      <p className="text-xs text-muted-foreground">{labourer.phone}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{labourer.aadharNumber}</TableCell>
                                <TableCell>
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
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button size="sm" onClick={() => handleAddLabourer(labourer)}>
                                    Add
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>Done</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {selectedLabourers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Labourers Added</h3>
                    <p className="text-sm text-muted-foreground max-w-md mt-2">
                      Add labourers to this contract by clicking the "Add Labourer" button above.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Aadhar</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedLabourers.map((labourer) => (
                        <TableRow key={labourer.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={labourer.photoUrl || "/placeholder.svg"} alt={labourer.name} />
                                <AvatarFallback>{labourer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{labourer.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{labourer.aadharNumber}</TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveLabourer(labourer.id)}>
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Total Labourers: <span className="font-medium">{selectedLabourers.length}</span>
                </div>
                <Button variant="outline" onClick={handleVerify}>
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Verify Team
                </Button>
              </CardFooter>
            </Card>

            {showVerificationResult && (
              <Card className={cn("border-2", hasConflicts ? "border-red-500" : "border-green-500")}>
                <CardHeader
                  className={cn("flex flex-row items-center gap-2", hasConflicts ? "text-red-500" : "text-green-500")}
                >
                  {hasConflicts ? (
                    <>
                      <X className="h-5 w-5" />
                      <CardTitle>Conflict Detected</CardTitle>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      <CardTitle>Verification Successful</CardTitle>
                    </>
                  )}
                </CardHeader>
                <CardContent>
                  {hasConflicts ? (
                    <div className="space-y-4">
                      <p>
                        We've detected conflicts with 2 labourers in this contract. These labourers appear to be already
                        engaged in other active contracts.
                      </p>
                      <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                        <h4 className="font-medium mb-2">Conflicting Labourers:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Raju Patil - Already in contract with Krishna Sugar Factory</li>
                          <li>Sunita Jadhav - Already in contract with Shree Renuka Sugars</li>
                        </ul>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">Remove Conflicting Labourers</Button>
                        <Button variant="destructive">Continue Anyway</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p>All labourers in this contract have been verified. No conflicts were detected.</p>
                      <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                        <h4 className="font-medium mb-2">Verification Summary:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Total Labourers: {selectedLabourers.length}</li>
                          <li>Biometrically Verified: {selectedLabourers.filter((l) => l.biometricVerified).length}</li>
                          <li>Pending Verification: {selectedLabourers.filter((l) => !l.biometricVerified).length}</li>
                          <li>Conflicts Detected: 0</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Create Contract</CardTitle>
                <CardDescription>Review and submit the contract</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Contractor</h4>
                      <p>
                        {selectedContractor
                          ? mockContractors.find((c) => c.id === selectedContractor)?.name
                          : "Not selected"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Duration</h4>
                      <p>
                        {startDate && endDate
                          ? `${format(startDate, "PPP")} to ${format(endDate, "PPP")}`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Advance Amount</h4>
                      <p>{advanceAmount ? `₹${advanceAmount}` : "Not specified"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Team Size</h4>
                      <p>{selectedLabourers.length} Labourers</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSubmit}>
                  Create Contract
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}


export default withAuth(CreateContractPage);
