
import { useState, useCallback } from 'react';
import { FloorPlan } from '@/types/FloorPlan';
import { captureMessage } from '@/utils/sentryUtils';

interface UseFloorPlanBatchProcessingOptions {
  batchSize?: number;
  onBatchComplete?: (processed: FloorPlan[]) => void;
  onError?: (error: Error) => void;
}

export const useFloorPlanBatchProcessing = (
  options: UseFloorPlanBatchProcessingOptions = {}
) => {
  const {
    batchSize = 5,
    onBatchComplete,
    onError
  } = options;

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  /**
   * Process floor plans in batches
   */
  const processInBatches = useCallback(async (
    floorPlans: FloorPlan[],
    processFunc: (plan: FloorPlan) => Promise<FloorPlan>
  ) => {
    if (!floorPlans.length) return [];
    
    setIsProcessing(true);
    setProgress(0);
    setProcessedCount(0);
    
    const results: FloorPlan[] = [];
    const totalCount = floorPlans.length;
    
    try {
      for (let i = 0; i < totalCount; i += batchSize) {
        const batch = floorPlans.slice(i, i + batchSize);
        const batchPromises = batch.map(async (plan) => {
          try {
            const processed = await processFunc(plan);
            setProcessedCount(prev => prev + 1);
            setProgress(Math.floor(((i + results.length + 1) / totalCount) * 100));
            return processed;
          } catch (err) {
            captureMessage(`Error processing floor plan ${plan.label || plan.name}: ${err.message}`, {
              level: 'error'
            });
            throw err;
          }
        });
        
        const batchResults = await Promise.allSettled(batchPromises);
        const successfulResults = batchResults
          .filter((result): result is PromiseFulfilledResult<FloorPlan> => result.status === 'fulfilled')
          .map(result => result.value);
        
        results.push(...successfulResults);
        
        if (onBatchComplete) {
          onBatchComplete(successfulResults);
        }
      }
      
      return results;
    } catch (error) {
      if (onError) {
        onError(error);
      }
      return results;
    } finally {
      setIsProcessing(false);
    }
  }, [batchSize, onBatchComplete, onError]);

  return {
    processInBatches,
    isProcessing,
    progress,
    processedCount
  };
};
