"use client"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { useState } from "react"
import { AlertTriangle, Building, Check, CheckCircle2, Fingerprint, Search, UserCheck } from "lucide-react"

export default function BiometricPage() {
  const { toast } = useToast()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [aadharNumber, setAadharNumber] = useState("")
  const [isScanningFingerprint, setIsScanningFingerprint] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  // For demonstration purposes, let's define an example verification result
  // In a real application, this would come from an API
  const verificationResult = {
    success: true, // Set to false to simulate a failed verification
    labourerName: "Santosh Kamble",
    contractorName: "Rajesh Kumar",
    millName: "Ganesh Sugar Mills",
    contractActive: true,
    contractStartDate: "2024-01-01",
    contractEndDate: "2024-06-30",
  }

  const handleAadharSearch = () => {
    if (aadharNumber.length < 12) {
      toast({
        title: "Invalid Aadhar Number",
        description: "Please enter a valid 12-digit Aadhar number",
        variant: "destructive",
      })
      return
    }

    setStep(2)
  }

  const handleFingerprintScan = () => {
    setIsScanningFingerprint(true)

    // Simulate fingerprint scanning process
    setTimeout(() => {
      setIsScanningFingerprint(false)

      if (verificationResult.success) {
        setIsVerified(true)
        setStep(3)
      } else {
        setShowError(true)
        setTimeout(() => setShowError(false), 3000)
      }
    }, 3000)
  }

  const handleConfirmAttendance = () => {
    setStep(4)
    setShowSuccess(true)

    toast({
      title: "Attendance Marked",
      description: "Attendance has been successfully recorded",
    })

    // Reset after 5 seconds for the next person
    setTimeout(() => {
      setStep(1)
      setAadharNumber("")
      setIsVerified(false)
      setShowSuccess(false)
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-t-4 border-t-blue-500">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Building className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Sugar Mill Labour Verification</CardTitle>
            <CardDescription className="text-center">Biometric Attendance System</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhar">Enter Aadhar Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="aadhar"
                      placeholder="XXXX XXXX XXXX"
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, ""))}
                      maxLength={12}
                    />
                    <Button onClick={handleAadharSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Please enter the 12-digit Aadhar number of the labourer
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
                  <Fingerprint className="h-16 w-16 text-muted-foreground mb-2" />
                  <p className="text-center text-sm text-muted-foreground">
                    Or scan fingerprint directly on the biometric device
                  </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="text-center mb-6">
                  <p className="mb-2">Aadhar Number:</p>
                  <p className="text-xl font-bold">{aadharNumber.replace(/(\d{4})/g, "$1 ").trim()}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
                    {!isScanningFingerprint ? (
                      <>
                        <Fingerprint className="h-16 w-16 text-blue-600 mb-2" />
                        <p className="text-center mb-4">Please place your thumb on the scanner</p>
                        <Button onClick={handleFingerprintScan}>Start Scanning</Button>
                      </>
                    ) : (
                      <>
                        <div className="animate-pulse">
                          <Fingerprint className="h-16 w-16 text-blue-600 mb-2" />
                        </div>
                        <p className="text-center mb-4">Scanning fingerprint...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full animate-[progress_3s_ease-in-out_infinite]"
                            style={{ width: "45%" }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">Please keep your thumb steady on the scanner</p>
                      </>
                    )}
                  </div>

                  {showError && (
                    <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="font-medium text-red-600 dark:text-red-400">Verification Failed</p>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Fingerprint does not match. Please try again.
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep(1)}
                    disabled={isScanningFingerprint}
                  >
                    Back to Search
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-medium text-green-600 dark:text-green-400">Verification Successful</h3>
                  <p className="text-sm text-muted-foreground">Biometric verification complete</p>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Name:</span>
                    <span className="text-sm font-medium">{verificationResult.labourerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Aadhar Number:</span>
                    <span className="text-sm font-medium">{aadharNumber.replace(/(\d{4})/g, "$1 ").trim()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Contractor:</span>
                    <span className="text-sm font-medium">{verificationResult.contractorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Mill Name:</span>
                    <span className="text-sm font-medium">{verificationResult.millName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Contract Status:</span>
                    <span className="text-sm font-medium">
                      <Badge
                        className={`bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full px-2 py-0.5 text-xs font-medium`}
                      >
                        Active
                      </Badge>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Contract Period:</span>
                    <span className="text-sm font-medium">
                      {verificationResult.contractStartDate} to {verificationResult.contractEndDate}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="w-full" onClick={handleConfirmAttendance}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Confirm Attendance
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && showSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center space-y-4 py-6"
              >
                <div className="bg-green-100 dark:bg-green-900/20 p-6 rounded-full">
                  <Check className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-medium text-green-600 dark:text-green-400">Attendance Recorded</h3>
                <p className="text-center text-muted-foreground">
                  {verificationResult.labourerName}'s attendance has been successfully recorded for today.
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-4">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full animate-[progress_5s_ease]"
                    style={{ width: "100%" }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">Returning to home screen...</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <Toaster />
    </div>
  )
}
