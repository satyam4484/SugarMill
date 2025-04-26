// Mock data for the application

// User types
export type UserRole = "admin" | "mill-owner" | "contractor" | "supervisor" | "labourer"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  status: "active" | "inactive"
  createdAt: string
}

// Mill Owners
export interface MillOwner {
  id: string
  name: string
  email: string
  phone: string
  location: string
  status: "active" | "inactive"
  subscriptionStatus: "active" | "expired" | "pending"
  subscriptionExpiry: string
  totalContracts: number
  createdAt: string
}

// Contractors
export interface Contractor {
  id: string
  name: string
  email: string
  phone: string
  aadharNumber: string
  totalLabourers: number
  activeContracts: number
  status: "active" | "inactive"
  createdAt: string
}

// Labourers
export interface Labourer {
  id: string
  name: string
  aadharNumber: string
  phone: string
  age: number
  gender: "male" | "female" | "other"
  contractorId: string
  contractorName: string
  status: "active" | "inactive"
  biometricVerified: boolean
  photoUrl?: string
  conflicts: boolean
  createdAt: string
}

// Contracts
export interface Contract {
  id: string
  millOwnerId: string
  millOwnerName: string
  contractorId: string
  contractorName: string
  startDate: string
  endDate: string
  advanceAmount: number
  totalLabourers: number
  status: "active" | "completed" | "pending" | "rejected" | "expired"
  documentUrl?: string
  createdAt: string
  conflicts: boolean
}

// Invoices
export interface Invoice {
  id: string
  userId: string
  userName: string
  amount: number
  status: "paid" | "unpaid" | "overdue"
  dueDate: string
  createdAt: string
}

// Notifications
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
  createdAt: string
}

// Attendance
export interface Attendance {
  id: string
  labourerId: string
  labourerName: string
  contractId: string
  date: string
  status: "present" | "absent" | "half-day"
  verifiedBy: string
  createdAt: string
}

// Mock data generators
export const mockMillOwners: MillOwner[] = [
  {
    id: "1",
    name: "Ganesh Sugar Mills",
    email: "info@ganeshsugarmills.com",
    phone: "+91 9876543210",
    location: "Pune, Maharashtra",
    status: "active",
    subscriptionStatus: "active",
    subscriptionExpiry: "2024-12-31",
    totalContracts: 12,
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Krishna Sugar Factory",
    email: "contact@krishnasugar.com",
    phone: "+91 9876543211",
    location: "Kolhapur, Maharashtra",
    status: "active",
    subscriptionStatus: "active",
    subscriptionExpiry: "2024-11-30",
    totalContracts: 8,
    createdAt: "2023-02-10",
  },
  {
    id: "3",
    name: "Shree Renuka Sugars",
    email: "info@renukasugar.com",
    phone: "+91 9876543212",
    location: "Belgaum, Karnataka",
    status: "active",
    subscriptionStatus: "expired",
    subscriptionExpiry: "2024-03-15",
    totalContracts: 15,
    createdAt: "2023-01-05",
  },
  {
    id: "4",
    name: "Bajaj Hindusthan Sugar",
    email: "contact@bajajsugar.com",
    phone: "+91 9876543213",
    location: "Lucknow, Uttar Pradesh",
    status: "inactive",
    subscriptionStatus: "expired",
    subscriptionExpiry: "2024-02-28",
    totalContracts: 20,
    createdAt: "2022-12-20",
  },
  {
    id: "5",
    name: "EID Parry Sugar",
    email: "info@eidparry.com",
    phone: "+91 9876543214",
    location: "Chennai, Tamil Nadu",
    status: "active",
    subscriptionStatus: "pending",
    subscriptionExpiry: "2024-10-15",
    totalContracts: 10,
    createdAt: "2023-03-01",
  },
]

