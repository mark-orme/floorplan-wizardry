
/**
 * Reliable grid initialization hook
 * Manages grid initialization with error handling
 * @module hooks/useReliableGridInitialization
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { toast } from 'sonner';
import { 
  createCompleteGrid, 
  createBasicEmergencyGrid,
  validateGrid
} from '@/utils/grid/gridCreationUtils';
import logger from '@/utils/logger';

/**
 * Props for useReliableGridInitialization hook
 */
interface UseReliableGridInitializationProps {
  /** Reference to the fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Auto retry on failure */
  autoRetry?: boolean;
  /** Maximum retry attempts */
  maxRetries?: number;
  /** Callback on success */
  onSuccess?: (gridObjects: FabricObject[]) => void;
  /** Callback on failure */
  onFailure?: (error: Error) => void;
}

/**
 * Hook for reliable grid initialization with fallbacks
 * 
 * @param {UseReliableGridInitializationProps} props - Hook properties
 * @returns Grid initialization utilities
 */
export const useReliableGridInitialization = ({
  fabricCanvasRef,
  autoRetry = true,
  maxRetries = 3,
  onSuccess,
  onFailure
}: UseReliableGridInitializationProps) => {
  // Store grid objects
  const gridLayerRef = useRef<FabricObject[]>([]);
  
  // Track initialization state
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initAttempt, setInitAttempt] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);
  
  // Try creating a reliable grid
  const initializeGrid = useCallback(async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) {
      const error = new Error('Canvas is not available');
      setLastError(error);
      if (onFailure) onFailure(error);
      return false;
    }
    
    if (isInitializing) {
      logger.warn('Grid initialization already in progress');
      return false;
    }
    
    setIsInitializing(true);
    setInitAttempt(prev => prev + 1);
    
    try {
      logger.info(`Initializing grid, attempt ${initAttempt + 1}`);
      
      // Try complete grid first
      let gridObjects = createCompleteGrid(canvas);
      
      // Check if grid was created successfully
      if (gridObjects.length === 0) {
        logger.warn('Complete grid creation failed, trying emergency grid');
        gridObjects = createBasicEmergencyGrid(canvas);
      }
      
      // Check if emergency grid was created successfully
      if (gridObjects.length === 0) {
        throw new Error('Failed to create grid after multiple attempts');
      }
      
      // Validate grid
      if (!validateGrid(canvas, gridObjects)) {
        throw new Error('Grid validation failed');
      }
      
      // Update grid layer reference
      gridLayerRef.current = gridObjects;
      
      // Mark as initialized
      setIsInitialized(true);
      setIsInitializing(false);
      setLastError(null);
      
      // Call success callback
      if (onSuccess) onSuccess(gridObjects);
      
      logger.info(`Grid initialized successfully with ${gridObjects.length} objects`);
      return true;
    } catch (error) {
      const typedError = error as Error;
      logger.error('Grid initialization failed:', typedError);
      
      setLastError(typedError);
      setIsInitializing(false);
      
      // Call failure callback
      if (onFailure) onFailure(typedError);
      
      // Auto retry if enabled
      if (autoRetry && initAttempt < maxRetries) {
        logger.info(`Auto-retrying grid initialization (${initAttempt + 1}/${maxRetries})`);
        setTimeout(() => {
          initializeGrid();
        }, 1000);
      } else if (initAttempt >= maxRetries) {
        logger.error(`Grid initialization failed after ${maxRetries} attempts`);
        toast.error('Could not initialize grid. Please try refreshing the page.');
      }
      
      return false;
    }
  }, [
    fabricCanvasRef, 
    isInitializing, 
    initAttempt, 
    autoRetry, 
    maxRetries,
    onSuccess,
    onFailure
  ]);
  
  // Return initialization state and functions
  return {
    isInitialized,
    isInitializing,
    initAttempt,
    lastError,
    gridLayerRef,
    initializeGrid,
    reset: useCallback(() => {
      setIsInitialized(false);
      setIsInitializing(false);
      setInitAttempt(0);
      setLastError(null);
      gridLayerRef.current = [];
    }, [])
  };
};
