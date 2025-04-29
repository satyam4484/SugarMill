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

export default function GridView({ contractor }: { contractor: any }) {
    useEffect(() => {
        // Logic to handle changes in contractor
        // console.log("contractor data changed:",);
    }, [contractor]);

    return (
        <Card key={contractor._id} className="overflow-hidden">
            <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={contractor?.photoUrl || "/placeholder.jpg"} alt={contractor?.user?.name} />
                        <AvatarFallback>{contractor?.user?.name}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-base">{contractor?.user?.name}</CardTitle>
                        <CardDescription>{contractor?.user?.contactNo}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Company:</span>
                        <span>{contractor?.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Owner:</span>
                        <span>{contractor?.ownerName} years</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{contractor?.location}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Verification:</span>
                        {contractor?.verificationStatus ? (
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
                        <Badge variant={contractor?.isActive ? "default" : "destructive"}>
                        {contractor?.isActive ? "Active":"Inactive" }
                        </Badge>
                    </div>
                    {/* {contractor.conflicts && (
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
                {/* <Button variant="outline" size="sm">
                    Edit
                </Button> */}
                <Button variant="outline" size="sm">
                    View Details
                </Button>
            </div>
        </Card>
    )
}