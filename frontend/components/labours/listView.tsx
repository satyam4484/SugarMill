"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

import { AlertTriangle, CheckCircle, Edit,Eye,FileUp, Fingerprint, Plus, Search, Trash, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ListView({ filteredLabourers }: { filteredLabourers: any[] }) {
    const router = useRouter();
    return (
        <TabsContent value="list" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>List of all labourers in your team</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Aadhar Number</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Biometric</TableHead>
                                <TableHead>Status</TableHead>
                                {/* <TableHead>Conflicts</TableHead> */}
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLabourers.map((labourer) => (
                                <TableRow key={labourer._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={labourer.profilePicture || "/placeholder.jpg"} alt={labourer.user.name} />
                                                <AvatarFallback>{labourer.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{labourer.user.name}</p>
                                                <p className="text-xs text-muted-foreground">{labourer.contactNo}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{labourer.documents.aadhar.aadharNumber}</TableCell>
                                    <TableCell>{labourer.Age}</TableCell>
                                    <TableCell>{labourer.Gender}</TableCell>
                                    <TableCell>
                                        {labourer.verificationStatus !== "PENDING" ? (
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
                                    <TableCell>
                                        <Badge variant={labourer.isActive ? "default" : "destructive"}>
                                            {labourer.isActive ? "active" : "in-active"}
                                        </Badge>
                                    </TableCell>
                                    {/* <TableCell>
                                        {labourer.conflicts ? (
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
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => router.push(`/contractor/team/${labourer._id}`)}
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">View Details</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => router.push(`/contractor/team/${labourer._id}/edit`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Trash className="h-4 w-4" />
                                                <span className="sr-only">Delete</span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
    )
}