export const mockContractors: Contractor[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 9876543220",
    aadharNumber: "1234 5678 9012",
    totalLabourers: 45,
    activeContracts: 3,
    status: "active",
    createdAt: "2023-01-20",
  },
  {
    id: "2",
    name: "Sunil Patil",
    email: "sunil@example.com",
    phone: "+91 9876543221",
    aadharNumber: "2345 6789 0123",
    totalLabourers: 32,
    activeContracts: 2,
    status: "active",
    createdAt: "2023-02-15",
  },
  {
    id: "3",
    name: "Manoj Singh",
    email: "manoj@example.com",
    phone: "+91 9876543222",
    aadharNumber: "3456 7890 1234",
    totalLabourers: 28,
    activeContracts: 1,
    status: "active",
    createdAt: "2023-01-10",
  },
  {
    id: "4",
    name: "Prakash Jadhav",
    email: "prakash@example.com",
    phone: "+91 9876543223",
    aadharNumber: "4567 8901 2345",
    totalLabourers: 50,
    activeContracts: 4,
    status: "inactive",
    createdAt: "2022-12-25",
  },
  {
    id: "5",
    name: "Ramesh Sharma",
    email: "ramesh@example.com",
    phone: "+91 9876543224",
    aadharNumber: "5678 9012 3456",
    totalLabourers: 38,
    activeContracts: 2,
    status: "active",
    createdAt: "2023-03-05",
  },
]

export const mockLabourers: Labourer[] = [
  {
    id: "1",
    name: "Santosh Kamble",
    aadharNumber: "6789 0123 4567",
    phone: "+91 9876543230",
    age: 32,
    gender: "male",
    contractorId: "1",
    contractorName: "Rajesh Kumar",
    status: "active",
    biometricVerified: true,
    photoUrl: "/placeholder.svg?height=100&width=100",
    conflicts: false,
    createdAt: "2023-02-01",
  },
  {
    id: "2",
    name: "Lakshmi Devi",
    aadharNumber: "7890 1234 5678",
    phone: "+91 9876543231",
    age: 28,
    gender: "female",
    contractorId: "1",
    contractorName: "Rajesh Kumar",
    status: "active",
    biometricVerified: true,
    photoUrl: "/placeholder.svg?height=100&width=100",
    conflicts: false,
    createdAt: "2023-02-05",
  },
  {
    id: "3",
    name: "Raju Patil",
    aadharNumber: "8901 2345 6789",
    phone: "+91 9876543232",
    age: 35,
    gender: "male",
    contractorId: "2",
    contractorName: "Sunil Patil",
    status: "active",
    biometricVerified: true,
    photoUrl: "/placeholder.svg?height=100&width=100",
    conflicts: true,
    createdAt: "2023-01-25",
  },
  {
    id: "4",
    name: "Savita Kumari",
    aadharNumber: "9012 3456 7890",
    phone: "+91 9876543233",
    age: 30,
    gender: "female",
    contractorId: "2",
    contractorName: "Sunil Patil",
    status: "inactive",
    biometricVerified: false,
    photoUrl: "/placeholder.svg?height=100&width=100",
    conflicts: false,
    createdAt: "2023-02-10",
  },
  {
    id: "5",
    name: "Ganesh Mane",
    aadharNumber: "0123 4567 8901",
    phone: "+91 9876543234",
    age: 40,
    gender: "male",
    contractorId: "3",
    contractorName: "Manoj Singh",
    status: "active",
    biometricVerified: true,
    photoUrl: "/placeholder.svg?height=100&width=100",
    conflicts: false,
    createdAt: "2023-01-15",
  },
  {
    id: "6",
    name: "Sunita Jadhav",
    aadharNumber: "1234 5678 9012",
    phone: "+91 9876543235",
    age: 27,
    gender: "female",
    contractorId: "3",
    contractorName: "Manoj Singh",
    status: "active",
    biometricVerified: true,
    photoUrl: "/placeholder.svg?height=100&width=100",
    conflicts: true,
    createdAt: "2023-02-15",
  },
  {
    id: "7",
    name: "Rahul Sawant",
    aadharNumber: "2345 6789 0123",
    phone: "+91 9876543236",
    age: 33,
    gender: "male",
    contractorId: "4",
    contractorName: "Prakash Jadhav",
    status: "active",
    biometricVerified: false,
    photoUrl: "/placeholder.svg?height=100&width=100",
    conflicts: false,
    createdAt: "2023-01-20",
  },
  {
    id: "8",
    name: "Anita Sharma",
    aadharNumber: "3456 7890 1234",
    phone: "+91 9876543237",
    age: 29,
    gender: "female",
    contractorId: "4",
    contractorName: "Prakash Jadhav",
    status: "active",
    biometricVerified: true,
    photoUrl: "/placeholder.svg?height=100&width=100",
    conflicts: false,
    createdAt: "2023-02-20",
  },
]

