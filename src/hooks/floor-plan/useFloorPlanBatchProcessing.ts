
/**
 * Hook for batch processing floor plan operations
 * Provides utilities for processing multiple floor plans efficiently
 * @module useFloorPlanBatchProcessing
 */
import { useCallback } from "react";
import { FloorPlan } from "@/types/floorPlan";
import logger from "@/utils/logger";

/**
 * Options for batch processing
 * @interface BatchProcessingOptions
 */
interface BatchProcessingOptions {
  /** Whether to continue processing after errors */
  continueOnError?: boolean;
  /** Maximum concurrent operations */
  concurrency?: number;
  /** Whether to show progress notifications */
  showProgress?: boolean;
}

/**
 * Default options for batch processing
 */
const DEFAULT_OPTIONS: BatchProcessingOptions = {
  continueOnError: false,
  concurrency: 1,
  showProgress: true
};

/**
 * Hook for performing batch operations on floor plans
 * @returns Batch processing functions
 */
export const useFloorPlanBatchProcessing = () => {
  /**
   * Process floor plans in batches
   * @param {FloorPlan[]} floorPlans - Array of floor plans to process
   * @param {Function} processFn - Function to process each floor plan
   * @param {BatchProcessingOptions} options - Processing options
   * @returns {Promise<Array<{success: boolean, plan: FloorPlan, error?: Error}>>} Processing results
   */
  const batchProcessFloorPlans = useCallback(async <T>(
    floorPlans: FloorPlan[],
    processFn: (plan: FloorPlan, index: number) => Promise<T>,
    options: BatchProcessingOptions = DEFAULT_OPTIONS
  ): Promise<Array<{success: boolean, plan: FloorPlan, result?: T, error?: Error}>> => {
    // Merge with default options
    const processOptions = { ...DEFAULT_OPTIONS, ...options };
    const results: Array<{success: boolean, plan: FloorPlan, result?: T, error?: Error}> = [];
    
    try {
      // Process in batches according to concurrency
      const { concurrency = 1 } = processOptions;
      
      // For now we're using sequential processing (concurrency=1)
      // due to fabric.js thread limitations
      for (let i = 0; i < floorPlans.length; i++) {
        const plan = floorPlans[i];
        
        try {
          logger.info(`Processing floor plan ${i+1}/${floorPlans.length}: ${plan.label}`);
          const result = await processFn(plan, i);
          results.push({ success: true, plan, result });
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          logger.error(`Error processing floor plan ${plan.label}:`, errorObj);
          results.push({ success: false, plan, error: errorObj });
          
          // Stop processing if continueOnError is false
          if (!processOptions.continueOnError) {
            break;
          }
        }
      }
      
      return results;
    } catch (error) {
      logger.error('Batch processing error:', error);
      throw error;
    }
  }, []);
  
  return { batchProcessFloorPlans };
};
