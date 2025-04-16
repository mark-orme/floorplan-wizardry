
import { useState, useCallback } from 'react';

// Define and export the InputMethod enum
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil',
  STYLUS = 'stylus'
}

/**
 * Hook for managing input method state and detection
 */
export const useLineInputMethod = () => {
  // Input method state
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  
  // Detect input method from pointer event
  const detectInputMethod = useCallback((e: PointerEvent) => {
    const isPen = e.pointerType === 'pen';
    
    setIsPencilMode(isPen);
    setInputMethod(
      isPen 
        ? InputMethod.PENCIL 
        : (e.pointerType === 'touch' ? InputMethod.TOUCH : InputMethod.MOUSE)
    );
    
    // Log input method for debugging
    if (isPen) {
      console.info('Apple Pencil or stylus detected', {
        pointerType: e.pointerType,
        pressure: e.pressure,
        tiltX: e.tiltX,
        tiltY: e.tiltY
      });
    }
  }, []);

  return {
    inputMethod,
    isPencilMode,
    setInputMethod,
    setIsPencilMode,
    detectInputMethod
  };
};
