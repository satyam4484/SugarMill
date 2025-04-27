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
import { useState, useRef, ChangeEvent } from "react"
import { AlertTriangle, CheckCircle, Edit, FileUp, Fingerprint, List, Plus, Search, Trash, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ContractorConstant, HTTP_STATUS_CODE } from "@/lib/contants"
import { contractors ,documents, userDetails} from "@/network/agent"

const initialFormState = {
    name: "",
    email: "",
    role: "",
    age: "",
    gender: "",
    contactNo: "",
    CONTRACTOR: {
        documents: {
            aadhar: {
                aadharNumber: "",
                aadharPhoto: ""
            },
            panCard: {
                panNumber: "",
                panPhoto: ""
            },
        },
        experience: "",
    }
}

type FormErrors = {
    name?: string;
    email?: string;
    contactNo?: string;
    age?: string;
    gender?: string;
    aadharNumber?: string;
    panNumber?: string;
    aadharPhoto?: string;
    panPhoto?: string;
    experience?: string;
}

export default function AddForm() {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showBiometricCapture, setShowBiometricCapture] = useState(false);
    const [captureComplete, setCaptureComplete] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const aadharFileRef = useRef<HTMLInputElement>(null);
    const panFileRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        if (id === "aadhar") {
            setFormData(prev => ({
                ...prev,
                CONTRACTOR: {
                    ...prev.CONTRACTOR,
                    documents: {
                        ...prev.CONTRACTOR.documents,
                        aadhar: {
                            ...prev.CONTRACTOR.documents.aadhar,
                            aadharNumber: value
                        }
                    }
                }
            }));
            // Clear aadhar number error immediately
            if (errors.aadharNumber) {
                setErrors(prev => ({
                    ...prev,
                    aadharNumber: undefined
                }));
            }
        } else if (id === "pancard") {
            setFormData(prev => ({
                ...prev,
                CONTRACTOR: {
                    ...prev.CONTRACTOR,
                    documents: {
                        ...prev.CONTRACTOR.documents,
                        panCard: {
                            ...prev.CONTRACTOR.documents.panCard,
                            panNumber: value
                        }
                    }
                }
            }));
            // Clear pan number error immediately
            if (errors.panNumber) {
                setErrors(prev => ({
                    ...prev,
                    panNumber: undefined
                }));
            }
        } else if (id === "experience") {
            setFormData(prev => ({
                ...prev,
                CONTRACTOR: {
                    ...prev.CONTRACTOR,
                    experience: value
                }
            }));
            // Clear experience error immediately
            if (errors.experience) {
                setErrors(prev => ({
                    ...prev,
                    experience: undefined
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [id]: value
            }));

            // Clear error for this field if it exists
            if (errors[id as keyof FormErrors]) {
                setErrors(prev => ({
                    ...prev,
                    [id]: undefined
                }));
            }
        }
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            gender: value
        }));

        if (errors.gender) {
            setErrors(prev => ({
                ...prev,
                gender: undefined
            }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'aadhar' | 'pancard') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Convert file to base64 for storage/preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;

            if (type === 'aadhar') {
                setFormData(prev => ({
                    ...prev,
                    CONTRACTOR: {
                        ...prev.CONTRACTOR,
                        documents: {
                            ...prev.CONTRACTOR.documents,
                            aadhar: {
                                ...prev.CONTRACTOR.documents.aadhar,
                                aadharPhoto: base64String
                            }
                        }
                    }
                }));

                if (errors.aadharPhoto) {
                    setErrors(prev => ({
                        ...prev,
                        aadharPhoto: undefined
                    }));
                }
            } else {
                setFormData(prev => ({
                    ...prev,
                    CONTRACTOR: {
                        ...prev.CONTRACTOR,
                        documents: {
                            ...prev.CONTRACTOR.documents,
                            panCard: {
                                ...prev.CONTRACTOR.documents.panCard,
                                panPhoto: base64String
                            }
                        }
                    }
                }));

                if (errors.panPhoto) {
                    setErrors(prev => ({
                        ...prev,
                        panPhoto: undefined
                    }));
                }
            }
        };
        reader.readAsDataURL(file);
    };

    const handleCaptureBiometric = () => {
        setShowBiometricCapture(true);

        // Simulate biometric capture process
        setTimeout(() => {
            setCaptureComplete(true);

            toast({
                title: "Biometric Captured",
                description: "Thumbprint has been successfully captured and verified.",
            });
        }, 2000);
    };

    const validateForm =  async (): Promise<boolean> => {
        const newErrors: FormErrors = {};

        // Basic validations
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }else{
            // Check if email already exists in the system
            try {
                const response = await userDetails.validateEmailAndContact({ email: formData.email });
                if(response.data.success === false) {
                    newErrors.email = "This email is already registered in the system";
                }
            }catch (error) {
                console.error("Error validating email:", error);
            }
        }

        if (!formData.contactNo.trim()) {
            newErrors.contactNo = "Phone number is required";
        } else if (!/^\+?[0-9]{10,12}$/.test(formData.contactNo.replace(/\s/g, ''))) {
            newErrors.contactNo = "Phone number is invalid";
        }else{
            // Check if contact number already exists in the system
            try {
                const response = await userDetails.validateEmailAndContact({ contactNo: formData.contactNo });
                if(response.data.success === false) {
                    newErrors.contactNo = "This phone number is already registered in the system";
                }
            }catch (error) {
                console.error("Error validating contact number:", error);
            }
        }

        if (!formData.age.trim()) {
            newErrors.age = "Age is required";
        } else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
            newErrors.age = "Age must be between 18 and 100";
        }

        if (!formData.gender) {
            newErrors.gender = "Gender is required";
        }

        if (!formData.CONTRACTOR.documents.aadhar.aadharNumber.trim()) {
            newErrors.aadharNumber = "Aadhar number is required";
        } else if (!/^\d{12}$/.test(formData.CONTRACTOR.documents.aadhar.aadharNumber.replace(/\s/g, ''))) {
            newErrors.aadharNumber = "Aadhar number must be 12 digits";
        } else {
            // Check if Aadhar number already exists in the system
            try {
                const response = await documents.validateDocuments({ aadharNumber: formData.CONTRACTOR.documents.aadhar.aadharNumber });
                if(response.data.success === false) {
                    newErrors.aadharNumber = "This Aadhar number is already registered in the system";
                }
            } catch (error) {
                console.error("Error validating Aadhar number:", error);
            }
        }

        if (!formData.CONTRACTOR.documents.panCard.panNumber.trim()) {
            newErrors.panNumber = "PAN number is required";
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.CONTRACTOR.documents.panCard.panNumber.replace(/\s/g, ''))) {
            newErrors.panNumber = "PAN number format is invalid";
        } else {
            // Check if PAN number already exists in the system
            try {
                const response = await documents.validateDocuments({ panNumber: formData.CONTRACTOR.documents.panCard.panNumber });
                if(response.data.success === false) {
                    newErrors.panNumber = "This Pancard number is already registered in the system";
                }
            } catch (error) {
                console.error("Error validating PAN number:", error);
            }
        }

        if (!formData.CONTRACTOR.documents.aadhar.aadharPhoto) {
            newErrors.aadharPhoto = "Aadhar photo is required";
        }

        if (!formData.CONTRACTOR.documents.panCard.panPhoto) {
            newErrors.panPhoto = "PAN card photo is required";
        }

        if (!formData.CONTRACTOR.experience.trim()) {
            newErrors.experience = "Experience is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddLabourer = async () => {
        if (!await validateForm()) {
            toast({
                title: "Validation Error",
                description: "Please fix the errors in the form.",
                variant: "destructive"
            });
            return;
        }

        console.log("Form Data:", formData); // Debugging line

        setIsSubmitting(true);

        try {
            // Create FormData object
            const formDataObj = new FormData();

            formDataObj.append('name', formData.name);
            formDataObj.append('email', formData.email);
            formDataObj.append('role', 'CONTRACTOR'); // Set role explicitly to CONTRACTOR
            formDataObj.append('age', formData.age);
            formDataObj.append('gender', formData.gender);
            formDataObj.append('contactNo', formData.contactNo);

            // Add nested document fields
            formDataObj.append('documents[aadhar][aadharNumber]', formData.CONTRACTOR.documents.aadhar.aadharNumber);
            formDataObj.append('documents[pancard][panNumber]', formData.CONTRACTOR.documents.panCard.panNumber);

            // Add experience
            formDataObj.append('experience', formData.CONTRACTOR.experience);
            const aadharFile = dataURLtoFile(
                formData.CONTRACTOR.documents.aadhar.aadharPhoto,
                'aadhar.jpg'
            );

            formDataObj.append('files', aadharFile);

            const panFile = dataURLtoFile(
                formData.CONTRACTOR.documents.panCard.panPhoto,
                'pancard.jpg'
            );
            console.log("files---", panFile)
            formDataObj.append('files', panFile);



            console.log("form---", formDataObj);

            const response = await contractors.createContractor(formDataObj);
            console.log("Response:", response); // Debugging line

            if (response.status === HTTP_STATUS_CODE.CREATED) {
                // Show credentials popup
                const credentials = response.data;
                toast({
                    title: "Contractor Added Successfully",
                    description: (
                        <div className="mt-2 space-y-2">
                            <p>Contractor has been added. Here are the login credentials:</p>
                            <div className="bg-slate-100 p-3 rounded-md">
                                <div className="flex justify-between items-center">
                                    <p><strong>Username:</strong> {credentials.userId}</p>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => {
                                            navigator.clipboard.writeText(credentials.userId);
                                            toast({
                                                title: "Copied!",
                                                description: "Username copied to clipboard",
                                                duration: 2000,
                                            });
                                        }}
                                    >
                                        Copy
                                    </Button>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <p><strong>Password:</strong> {credentials.password}</p>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => {
                                            navigator.clipboard.writeText(credentials.password);
                                            toast({
                                                title: "Copied!",
                                                description: "Password copied to clipboard",
                                                duration: 2000,
                                            });
                                        }}
                                    >
                                        Copy
                                    </Button>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full mt-2"
                                    onClick={() => {
                                        const credText = `Username: ${credentials.userId}\nPassword: ${credentials.password}`;
                                        navigator.clipboard.writeText(credText);
                                        toast({
                                            title: "Copied!",
                                            description: "All credentials copied to clipboard",
                                            duration: 2000,
                                        });
                                    }}
                                >
                                    Copy All Credentials
                                </Button>
                            </div>
                            <p className="text-xs text-amber-600">Please save these credentials or share with the contractor.</p>
                        </div>
                    ),
                    duration: 10000, // Show for 20 seconds
                });

                setFormData(initialFormState);
                setCaptureComplete(false);
                setShowBiometricCapture(false);
                setIsOpen(false);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: (error as any).response.data.message || "Failed to add contractor. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper function to convert base64 to File object
    const dataURLtoFile = (dataurl: string, filename: string): File => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add {ContractorConstant.NAME}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Add New {ContractorConstant.NAME}</DialogTitle>
                    <DialogDescription>
                        Enter the details of the new {ContractorConstant.NAME}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter Email Address"
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contactNo">Phone Number <span className="text-red-500">*</span></Label>
                            <Input
                                id="contactNo"
                                value={formData.contactNo}
                                onChange={handleInputChange}
                                placeholder="+91 XXXXX XXXXX"
                                className={errors.contactNo ? "border-red-500" : ""}
                            />
                            {errors.contactNo && <p className="text-red-500 text-xs mt-1">{errors.contactNo}</p>}
                        </div>

                        <div className="flex space-x-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="age">Age <span className="text-red-500">*</span></Label>
                                <Input
                                    id="age"
                                    type="number"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    placeholder="Enter age"
                                    className={errors.age ? "border-red-500" : ""}
                                />
                                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                            </div>

                            <div className="flex-1 space-y-2">
                                <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={handleSelectChange}
                                >
                                    <SelectTrigger id="gender" className={errors.gender ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="aadhar">Aadhar Number <span className="text-red-500">*</span></Label>
                                <Input
                                    id="aadhar"
                                    value={formData.CONTRACTOR.documents.aadhar.aadharNumber}
                                    onChange={handleInputChange}
                                    placeholder="XXXX XXXX XXXX"
                                    className={errors.aadharNumber ? "border-red-500" : ""}
                                />
                                {errors.aadharNumber && <p className="text-red-500 text-xs mt-1">{errors.aadharNumber}</p>}
                            </div>

                            <div className="flex-1 space-y-2">
                                <Label htmlFor="pancard">PAN Number <span className="text-red-500">*</span></Label>
                                <Input
                                    id="pancard"
                                    value={formData.CONTRACTOR.documents.panCard.panNumber}
                                    onChange={handleInputChange}
                                    placeholder="ABCDE1234F"
                                    className={errors.panNumber ? "border-red-500" : ""}
                                />
                                {errors.panNumber && <p className="text-red-500 text-xs mt-1">{errors.panNumber}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience">Experience (years) <span className="text-red-500">*</span></Label>
                            <Input
                                id="experience"
                                type="number"
                                value={formData.CONTRACTOR.experience}
                                onChange={handleInputChange}
                                placeholder="Enter years of experience"
                                className={errors.experience ? "border-red-500" : ""}
                            />
                            {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Aadhar Photo <span className="text-red-500">*</span></Label>
                            <div
                                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${errors.aadharPhoto ? "border-red-500" : ""
                                    } ${formData.CONTRACTOR.documents.aadhar.aadharPhoto ? "bg-gray-50" : ""
                                    }`}
                            >
                                {formData.CONTRACTOR.documents.aadhar.aadharPhoto ? (
                                    <div className="w-full flex flex-col items-center">
                                        <img
                                            src={formData.CONTRACTOR.documents.aadhar.aadharPhoto}
                                            alt="Aadhar"
                                            className="h-32 object-contain mb-2"
                                        />
                                        <p className="text-sm text-green-600 mb-2">
                                            <CheckCircle className="inline h-4 w-4 mr-1" />
                                            File uploaded successfully
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => aadharFileRef.current?.click()}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Change File
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Drag and drop a photo here, or click to browse
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => aadharFileRef.current?.click()}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Browse Files
                                        </Button>
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={aadharFileRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'aadhar')}
                                />
                            </div>
                            {errors.aadharPhoto && <p className="text-red-500 text-xs mt-1">{errors.aadharPhoto}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>PAN Card Photo <span className="text-red-500">*</span></Label>
                            <div
                                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center ${errors.panPhoto ? "border-red-500" : ""
                                    } ${formData.CONTRACTOR.documents.panCard.panPhoto ? "bg-gray-50" : ""
                                    }`}
                            >
                                {formData.CONTRACTOR.documents.panCard.panPhoto ? (
                                    <div className="w-full flex flex-col items-center">
                                        <img
                                            src={formData.CONTRACTOR.documents.panCard.panPhoto}
                                            alt="PAN Card"
                                            className="h-32 object-contain mb-2"
                                        />
                                        <p className="text-sm text-green-600 mb-2">
                                            <CheckCircle className="inline h-4 w-4 mr-1" />
                                            File uploaded successfully
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => panFileRef.current?.click()}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Change File
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Drag and drop a photo here, or click to browse
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => panFileRef.current?.click()}
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Browse Files
                                        </Button>
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={panFileRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'pancard')}
                                />
                            </div>
                            {errors.panPhoto && <p className="text-red-500 text-xs mt-1">{errors.panPhoto}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Biometric Thumbprint</Label>
                            {!showBiometricCapture ? (
                                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                                    <Fingerprint className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Capture the contractor's thumbprint for verification
                                    </p>
                                    <Button variant="outline" size="sm" onClick={handleCaptureBiometric}>
                                        <Fingerprint className="mr-2 h-4 w-4" />
                                        Capture Thumbprint
                                    </Button>
                                </div>
                            ) : (
                                <div className="border rounded-lg p-6 flex flex-col items-center justify-center">
                                    {!captureComplete ? (
                                        <>
                                            <div className="animate-pulse">
                                                <Fingerprint className="h-12 w-12 text-primary mb-2" />
                                            </div>
                                            <p className="text-sm font-medium mb-2">Scanning Thumbprint...</p>
                                            <p className="text-xs text-muted-foreground">
                                                Please keep the thumb pressed on the scanner
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                                            <p className="text-sm font-medium mb-2">Thumbprint Captured Successfully</p>
                                            <p className="text-xs text-muted-foreground">
                                                Biometric data has been verified and stored
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddLabourer} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                                Processing...
                            </>
                        ) : (
                            <>Add {ContractorConstant.NAME}</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}