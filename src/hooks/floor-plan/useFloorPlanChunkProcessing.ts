
import { useState, useCallback } from 'react';
import { FloorPlan } from '@/types/FloorPlan';

interface UseFloorPlanChunkProcessingOptions {
  chunkSize?: number;
  chunkDelay?: number;
  onChunkComplete?: (processed: FloorPlan[], chunkIndex: number) => void;
  onError?: (error: Error, chunkIndex: number) => void;
  onComplete?: (results: FloorPlan[]) => void;
}

/**
 * Hook for processing floor plans in chunks with built-in throttling
 * Useful for handling large datasets without blocking the main thread
 */
export const useFloorPlanChunkProcessing = (
  options: UseFloorPlanChunkProcessingOptions = {}
) => {
  const {
    chunkSize = 10,
    chunkDelay = 100,
    onChunkComplete,
    onError,
    onComplete
  } = options;

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentChunk, setCurrentChunk] = useState(0);

  /**
   * Process floor plans in chunks with delays between each chunk
   */
  const processInChunks = useCallback(async (
    floorPlans: FloorPlan[],
    processFunc: (plan: FloorPlan, index: number) => Promise<FloorPlan>
  ) => {
    if (!floorPlans.length) return [];
    
    setIsProcessing(true);
    setProgress(0);
    setCurrentChunk(0);
    
    const results: FloorPlan[] = [];
    const chunks = Math.ceil(floorPlans.length / chunkSize);
    
    const processChunk = async (chunkIndex: number): Promise<FloorPlan[]> => {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, floorPlans.length);
      const chunk = floorPlans.slice(start, end);
      const chunkResults: FloorPlan[] = [];
      
      for (let i = 0; i < chunk.length; i++) {
        try {
          const currentPlan = chunk[i];
          const processed = await processFunc(currentPlan, start + i);
          chunkResults.push(processed);
        } catch (error) {
          if (onError) {
            onError(error, chunkIndex);
          }
          console.error(`Error processing floor plan ${chunk[i].label || chunk[i].name}:`, error);
        }
      }
      
      if (onChunkComplete) {
        onChunkComplete(chunkResults, chunkIndex);
      }
      
      return chunkResults;
    };
    
    // Process all chunks sequentially with delays
    for (let i = 0; i < chunks; i++) {
      setCurrentChunk(i);
      setProgress(Math.floor((i / chunks) * 100));
      
      // Add delay between chunks to prevent UI freezing
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, chunkDelay));
      }
      
      const chunkResults = await processChunk(i);
      results.push(...chunkResults);
    }
    
    setProgress(100);
    setIsProcessing(false);
    
    if (onComplete) {
      onComplete(results);
    }
    
    return results;
  }, [chunkSize, chunkDelay, onChunkComplete, onError, onComplete]);

  return {
    processInChunks,
    isProcessing,
    progress,
    currentChunk
  };
};
