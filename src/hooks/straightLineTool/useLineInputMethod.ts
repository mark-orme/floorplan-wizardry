
import { useState, useCallback } from 'react';
import { InputMethod } from '@/types/input/InputMethod';

/**
 * Hook for detecting and managing input methods for line drawing
 */
export const useLineInputMethod = (initialInputMethod: InputMethod = InputMethod.MOUSE) => {
  const [inputMethod, setInputMethod] = useState<InputMethod>(initialInputMethod);
  
  /**
   * Detect and set the input method based on pointer event
   */
  const detectInputMethod = useCallback((event: PointerEvent | any): InputMethod => {
    if (!event) return InputMethod.MOUSE;
    
    // Check if the event has pointerType property
    if (event.pointerType) {
      if (event.pointerType === 'pen') return InputMethod.STYLUS;
      if (event.pointerType === 'touch') return InputMethod.TOUCH;
      return InputMethod.MOUSE;
    }
    
    // Fallback to mouse if we can't determine
    return InputMethod.MOUSE;
  }, []);
  
  /**
   * Update the current input method
   */
  const updateInputMethod = useCallback((event: PointerEvent | any) => {
    const detected = detectInputMethod(event);
    setInputMethod(detected);
    return detected;
  }, [detectInputMethod]);
  
  return {
    inputMethod,
    setInputMethod,
    detectInputMethod,
    updateInputMethod
  };
};

// Re-export the InputMethod enum for convenient access
export { InputMethod };
