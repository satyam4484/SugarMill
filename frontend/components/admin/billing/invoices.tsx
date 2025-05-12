import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    CreditCard,
    Download,
    FileText,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Invoices() {
    const [invoices, setInvoices] = useState<any>([]);

    const filteredInvoices = invoices.filter((invoice:any) => {
        return invoice.status !== "paid";
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-warning/10 text-warning";
            case "paid":
                return "bg-success/10 text-success";
            case "overdue":
                return "bg-error/10 text-error";
            default:
                return "bg-primary/10 text-primary";
        }
    }
    return (
        <TabsContent value="invoices" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>Manage all invoices for mill owners</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Mill Owner</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Created On</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvoices.map((invoice: any) => (
                                <TableRow key={invoice.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="font-medium">INV-{invoice.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{invoice.userName}</TableCell>
                                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                                    <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4" />
                                                <span className="sr-only">Download</span>
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <CreditCard className="h-4 w-4" />
                                                <span className="sr-only">Mark as Paid</span>
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