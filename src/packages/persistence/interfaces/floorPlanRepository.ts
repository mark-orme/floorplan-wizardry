
/**
 * Floor Plan Repository Interface
 * Defines the contract for floor plan storage
 */

import { FloorPlan } from '@/types/core/floor-plan';
import { StorageResult } from './storageResult';

/**
 * Interface for floor plan repositories
 */
export interface FloorPlanRepository {
  /**
   * Get all floor plan IDs
   */
  getAllIds(): Promise<StorageResult<string[]>>;
  
  /**
   * Get a floor plan by ID
   */
  getById(id: string): Promise<StorageResult<FloorPlan>>;
  
  /**
   * Get all floor plans
   */
  getAll(): Promise<StorageResult<FloorPlan[]>>;
  
  /**
   * Save a floor plan
   */
  save(floorPlan: FloorPlan): Promise<StorageResult<FloorPlan>>;
  
  /**
   * Delete a floor plan
   */
  delete(id: string): Promise<StorageResult<void>>;
}
