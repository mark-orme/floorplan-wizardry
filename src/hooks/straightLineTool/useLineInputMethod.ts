
import { useState, useCallback } from 'react';

/**
 * Input method enum for different line drawing methods
 */
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  STYLUS = 'stylus',
  KEYBOARD = 'keyboard'
}

/**
 * Hook for managing line drawing input methods
 */
export function useLineInputMethod(defaultMethod: InputMethod = InputMethod.MOUSE) {
  const [inputMethod, setInputMethod] = useState<InputMethod>(defaultMethod);
  
  // Detect input method from event
  const detectInputMethod = useCallback((event: any): InputMethod => {
    if (event.pointerType === 'pen') {
      return InputMethod.STYLUS;
    } else if (event.pointerType === 'touch' || event.touches) {
      return InputMethod.TOUCH;
    } else if (event.key) {
      return InputMethod.KEYBOARD;
    }
    
    return InputMethod.MOUSE;
  }, []);
  
  // Handle input method change
  const handleInputMethodChange = useCallback((event: any) => {
    const method = detectInputMethod(event);
    setInputMethod(method);
    return method;
  }, [detectInputMethod]);
  
  // Check if input is precise
  const isPreciseInput = useCallback((method?: InputMethod) => {
    const currentMethod = method || inputMethod;
    return currentMethod === InputMethod.MOUSE || 
           currentMethod === InputMethod.STYLUS || 
           currentMethod === InputMethod.KEYBOARD;
  }, [inputMethod]);
  
  return {
    inputMethod,
    setInputMethod,
    detectInputMethod,
    handleInputMethodChange,
    isPreciseInput
  };
}
