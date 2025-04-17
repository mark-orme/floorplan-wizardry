
import { useState } from 'react';

/**
 * Input method enum
 */
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil',
  STYLUS = 'stylus'
}

/**
 * Hook for managing line tool input methods
 */
export const useLineInputMethod = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  const [shiftKeyPressed, setShiftKeyPressed] = useState(false);
  
  return {
    inputMethod,
    isPencilMode,
    shiftKeyPressed,
    setInputMethod,
    setIsPencilMode,
    setShiftKeyPressed
  };
};
