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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Edit, FileUp, Fingerprint, Plus, Search, Trash, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function LabourGrid( {filteredLabourers}:{filteredLabourers:any}) {
    return (
        <TabsContent value="grid" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Grid view of all labourers in your team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredLabourers.map((labourer:any) => (
                      <Card key={labourer._id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={labourer.profilePicture || "/placeholder.jpg"} alt={labourer.user.name} />
                              <AvatarFallback>{labourer.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{labourer.user.name}</CardTitle>
                              <CardDescription>{labourer.user.contactNo}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Aadhar:</span>
                              <span>{labourer.documents.aadhar.aadharNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Age:</span>
                              <span>{labourer.Age} years</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Gender:</span>
                              <span>{labourer.Gender}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Biometric:</span>
                              {labourer.verificationStatus !=="PENDING" ? (
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
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Status:</span>
                              <Badge variant={labourer.isActive ? "default" : "destructive"}>
                                {labourer.isActive ? "active":"in-active"}
                              </Badge>
                            </div>
                            {/* {labourer.conflicts && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Conflicts:</span>
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                >
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  Conflict
                                </Badge>
                              </div>
                            )} */}
                          </div>
                        </CardContent>
                        <div className="border-t p-4 flex justify-between">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
    )
}