import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with Tailwind's class merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL of the application
 * Used for email templates to generate absolute URLs
 */
export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // In browser, use the current origin
    return window.location.origin;
  }
  
  // In server-side code, use environment variable or fallback to localhost
  return process.env.NEXT_PUBLIC_APP_URL || 
         process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` || 
         'http://localhost:3000';
}