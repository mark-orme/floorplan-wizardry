
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
