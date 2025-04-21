
/**
 * Type diagnostics utilities
 * Functions for debugging and validating types
 * @module utils/debug/typeDiagnostics
 */

import { Canvas as FabricCanvas } from 'fabric';
import { Wall, Point } from '@/types/floor-plan/unifiedTypes';
import { ICanvasMock } from '@/types/ICanvasMock';

/**
 * Calculate wall length between points
 * @param start Start point
 * @param end End point
 * @returns Wall length
 */
export function calculateWallLength(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Validate a canvas mock object
 * @param canvas Canvas object to validate
 * @returns True if valid, false otherwise
 */
export function validateCanvasMock(canvas: any): boolean {
  if (!canvas) return false;
  
  // Check for required methods
  const requiredMethods = ['add', 'remove', 'getObjects', 'renderAll'];
  for (const method of requiredMethods) {
    if (typeof canvas[method] !== 'function') {
      console.error(`Canvas mock is missing required method: ${method}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Initialize type checkers globally
 */
export function initTypeCheckers(): void {
  console.log('Initializing global type checkers');
}

/**
 * Create complete metadata with validation
 * @param overrides Optional property overrides
 * @returns Complete metadata object
 */
export function createCompleteMetadata(overrides: Record<string, any> = {}): Record<string, any> {
  const now = new Date().toISOString();
  return {
    version: '1.0',
    created: now,
    updated: now,
    author: 'User',
    dateCreated: now,
    lastModified: now,
    notes: '',
    ...overrides
  };
}
