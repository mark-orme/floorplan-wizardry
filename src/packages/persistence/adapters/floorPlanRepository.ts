
/**
 * Floor Plan Repository
 * Implementation of persistence for floor plans using local storage
 */

import { FloorPlanRepository } from '../interfaces/floorPlanRepository';
import { StorageAdapter } from '../interfaces/storageAdapter';
import { StorageResult } from '../interfaces/storageResult';
import { FloorPlan } from '@/types/core/floor-plan';

/**
 * LocalStorage-based implementation of FloorPlanRepository
 */
export class LocalStorageFloorPlanRepository implements FloorPlanRepository {
  private storage: StorageAdapter;
  private readonly keyPrefix: string = 'floorplan_';
  private readonly idsKey: string = 'floorplan_ids';

  /**
   * Create a new LocalStorageFloorPlanRepository
   * @param storage Storage adapter to use
   */
  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  /**
   * Get all floor plan IDs
   * @returns Promise resolving to array of floor plan IDs
   */
  async getAllIds(): Promise<StorageResult<string[]>> {
    try {
      const result = await this.storage.getItem<string[]>(this.idsKey);
      
      if (result.success && result.data) {
        return result;
      }
      
      // If no IDs found, initialize with empty array
      return { success: true, data: [] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error getting floor plan IDs'
      };
    }
  }

  /**
   * Save a floor plan ID to the list of IDs
   * @param id Floor plan ID to save
   */
  private async saveId(id: string): Promise<StorageResult<void>> {
    try {
      // Get current list of IDs
      const idsResult = await this.getAllIds();
      
      if (!idsResult.success) {
        return { 
          success: false, 
          error: idsResult.error 
        };
      }
      
      const ids = idsResult.data || [];
      
      // Only add ID if it doesn't already exist
      if (!ids.includes(id)) {
        ids.push(id);
        
        // Save updated list
        const saveResult = await this.storage.setItem(this.idsKey, ids);
        
        if (!saveResult.success) {
          return { 
            success: false, 
            error: saveResult.error 
          };
        }
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error saving floor plan ID'
      };
    }
  }

  /**
   * Remove a floor plan ID from the list of IDs
   * @param id Floor plan ID to remove
   */
  private async removeId(id: string): Promise<StorageResult<void>> {
    try {
      // Get current list of IDs
      const idsResult = await this.getAllIds();
      
      if (!idsResult.success) {
        return { 
          success: false, 
          error: idsResult.error 
        };
      }
      
      const ids = idsResult.data || [];
      
      // Filter out the ID to remove
      const updatedIds = ids.filter(existingId => existingId !== id);
      
      // Save updated list
      const saveResult = await this.storage.setItem(this.idsKey, updatedIds);
      
      if (!saveResult.success) {
        return { 
          success: false, 
          error: saveResult.error 
        };
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error removing floor plan ID'
      };
    }
  }

  /**
   * Get a floor plan by ID
   * @param id Floor plan ID
   * @returns Promise resolving to floor plan
   */
  async getById(id: string): Promise<StorageResult<FloorPlan>> {
    try {
      const key = `${this.keyPrefix}${id}`;
      return await this.storage.getItem<FloorPlan>(key);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error getting floor plan'
      };
    }
  }

  /**
   * Get all floor plans
   * @returns Promise resolving to array of floor plans
   */
  async getAll(): Promise<StorageResult<FloorPlan[]>> {
    try {
      const idsResult = await this.getAllIds();
      
      if (!idsResult.success) {
        return {
          success: false,
          error: idsResult.error
        };
      }
      
      const ids = idsResult.data || [];
      const floorPlans: FloorPlan[] = [];
      
      // Load each floor plan by ID
      for (const id of ids) {
        const result = await this.getById(id);
        
        if (result.success && result.data) {
          floorPlans.push(result.data);
        }
      }
      
      return {
        success: true,
        data: floorPlans
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error getting all floor plans'
      };
    }
  }

  /**
   * Save a floor plan
   * @param floorPlan Floor plan to save
   * @returns Promise resolving to saved floor plan
   */
  async save(floorPlan: FloorPlan): Promise<StorageResult<FloorPlan>> {
    try {
      const key = `${this.keyPrefix}${floorPlan.id}`;
      
      // Update timestamps
      const now = new Date().toISOString();
      const updatedFloorPlan = {
        ...floorPlan,
        updatedAt: now
      };
      
      // Save floor plan
      const saveResult = await this.storage.setItem(key, updatedFloorPlan);
      
      if (!saveResult.success) {
        return {
          success: false,
          error: saveResult.error
        };
      }
      
      // Add ID to list of IDs
      await this.saveId(floorPlan.id);
      
      return {
        success: true,
        data: updatedFloorPlan
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error saving floor plan'
      };
    }
  }

  /**
   * Delete a floor plan by ID
   * @param id Floor plan ID to delete
   * @returns Promise resolving to success/failure
   */
  async delete(id: string): Promise<StorageResult<void>> {
    try {
      const key = `${this.keyPrefix}${id}`;
      
      // Delete floor plan
      const deleteResult = await this.storage.removeItem(key);
      
      if (!deleteResult.success) {
        return {
          success: false,
          error: deleteResult.error
        };
      }
      
      // Remove ID from list of IDs
      await this.removeId(id);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error deleting floor plan'
      };
    }
  }
}
