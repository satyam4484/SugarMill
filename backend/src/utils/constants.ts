export enum UserRole {
    ADMIN = 'ADMIN',
    MILL_OWNER = 'MILL_OWNER',
    CONTRACTOR = 'CONTRACTOR',
    LABOURER = 'LABOURER'
}

export enum VerificationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export enum ContractStatus {
    AWAITING = 'AWAITING',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
    PAID = 'PAID',
    PENDING = 'PENDING',
    FAILED = 'FAILED'
}

export enum GenderValues {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other'
}

export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Forbidden access',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
    DUPLICATE_EMAIL: 'Email already exists',
    DUPLICATE_AADHAR: 'Aadhar already exists',
    INVALID_TOKEN: 'Invalid token',
    EXPIRED_TOKEN: 'Token expired',
    INVALID_ROLE: 'Invalid role',
    DUPLICATE_BOOKING: 'Labourer already booked',
    SUBSCRIPTION_EXPIRED: 'Subscription expired',
    INVALID_CONTRACT: 'Invalid contract details',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
};

export const SUCCESS_MESSAGES = {
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    LOGIN_SUCCESS: 'Login successful',
    DOCUMENT_VERIFIED: 'Document verified successfully',
    CONTRACT_CREATED: 'Contract created successfully',
    TEAM_CREATED: 'Team created successfully',
    LABOURER_ADDED: 'Labourer added successfully',
    SUBSCRIPTION_CREATED: 'Subscription created successfully'
};