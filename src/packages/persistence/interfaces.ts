
/**
 * Persistence Interfaces
 * Interface definitions for persistence adapters
 * @module packages/persistence/interfaces
 */

import { FloorPlan } from '@/types/core/floor-plan/FloorPlan';

/**
 * Storage result interface
 */
export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Storage adapter interface
 */
export interface StorageAdapter<T> {
  /**
   * Save data to storage
   * @param key Storage key
   * @param data Data to save
   */
  save(key: string, data: T): Promise<StorageResult<void>>;
  
  /**
   * Load data from storage
   * @param key Storage key
   */
  load(key: string): Promise<StorageResult<T>>;
  
  /**
   * Delete data from storage
   * @param key Storage key
   */
  delete(key: string): Promise<StorageResult<void>>;
  
  /**
   * List all keys in storage
   */
  listKeys(): Promise<StorageResult<string[]>>;
}

/**
 * Floor plan repository interface
 */
export interface FloorPlanRepository {
  /**
   * Save a floor plan
   * @param floorPlan Floor plan to save
   */
  saveFloorPlan(floorPlan: FloorPlan): Promise<StorageResult<void>>;
  
  /**
   * Load a floor plan by ID
   * @param id Floor plan ID
   */
  loadFloorPlan(id: string): Promise<StorageResult<FloorPlan>>;
  
  /**
   * Delete a floor plan by ID
   * @param id Floor plan ID
   */
  deleteFloorPlan(id: string): Promise<StorageResult<void>>;
  
  /**
   * List all floor plans
   */
  listFloorPlans(): Promise<StorageResult<FloorPlan[]>>;
}
