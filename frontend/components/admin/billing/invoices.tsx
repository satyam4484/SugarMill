import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Download, FileText, Plus, Search } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { millOwnersApi, invoicesApi } from "@/network/agent"
import { useToast } from "@/components/ui/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Pencil, Trash2 } from "lucide-react"

export default function Invoices() {
    const [invoices, setInvoices] = useState<any[]>([]); // Initialize as empty array with type
    const [millOwners, setMillOwners] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedMillOwner, setSelectedMillOwner] = useState<string>("");
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleEditInvoice = (invoice: any) => {
        setSelectedInvoice(invoice);
        setDialogOpen(true);
    };

    const handleDeleteInvoice = async () => {
        if (!selectedInvoice) return;
        try {
            await invoicesApi.deleteInvoice(selectedInvoice._id);
            toast({
                title: "Success",
                description: "Invoice deleted successfully"
            });
            setShowDeleteModal(false);
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete invoice",
                variant: "destructive"
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [invoicesRes, millOwnersRes] = await Promise.all([
                invoicesApi.getAllInvoices(),
                millOwnersApi.getAllMillOwners()
            ]);
            setInvoices(invoicesRes.data.data);
            setMillOwners(millOwnersRes.data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch data",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };


    const handleCreateInvoice = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            millOwnerId: selectedMillOwner,
            amount: Number(formData.get("amount")),
            status: formData.get("status") || "unpaid",
            dueDate: formData.get("due-date"),
            description: formData.get("description"),
            createdAt: new Date(),
        };

        try {
            await invoicesApi.createInvoice(data);
            toast({
                title: "Success",
                description: "Invoice created successfully"
            });
            setDialogOpen(false); // Close the dialog
            fetchData(); // Refresh the invoices list
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create invoice",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMarkAsPaid = async (id: string) => {
        try {
            await invoicesApi.markAsPaid(id, {
                paymentMethod: "bank_transfer",
                transactionId: Date.now().toString()
            });
            toast({
                title: "Success",
                description: "Invoice marked as paid"
            });
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to mark invoice as paid",
                variant: "destructive"
            });
        }
    };

    const handleDownloadInvoice = async (id: string) => {
        try {
            const response = await invoicesApi.downloadInvoice(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to download invoice",
                variant: "destructive"
            });
        }
    };

    const filteredInvoices = Array.isArray(invoices) ? invoices.filter((invoice: any) => {
        return invoice.status !== "paid";
    }) : [];

    const filteredMillOwners = millOwners.filter((owner: any) => {
        return owner.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Update form submission to handle both create and edit
    // Update handleSubmit function
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            millOwnerId: selectedMillOwner,
            amount: Number(formData.get("amount")),
            status: formData.get("status") || "unpaid",
            dueDate: formData.get("due-date"),
            description: formData.get("description"),
            paymentMethod: formData.get("paymentMethod"),
            transactionId: formData.get("transactionId"),
        };

        try {
            if (selectedInvoice) {
                await invoicesApi.updateInvoice(selectedInvoice._id, data);
                toast({
                    title: "Success",
                    description: "Invoice updated successfully"
                });
            } else {
                await invoicesApi.createInvoice({ ...data, createdAt: new Date() });
                toast({
                    title: "Success",
                    description: "Invoice created successfully"
                });
            }
            setDialogOpen(false);
            setSelectedInvoice(null);
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${selectedInvoice ? 'update' : 'create'} invoice`,
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update the dialog footer button
    <DialogFooter>
        <Button type="submit" disabled={!selectedMillOwner || isSubmitting}>
            {isSubmitting ? (
                <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    {selectedInvoice ? 'Updating...' : 'Creating...'}
                </>
            ) : (
                selectedInvoice ? 'Update Invoice' : 'Create Invoice'
            )}
        </Button>
    </DialogFooter>

    // Update the useEffect for selected invoice
    useEffect(() => {
        if (selectedInvoice) {
            setSelectedMillOwner(selectedInvoice.millOwnerId._id);
            // Pre-fill form fields
            const form = document.querySelector('form');
            if (form) {
                const elements = form.elements as any;
                elements.amount.value = selectedInvoice.amount;
                elements.status.value = selectedInvoice.status;
                elements['due-date'].value = selectedInvoice.dueDate?.split('T')[0] || '';
                elements.description.value = selectedInvoice.description || '';
                elements.paymentMethod.value = selectedInvoice.paymentMethod || '';
                elements.transactionId.value = selectedInvoice.transactionId || '';
            }
        }
    }, [selectedInvoice]);




    // Reset selected invoice when dialog closes
    useEffect(() => {
        if (!dialogOpen) {
            setSelectedInvoice(null);
            setSelectedMillOwner("");
        }
    }, [dialogOpen]);

    // Update the useEffect for selected invoice
    useEffect(() => {
        if (selectedInvoice) {
            setSelectedMillOwner(selectedInvoice.millOwnerId._id);
            // Pre-fill form fields
            const form = document.querySelector('form');
            if (form) {
                const elements = form.elements as any;
                elements.amount.value = selectedInvoice.amount;
                elements.status.value = selectedInvoice.status;
                elements['due-date'].value = selectedInvoice.dueDate?.split('T')[0] || '';
                elements.description.value = selectedInvoice.description || '';
                elements.paymentMethod.value = selectedInvoice.paymentMethod || '';
                elements.transactionId.value = selectedInvoice.transactionId || '';
            }
        }
    }, [selectedInvoice]);

    return (
        <TabsContent value="invoices" className="space-y-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>Manage all invoices for mill owners</CardDescription>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Invoice
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{selectedInvoice ? 'Edit Invoice' : 'Create New Invoice'}</DialogTitle>
                                <DialogDescription>
                                    {selectedInvoice ? 'Update the invoice details.' : 'Create a new invoice for a mill owner.'}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="mill-owner" className="text-right">
                                            Mill Owner
                                        </Label>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="col-span-3 justify-between"
                                                    disabled={selectedInvoice}
                                                >
                                                    {selectedMillOwner
                                                        ? millOwners.find((owner: any) => owner._id === selectedMillOwner)?.name
                                                        : "Select mill owner..."}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search mill owner..."
                                                        value={searchTerm}
                                                        onValueChange={setSearchTerm}
                                                    />
                                                    <CommandEmpty>No mill owner found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {filteredMillOwners.map((owner: any) => (
                                                            <CommandItem
                                                                key={owner._id}
                                                                onSelect={() => {
                                                                    setSelectedMillOwner(owner._id);
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                {owner.name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="amount" className="text-right">
                                            Amount (₹)
                                        </Label>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            placeholder="50000"
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="status" className="text-right">
                                            Status
                                        </Label>
                                        <Select name="status" defaultValue="unpaid">
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unpaid">Unpaid</SelectItem>
                                                <SelectItem value="paid">Paid</SelectItem>
                                                <SelectItem value="overdue">Overdue</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="due-date" className="text-right">
                                            Due Date
                                        </Label>
                                        <Input
                                            id="due-date"
                                            name="due-date"
                                            type="date"
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="description" className="text-right">
                                            Description
                                        </Label>
                                        <Input
                                            id="description"
                                            name="description"
                                            placeholder="Monthly subscription"
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="paymentMethod" className="text-right">
                                            Payment Method
                                        </Label>
                                        <Select name="paymentMethod">
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select payment method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                <SelectItem value="upi">UPI</SelectItem>
                                                <SelectItem value="cheque">Cheque</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="transactionId" className="text-right">
                                            Transaction ID
                                        </Label>
                                        <Input
                                            id="transactionId"
                                            name="transactionId"
                                            placeholder="Enter transaction ID"
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={!selectedMillOwner || isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                                {selectedInvoice ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            selectedInvoice ? 'Update Invoice' : 'Create Invoice'
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-6">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead>Invoice #</TableHead> */}
                                    <TableHead>Mill Owner</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Created On</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice: any) => (
                                    <TableRow key={invoice._id}>
                                        <TableCell>{invoice.millOwnerId.name}</TableCell>
                                        <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={invoice.status === "paid" ? "default" : "destructive"}>
                                                {invoice.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button onClick={() => handleEditInvoice(invoice)} variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedInvoice(invoice);
                                                        setShowDeleteModal(true);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                                {/* {invoice.status !== "paid" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleMarkAsPaid(invoice._id)}
                                                    >
                                                        <CreditCard className="h-4 w-4" />
                                                        <span className="sr-only">Mark as Paid</span>
                                                    </Button>
                                                )} */}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Invoice</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this invoice? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteInvoice}
                            >
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Card>
        </TabsContent>
    )
}

// Update the dialog title and description based on edit/create mode

