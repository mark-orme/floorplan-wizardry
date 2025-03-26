
/**
 * General utility functions module
 * Provides helper functions for various operations
 * @module utils
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class name values into a single string
 * Uses clsx and tailwind-merge to handle conditional classes and conflicts
 * 
 * @param {...ClassValue[]} inputs - Class names, objects, or arrays to merge
 * @returns {string} Merged class name string with Tailwind conflicts resolved
 * 
 * @example
 * // Returns "bg-blue-500 text-white p-4"
 * cn("bg-blue-500", "text-white", "p-4")
 * 
 * @example
 * // Returns "bg-red-500 text-white" (bg-red-500 takes precedence)
 * cn("bg-blue-500 text-white", { "bg-red-500": true })
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as a currency string
 * Uses the Intl.NumberFormat API for localized currency formatting
 * 
 * @param {number} value - The number to format
 * @param {string} [currency="USD"] - The currency code
 * @param {string} [locale="en-US"] - The locale to use for formatting
 * @returns {string} Formatted currency string
 * 
 * @example
 * // Returns "$1,234.56"
 * formatCurrency(1234.56)
 * 
 * @example
 * // Returns "£1,234.56"
 * formatCurrency(1234.56, "GBP", "en-GB")
 */
export function formatCurrency(
  value: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

/**
 * Formats a date to a human-readable string
 * Uses the toLocaleDateString method for localized date formatting
 * 
 * @param {Date | string | number} date - The date to format
 * @param {string} [locale="en-US"] - The locale to use for formatting
 * @returns {string} Formatted date string
 * 
 * @example
 * // Returns "Jan 1, 2023"
 * formatDate(new Date(2023, 0, 1))
 * 
 * @example
 * // Returns "1 Jan 2023" (with en-GB locale)
 * formatDate(new Date(2023, 0, 1), "en-GB")
 */
export function formatDate(
  date: Date | string | number,
  locale: string = "en-US"
): string {
  const dateObj = typeof date === "string" || typeof date === "number" 
    ? new Date(date) 
    : date;
  
  return dateObj.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Truncates a string to a maximum length and adds an ellipsis if truncated
 * Useful for displaying long text in constrained spaces
 * 
 * @param {string} str - The string to truncate
 * @param {number} [maxLength=50] - Maximum length before truncation
 * @returns {string} Truncated string
 * 
 * @example
 * // Returns "This is a..."
 * truncateString("This is a long string", 10)
 * 
 * @example
 * // Returns "Short" (no truncation needed)
 * truncateString("Short", 10)
 */
export function truncateString(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}
