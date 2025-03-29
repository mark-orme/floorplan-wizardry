
/**
 * Grid export helpers
 * 
 * This file contains utilities to help ensure proper exports
 * across the grid module ecosystem. It provides a way to track
 * and document exported functions, types, and constants.
 * 
 * @module grid/exportHelpers
 */

import { Canvas, Object as FabricObject } from "fabric";

/**
 * Create a registry of exported functions for documentation
 * and runtime verification.
 * 
 * @example
 * // Check if a function exists at runtime
 * if (GridRegistry.has('createGrid')) {
 *   console.log('createGrid is available');
 * }
 */
export class GridRegistry {
  private static registry = new Map<string, Function | object>();

  /**
   * Register a function or object in the registry
   * 
   * @param name - Name of the export
   * @param fn - The exported function or object
   * @returns The original function/object (for chaining)
   */
  static register<T extends Function | object>(name: string, fn: T): T {
    this.registry.set(name, fn);
    return fn;
  }

  /**
   * Check if a function or object is registered
   * 
   * @param name - Name to check
   * @returns Whether the name is registered
   */
  static has(name: string): boolean {
    return this.registry.has(name);
  }

  /**
   * Get a registered function or object
   * 
   * @param name - Name to retrieve
   * @returns The registered function/object or undefined
   */
  static get(name: string): Function | object | undefined {
    return this.registry.get(name);
  }

  /**
   * Get all registered names
   * 
   * @returns Array of registered names
   */
  static getAllExports(): string[] {
    return Array.from(this.registry.keys());
  }
}

/**
 * Verify if all required grid exports are available
 * Useful for runtime checks to ensure all needed functions
 * have been properly exported
 * 
 * @param exportNames - Array of export names to verify
 * @returns Object with missing exports if any
 */
export function verifyRequiredExports(exportNames: string[]): { 
  valid: boolean; 
  missing: string[] 
} {
  const missing = exportNames.filter(name => !GridRegistry.has(name));
  return {
    valid: missing.length === 0,
    missing
  };
}

/**
 * Track the usage of grid functions to detect unused exports
 * Uses a simple counter to track how many times each function is called
 */
export class ExportUsageTracker {
  private static usageCounts = new Map<string, number>();

  /**
   * Track usage of an exported function
   * 
   * @param name - Name of the export
   */
  static trackUsage(name: string): void {
    const currentCount = this.usageCounts.get(name) || 0;
    this.usageCounts.set(name, currentCount + 1);
  }

  /**
   * Get usage statistics for exports
   * 
   * @returns Object with usage statistics
   */
  static getUsageStats(): { name: string; count: number }[] {
    return Array.from(this.usageCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get unused exports
   * 
   * @returns Array of unused export names
   */
  static getUnusedExports(): string[] {
    const allExports = GridRegistry.getAllExports();
    const usedExports = Array.from(this.usageCounts.keys());
    
    return allExports.filter(name => !usedExports.includes(name));
  }
}

// Export a set of known grid-related exports for verification
export const REQUIRED_GRID_EXPORTS = [
  'createBasicEmergencyGrid',
  'forceCreateGrid',
  'validateGrid',
  'verifyGridExists',
  'ensureGrid',
  'createCompleteGrid',
  'retryWithBackoff',
  'reorderGridObjects'
];
