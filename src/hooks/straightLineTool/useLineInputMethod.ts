
import { useState, useCallback } from 'react';

export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil',
  STYLUS = 'stylus'
}

/**
 * Hook for detecting and managing input methods for drawing tools
 */
export const useLineInputMethod = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);

  /**
   * Detect the input method from a pointer event
   */
  const detectInputMethod = useCallback((event: PointerEvent | TouchEvent | MouseEvent) => {
    if ('pointerType' in event) {
      // This is a PointerEvent
      switch (event.pointerType) {
        case 'pen':
          setInputMethod(InputMethod.PENCIL);
          setIsPencilMode(true);
          break;
        case 'touch':
          setInputMethod(InputMethod.TOUCH);
          setIsPencilMode(false);
          break;
        default:
          setInputMethod(InputMethod.MOUSE);
          setIsPencilMode(false);
      }
    } else if ('touches' in event) {
      // This is a TouchEvent
      setInputMethod(InputMethod.TOUCH);
      setIsPencilMode(false);
    } else {
      // This is a MouseEvent
      setInputMethod(InputMethod.MOUSE);
      setIsPencilMode(false);
    }
  }, []);

  /**
   * Manually set the input method
   */
  const setInputMethodManually = useCallback((method: InputMethod) => {
    setInputMethod(method);
    setIsPencilMode(method === InputMethod.PENCIL || method === InputMethod.STYLUS);
  }, []);

  return {
    inputMethod,
    isPencilMode,
    detectInputMethod,
    setInputMethod: setInputMethodManually
  };
};
