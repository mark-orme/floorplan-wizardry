
/**
 * Unified Floor Plan Types
 * Central export point for all floor plan types
 * @module types/floor-plan
 */

// Re-export all types from unifiedTypes to have a single source of truth
export * from './unifiedTypes';

// Also re-export type adapters for backward compatibility
export * from '../utils/floorPlanTypeAdapter';
