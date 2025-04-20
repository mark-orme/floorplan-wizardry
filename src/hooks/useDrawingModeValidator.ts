
/**
 * Hook to validate and normalize drawing modes
 * Helps prevent type mismatches and inconsistencies
 */

import { useState, useCallback } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingTool } from '@/types/core/DrawingTool';
import { normalizeDrawingMode } from '@/utils/floorPlanAdapter';

/**
 * Interface defining the validator hook return value
 */
interface DrawingModeValidatorResult {
  /**
   * Current validated drawing mode
   */
  mode: DrawingMode;
  
  /**
   * Set drawing mode (validates and normalizes input)
   */
  setMode: (newMode: string | DrawingMode) => void;
  
  /**
   * Validate if a mode is a valid DrawingMode
   */
  isValidMode: (value: unknown) => boolean;
  
  /**
   * Get a safe default mode if current is invalid
   */
  getDefaultMode: () => DrawingMode;
  
  /**
   * Check if the current mode is equal to the provided mode
   */
  isCurrentMode: (compareMode: DrawingMode) => boolean;
}

/**
 * Hook that provides validated drawing mode state and utilities
 * 
 * @param initialMode - Initial drawing mode
 * @returns Object with mode state and utility functions
 */
export function useDrawingModeValidator(
  initialMode: DrawingMode = DrawingMode.SELECT
): DrawingModeValidatorResult {
  // Validate initial mode
  const validInitialMode = Object.values(DrawingMode).includes(initialMode) 
    ? initialMode 
    : DrawingMode.SELECT;
  
  // State for the current mode
  const [mode, setModeState] = useState<DrawingMode>(validInitialMode);
  
  // Set mode with validation
  const setMode = useCallback((newMode: string | DrawingMode) => {
    try {
      const normalizedMode = normalizeDrawingMode(newMode);
      setModeState(normalizedMode);
    } catch (error) {
      console.error('Invalid drawing mode:', newMode);
      // Fallback to SELECT on error
      setModeState(DrawingMode.SELECT);
    }
  }, []);
  
  // Check if a value is a valid DrawingMode
  const isValidMode = useCallback((value: unknown): value is DrawingMode => {
    if (typeof value !== 'string') return false;
    return Object.values(DrawingMode).includes(value as DrawingMode);
  }, []);
  
  // Get default mode
  const getDefaultMode = useCallback((): DrawingMode => {
    return DrawingMode.SELECT;
  }, []);
  
  // Check if current mode equals provided mode
  const isCurrentMode = useCallback((compareMode: DrawingMode): boolean => {
    return mode === compareMode;
  }, [mode]);
  
  return {
    mode,
    setMode,
    isValidMode,
    getDefaultMode,
    isCurrentMode
  };
}

export default useDrawingModeValidator;
