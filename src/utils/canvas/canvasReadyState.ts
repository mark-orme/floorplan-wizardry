
/**
 * Canvas ready state management utilities
 * Prevents interaction with canvas until fully initialized
 * @module utils/canvas/canvasReadyState
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Canvas ready state interface
 */
export interface CanvasReadyState {
  /** Whether the canvas element is created and added to DOM */
  canvasCreated: boolean;
  /** Whether the fabric.js canvas is initialized */
  canvasInitialized: boolean;
  /** Whether the grid has been created and rendered */
  gridLoaded: boolean;
  /** Whether all drawing tools have been registered */
  toolsRegistered: boolean;
  /** Whether the canvas is fully ready for interaction */
  isReady: boolean;
}

/**
 * Default canvas ready state
 */
export const DEFAULT_CANVAS_READY_STATE: CanvasReadyState = {
  canvasCreated: false,
  canvasInitialized: false,
  gridLoaded: false,
  toolsRegistered: false,
  isReady: false
};

/**
 * Hook to manage canvas ready state
 * Blocks interaction until the canvas is fully ready
 */
export const useCanvasReadyState = () => {
  const [state, setState] = useState<CanvasReadyState>(DEFAULT_CANVAS_READY_STATE);
  
  // Computed property for overall readiness
  useEffect(() => {
    const isReady = state.canvasCreated && 
                   state.canvasInitialized && 
                   state.gridLoaded && 
                   state.toolsRegistered;
    
    if (isReady !== state.isReady) {
      setState(prev => ({ ...prev, isReady }));
      
      if (isReady) {
        console.log('Canvas is fully initialized and ready for interaction');
      }
    }
  }, [
    state.canvasCreated,
    state.canvasInitialized,
    state.gridLoaded,
    state.toolsRegistered,
    state.isReady
  ]);
  
  // Update individual ready states
  const setCanvasCreated = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, canvasCreated: value }));
  }, []);
  
  const setCanvasInitialized = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, canvasInitialized: value }));
  }, []);
  
  const setGridLoaded = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, gridLoaded: value }));
  }, []);
  
  const setToolsRegistered = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, toolsRegistered: value }));
  }, []);
  
  return {
    ...state,
    setCanvasCreated,
    setCanvasInitialized,
    setGridLoaded,
    setToolsRegistered
  };
};
