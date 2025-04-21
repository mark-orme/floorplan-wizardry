
/**
 * Hook for validating drawing modes
 * @module hooks/useDrawingModeValidator
 */
import { useState, useCallback } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';

interface UseDrawingModeValidatorProps {
  /** Initial drawing mode */
  initialMode?: DrawingMode;
  /** Callback for mode changes */
  onModeChange?: (mode: DrawingMode) => void;
}

/**
 * Hook for validating drawing modes
 * Ensures that only valid drawing modes can be set
 */
export function useDrawingModeValidator({
  initialMode = DrawingMode.SELECT,
  onModeChange
}: UseDrawingModeValidatorProps = {}) {
  const [mode, setMode] = useState<DrawingMode>(initialMode);
  
  /**
   * Convert string to DrawingMode if possible
   * @param modeStr Mode string to convert
   * @returns DrawingMode or null if invalid
   */
  const toDrawingMode = (modeStr: string): DrawingMode | null => {
    // Check if the string is a valid DrawingMode
    return Object.values(DrawingMode).includes(modeStr as DrawingMode) 
      ? modeStr as DrawingMode 
      : null;
  };
  
  /**
   * Validate and set drawing mode
   * @param newMode The new drawing mode to set
   * @returns Whether the mode was successfully set
   */
  const validateAndSetMode = useCallback((newMode: DrawingMode | string): boolean => {
    let validatedMode: DrawingMode;
    
    if (typeof newMode === 'string') {
      // Try to convert the string to a DrawingMode
      const convertedMode = toDrawingMode(newMode);
      
      if (convertedMode !== null) {
        validatedMode = convertedMode;
      } else {
        console.error(`Invalid drawing mode: ${newMode}`);
        toast.error(`Invalid drawing mode: ${newMode}`);
        return false;
      }
    } else {
      validatedMode = newMode;
    }
    
    // Set the validated mode
    setMode(validatedMode);
    
    // Call the onModeChange callback if provided
    if (onModeChange) {
      onModeChange(validatedMode);
    }
    
    return true;
  }, [onModeChange]);
  
  return {
    mode,
    setMode: validateAndSetMode
  };
}

export default useDrawingModeValidator;