export const mockContracts: Contract[] = [
  {
    id: "1",
    millOwnerId: "1",
    millOwnerName: "Ganesh Sugar Mills",
    contractorId: "1",
    contractorName: "Rajesh Kumar",
    startDate: "2024-01-01",
    endDate: "2024-06-30",
    advanceAmount: 250000,
    totalLabourers: 25,
    status: "active",
    documentUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-12-15",
    conflicts: false,
  },
  {
    id: "2",
    millOwnerId: "1",
    millOwnerName: "Ganesh Sugar Mills",
    contractorId: "2",
    contractorName: "Sunil Patil",
    startDate: "2024-02-01",
    endDate: "2024-07-31",
    advanceAmount: 200000,
    totalLabourers: 20,
    status: "active",
    documentUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2024-01-15",
    conflicts: true,
  },
  {
    id: "3",
    millOwnerId: "2",
    millOwnerName: "Krishna Sugar Factory",
    contractorId: "3",
    contractorName: "Manoj Singh",
    startDate: "2023-11-01",
    endDate: "2024-04-30",
    advanceAmount: 180000,
    totalLabourers: 18,
    status: "active",
    documentUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-10-15",
    conflicts: false,
  },
  {
    id: "4",
    millOwnerId: "3",
    millOwnerName: "Shree Renuka Sugars",
    contractorId: "4",
    contractorName: "Prakash Jadhav",
    startDate: "2023-12-01",
    endDate: "2024-05-31",
    advanceAmount: 300000,
    totalLabourers: 30,
    status: "active",
    documentUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-11-15",
    conflicts: false,
  },
  {
    id: "5",
    millOwnerId: "4",
    millOwnerName: "Bajaj Hindusthan Sugar",
    contractorId: "5",
    contractorName: "Ramesh Sharma",
    startDate: "2023-10-01",
    endDate: "2024-03-31",
    advanceAmount: 220000,
    totalLabourers: 22,
    status: "completed",
    documentUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-09-15",
    conflicts: false,
  },
  {
    id: "6",
    millOwnerId: "5",
    millOwnerName: "EID Parry Sugar",
    contractorId: "1",
    contractorName: "Rajesh Kumar",
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    advanceAmount: 270000,
    totalLabourers: 27,
    status: "pending",
    documentUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2024-02-15",
    conflicts: true,
  },
]

