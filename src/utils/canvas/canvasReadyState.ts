
/**
 * Canvas ready state tracking utility
 * Ensures canvas is fully initialized before interactions
 * @module utils/canvas/canvasReadyState
 */
import { useState, useCallback } from 'react';

/**
 * Interface for canvas ready state
 * Tracks various stages of canvas initialization
 */
interface CanvasReadyState {
  /** Whether the canvas element has been created */
  canvasCreated: boolean;
  /** Whether the canvas has been initialized with Fabric.js */
  canvasInitialized: boolean;
  /** Whether the grid has been loaded */
  gridLoaded: boolean;
  /** Whether drawing tools have been registered */
  toolsRegistered: boolean;
}

/**
 * Default canvas ready state
 * All states start as false until initialization steps are completed
 */
const DEFAULT_READY_STATE: CanvasReadyState = {
  canvasCreated: false,
  canvasInitialized: false,
  gridLoaded: false,
  toolsRegistered: false
};

/**
 * Hook for tracking canvas ready state
 * Provides state and setters for each initialization step
 * 
 * @returns Canvas ready state and setters
 */
export const useCanvasReadyState = () => {
  const [readyState, setReadyState] = useState<CanvasReadyState>(DEFAULT_READY_STATE);
  
  /**
   * Determine if canvas is fully ready for interactions
   * All initialization steps must be completed
   */
  const isReady = readyState.canvasCreated && 
                  readyState.canvasInitialized && 
                  readyState.gridLoaded && 
                  readyState.toolsRegistered;
  
  /**
   * Mark canvas element as created
   */
  const setCanvasCreated = useCallback(() => {
    setReadyState(prev => ({ ...prev, canvasCreated: true }));
  }, []);
  
  /**
   * Mark canvas as initialized with Fabric.js
   */
  const setCanvasInitialized = useCallback(() => {
    setReadyState(prev => ({ ...prev, canvasInitialized: true }));
  }, []);
  
  /**
   * Mark grid as loaded
   */
  const setGridLoaded = useCallback(() => {
    setReadyState(prev => ({ ...prev, gridLoaded: true }));
  }, []);
  
  /**
   * Mark drawing tools as registered
   */
  const setToolsRegistered = useCallback(() => {
    setReadyState(prev => ({ ...prev, toolsRegistered: true }));
  }, []);
  
  /**
   * Reset the ready state to defaults
   * Used when rebuilding the canvas
   */
  const resetReadyState = useCallback(() => {
    setReadyState(DEFAULT_READY_STATE);
  }, []);
  
  return {
    ...readyState,
    isReady,
    setCanvasCreated,
    setCanvasInitialized,
    setGridLoaded,
    setToolsRegistered,
    resetReadyState
  };
};
