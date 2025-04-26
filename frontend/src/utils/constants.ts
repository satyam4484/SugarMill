// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// App Configuration
export const APP_NAME = 'TypeScript Template';
export const DEFAULT_LOCALE = 'en';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 1;

// Theme
export const THEME = {
  colors: {
    primary: '#3B82F6',    // blue-500
    secondary: '#6B7280',  // gray-500
    success: '#10B981',    // green-500
    error: '#EF4444',      // red-500
    warning: '#F59E0B',    // amber-500
    info: '#3B82F6'        // blue-500
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  }
};