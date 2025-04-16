
import { useState } from 'react';

/**
 * Enum for different input methods
 */
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil',
  STYLUS = 'stylus'
}

/**
 * Hook for managing input method detection
 */
export const useLineInputMethod = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  
  /**
   * Detect input method from event
   */
  const detectInputMethod = (e: any) => {
    if (!e) return;
    
    // Check for pointer type in event
    if (e.pointerType) {
      if (e.pointerType === 'pen') {
        setInputMethod(InputMethod.PENCIL);
        setIsPencilMode(true);
      } else if (e.pointerType === 'touch') {
        setInputMethod(InputMethod.TOUCH);
        setIsPencilMode(false);
      } else {
        setInputMethod(InputMethod.MOUSE);
        setIsPencilMode(false);
      }
    }
  };
  
  return {
    inputMethod,
    isPencilMode,
    setInputMethod,
    setIsPencilMode,
    detectInputMethod
  };
};
