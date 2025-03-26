
/**
 * Hook for processing floor plans in chunks to prevent UI freezing
 * Breaks down large operations into manageable chunks for better responsiveness
 * @module useFloorPlanChunkProcessing
 */
import { useCallback } from "react";
import { FloorPlan } from "@/types/floorPlanTypes";
import logger from "@/utils/logger";

/**
 * Options for chunk processing
 * @interface ChunkProcessingOptions
 */
interface ChunkProcessingOptions {
  /** Size of each chunk */
  chunkSize?: number;
  /** Delay between chunks in ms */
  chunkDelay?: number;
  /** Whether to show progress notifications */
  showProgress?: boolean;
  /** Callback for progress updates */
  onProgress?: (processed: number, total: number) => void;
}

/**
 * Default options for chunk processing
 */
const DEFAULT_OPTIONS: ChunkProcessingOptions = {
  chunkSize: 5,
  chunkDelay: 0,
  showProgress: true
};

/**
 * Create a delay promise
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>} Promise that resolves after the delay
 */
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Hook for processing floor plans in chunks to avoid UI freezing
 * @returns Chunk processing utilities
 */
export const useFloorPlanChunkProcessing = () => {
  /**
   * Process floor plans in chunks
   * @param {FloorPlan[]} floorPlans - Array of floor plans to process
   * @param {Function} processFn - Function to process each floor plan
   * @param {ChunkProcessingOptions} options - Processing options
   * @returns {Promise<Array<{success: boolean, plan: FloorPlan, error?: Error}>>} Processing results
   */
  const chunkProcessFloorPlans = useCallback(async <T>(
    floorPlans: FloorPlan[],
    processFn: (plan: FloorPlan) => Promise<T>,
    options: ChunkProcessingOptions = DEFAULT_OPTIONS
  ): Promise<Array<{success: boolean, plan: FloorPlan, result?: T, error?: Error}>> => {
    // Merge with default options
    const processOptions = { ...DEFAULT_OPTIONS, ...options };
    const results: Array<{success: boolean, plan: FloorPlan, result?: T, error?: Error}> = [];
    
    const { chunkSize = 5, chunkDelay = 0, onProgress } = processOptions;
    
    try {
      // Process in chunks
      for (let i = 0; i < floorPlans.length; i += chunkSize) {
        // Get current chunk
        const chunk = floorPlans.slice(i, i + chunkSize);
        
        // Process each item in the chunk
        const chunkPromises = chunk.map(async (plan) => {
          try {
            const result = await processFn(plan);
            return { success: true, plan, result };
          } catch (error) {
            const errorObj = error instanceof Error ? error : new Error(String(error));
            logger.error(`Error processing floor plan ${plan.label}:`, errorObj);
            return { success: false, plan, error: errorObj };
          }
        });
        
        // Wait for all items in this chunk to complete
        const chunkResults = await Promise.all(chunkPromises);
        results.push(...chunkResults);
        
        // Report progress
        if (onProgress) {
          onProgress(Math.min(i + chunkSize, floorPlans.length), floorPlans.length);
        }
        
        // Add delay between chunks if specified
        if (chunkDelay > 0 && i + chunkSize < floorPlans.length) {
          await delay(chunkDelay);
        }
      }
      
      return results;
    } catch (error) {
      logger.error('Chunk processing error:', error);
      throw error;
    }
  }, []);
  
  return { chunkProcessFloorPlans };
};