export const mockInvoices: Invoice[] = [
  {
    id: "1",
    userId: "1",
    userName: "Ganesh Sugar Mills",
    amount: 50000,
    status: "paid",
    dueDate: "2024-01-31",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    userId: "2",
    userName: "Krishna Sugar Factory",
    amount: 50000,
    status: "paid",
    dueDate: "2024-02-28",
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    userId: "3",
    userName: "Shree Renuka Sugars",
    amount: 50000,
    status: "overdue",
    dueDate: "2024-03-31",
    createdAt: "2024-03-01",
  },
  {
    id: "4",
    userId: "4",
    userName: "Bajaj Hindusthan Sugar",
    amount: 50000,
    status: "unpaid",
    dueDate: "2024-04-30",
    createdAt: "2024-04-01",
  },
  {
    id: "5",
    userId: "5",
    userName: "EID Parry Sugar",
    amount: 50000,
    status: "unpaid",
    dueDate: "2024-05-31",
    createdAt: "2024-05-01",
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    title: "Contract Renewal",
    message: "Your contract with Rajesh Kumar is due for renewal in 30 days.",
    read: false,
    type: "info",
    createdAt: "2024-04-01T10:30:00",
  },
  {
    id: "2",
    userId: "1",
    title: "Conflict Detected",
    message: "A conflict has been detected with labourer Raju Patil.",
    read: false,
    type: "warning",
    createdAt: "2024-04-02T09:15:00",
  },
  {
    id: "3",
    userId: "2",
    title: "Payment Received",
    message: "Payment of ₹50,000 has been received for invoice #2.",
    read: true,
    type: "success",
    createdAt: "2024-03-15T14:45:00",
  },
  {
    id: "4",
    userId: "3",
    title: "Subscription Expiring",
    message: "Your subscription is expiring in 15 days. Please renew to avoid service interruption.",
    read: false,
    type: "warning",
    createdAt: "2024-04-01T11:20:00",
  },
  {
    id: "5",
    userId: "4",
    title: "New Contractor Added",
    message: "A new contractor Ramesh Sharma has been added to the system.",
    read: true,
    type: "info",
    createdAt: "2024-03-20T16:30:00",
  },
]

export const mockAttendance: Attendance[] = [
  {
    id: "1",
    labourerId: "1",
    labourerName: "Santosh Kamble",
    contractId: "1",
    date: "2024-04-01",
    status: "present",
    verifiedBy: "Supervisor 1",
    createdAt: "2024-04-01T18:00:00",
  },
  {
    id: "2",
    labourerId: "2",
    labourerName: "Lakshmi Devi",
    contractId: "1",
    date: "2024-04-01",
    status: "present",
    verifiedBy: "Supervisor 1",
    createdAt: "2024-04-01T18:00:00",
  },
  {
    id: "3",
    labourerId: "3",
    labourerName: "Raju Patil",
    contractId: "2",
    date: "2024-04-01",
    status: "absent",
    verifiedBy: "Supervisor 2",
    createdAt: "2024-04-01T18:00:00",
  },
  {
    id: "4",
    labourerId: "4",
    labourerName: "Savita Kumari",
    contractId: "2",
    date: "2024-04-01",
    status: "present",
    verifiedBy: "Supervisor 2",
    createdAt: "2024-04-01T18:00:00",
  },
  {
    id: "5",
    labourerId: "5",
    labourerName: "Ganesh Mane",
    contractId: "3",
    date: "2024-04-01",
    status: "half-day",
    verifiedBy: "Supervisor 3",
    createdAt: "2024-04-01T18:00:00",
  },
]

// Dashboard statistics
export const mockAdminStats = {
  totalAgreements: 125,
  activeAgreements: 78,
  conflictWarnings: 12,
  activeSubscriptions: 42,
  totalMillOwners: 45,
  totalContractors: 68,
  totalLabourers: 1250,
  revenueThisMonth: 250000,
}

export const mockMillOwnerStats = {
  totalContracts: 15,
  activeContracts: 8,
  pendingContracts: 3,
  expiringContracts: 2,
  totalLabourers: 180,
  conflictWarnings: 4,
  advanceAmount: 750000,
  contractsThisMonth: 2,
}

export const mockContractorStats = {
  totalLabourers: 45,
  activeLabourers: 38,
  inactiveLabourers: 7,
  activeContracts: 3,
  pendingContracts: 2,
  completedContracts: 12,
  totalEarnings: 1250000,
  earningsThisMonth: 120000,
}

export const mockSupervisorStats = {
  teamSize: 25,
  presentToday: 22,
  absentToday: 3,
  averageAttendance: 92,
  activeContracts: 2,
  pendingTasks: 5,
  completedTasks: 18,
}
