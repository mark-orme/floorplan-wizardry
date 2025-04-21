
/**
 * Floor Plan Repository
 * Repository implementation for floor plans
 * @module packages/persistence/adapters/floorPlanRepository
 */

import { FloorPlan } from '@/types/core/floor-plan/FloorPlan';
import { FloorPlanRepository, StorageResult } from '../interfaces';
import { LocalStorageAdapter } from './localStorage';
import logger from '@/utils/logger';

/**
 * LocalStorage-based implementation of FloorPlanRepository
 */
export class LocalStorageFloorPlanRepository implements FloorPlanRepository {
  /**
   * Storage adapter
   */
  private storage: LocalStorageAdapter<FloorPlan>;
  
  /**
   * List key for floor plan IDs
   */
  private readonly FLOOR_PLAN_LIST_KEY = 'floor-plan-list';
  
  /**
   * Constructor
   * @param namespace Namespace for storage keys
   */
  constructor(namespace: string = 'floor-plans') {
    this.storage = new LocalStorageAdapter<FloorPlan>(namespace);
  }
  
  /**
   * Save a floor plan
   * @param floorPlan Floor plan to save
   */
  async saveFloorPlan(floorPlan: FloorPlan): Promise<StorageResult<void>> {
    try {
      // Update the floor plan's updatedAt timestamp
      floorPlan.updatedAt = new Date().toISOString();
      
      // Save the floor plan
      const saveResult = await this.storage.save(floorPlan.id, floorPlan);
      if (!saveResult.success) {
        return saveResult;
      }
      
      // Update the list of floor plan IDs
      const listResult = await this.getFloorPlanIds();
      if (!listResult.success) {
        return listResult;
      }
      
      const ids = listResult.data || [];
      if (!ids.includes(floorPlan.id)) {
        ids.push(floorPlan.id);
        await this.saveFloorPlanIds(ids);
      }
      
      return { success: true };
    } catch (error) {
      logger.error('Failed to save floor plan', { error, floorPlanId: floorPlan.id });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Load a floor plan by ID
   * @param id Floor plan ID
   */
  async loadFloorPlan(id: string): Promise<StorageResult<FloorPlan>> {
    return this.storage.load(id);
  }
  
  /**
   * Delete a floor plan by ID
   * @param id Floor plan ID
   */
  async deleteFloorPlan(id: string): Promise<StorageResult<void>> {
    try {
      // Delete the floor plan
      const deleteResult = await this.storage.delete(id);
      if (!deleteResult.success) {
        return deleteResult;
      }
      
      // Update the list of floor plan IDs
      const listResult = await this.getFloorPlanIds();
      if (!listResult.success) {
        return listResult;
      }
      
      const ids = listResult.data || [];
      const updatedIds = ids.filter(floorPlanId => floorPlanId !== id);
      await this.saveFloorPlanIds(updatedIds);
      
      return { success: true };
    } catch (error) {
      logger.error('Failed to delete floor plan', { error, floorPlanId: id });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * List all floor plans
   */
  async listFloorPlans(): Promise<StorageResult<FloorPlan[]>> {
    try {
      // Get the list of floor plan IDs
      const listResult = await this.getFloorPlanIds();
      if (!listResult.success) {
        return { success: false, error: listResult.error };
      }
      
      const ids = listResult.data || [];
      const floorPlans: FloorPlan[] = [];
      
      // Load each floor plan
      for (const id of ids) {
        const loadResult = await this.loadFloorPlan(id);
        if (loadResult.success && loadResult.data) {
          floorPlans.push(loadResult.data);
        }
      }
      
      return { success: true, data: floorPlans };
    } catch (error) {
      logger.error('Failed to list floor plans', { error });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Get the list of floor plan IDs
   */
  private async getFloorPlanIds(): Promise<StorageResult<string[]>> {
    const result = await this.storage.load(this.FLOOR_PLAN_LIST_KEY);
    if (!result.success) {
      return { success: true, data: [] };
    }
    return result as StorageResult<string[]>;
  }
  
  /**
   * Save the list of floor plan IDs
   * @param ids List of floor plan IDs
   */
  private async saveFloorPlanIds(ids: string[]): Promise<StorageResult<void>> {
    return this.storage.save(this.FLOOR_PLAN_LIST_KEY, ids as any);
  }
}
