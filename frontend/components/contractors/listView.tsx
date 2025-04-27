
"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useEffect, useState } from "react"
import { AlertTriangle, CheckCircle, Edit, FileUp, Fingerprint, Plus, Search, Trash, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function ListView({ contractor }: { contractor: any }) {

    useEffect(() => {
        
    }, [contractor]);
    return (
        <TableRow key={contractor._id}>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={contractor.photoUrl || "/placeholder.jpg"} alt={contractor.name} />
                        <AvatarFallback>{contractor?.user?.name ? contractor?.user?.name.charAt(0) : "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{contractor?.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{contractor?.user?.contactNo}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell>{contractor?.user?.age}</TableCell>
            <TableCell>{contractor?.user?.gender}</TableCell>
            <TableCell>{contractor?.documents?.aadhar.aadharNumber}</TableCell>
            <TableCell>{contractor?.documents?.pancard.panNumber}</TableCell>
            {/* <TableCell>
                {contractor.biometricVerified ? (
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
            </TableCell> */}
            <TableCell>
                <Badge variant={contractor.isActive ? "default" : "destructive"}>
                    {contractor?.isActive ? "Active":"Inactive" }
                </Badge>
            </TableCell>

            <TableCell>
                {contractor.verificationStatus === 'APPROVED' ? (
                     <Badge
                         variant="outline"
                         className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                     >
                         <CheckCircle className="mr-1 h-3 w-3" />
                         Approved
                     </Badge>
                ) : contractor.verificationStatus === 'REJECTED' ? (
                     <Badge
                         variant="outline"
                         className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                     >
                         <AlertTriangle className="mr-1 h-3 w-3" />
                         Rejected
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
            {/* <TableCell>
                {contractor.conflicts ? (
                    <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    >
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Conflict
                    </Badge>
                ) : (
                    <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                        None
                    </Badge>
                )}
            </TableCell> */}
            {/* <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </TableCell> */}
        </TableRow>
    )
}