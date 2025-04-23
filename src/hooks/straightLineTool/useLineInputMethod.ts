import { useState, useEffect } from 'react';

export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  STYLUS = 'stylus',
  PENCIL = 'pencil'
}

export function useLineInputMethod(): { 
  inputMethod: InputMethod; 
  setInputMethod: (method: InputMethod) => void; 
} {
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);

  useEffect(() => {
    // Detect input method based on pointer events
    const detectInputMethod = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') {
        setInputMethod(InputMethod.MOUSE);
      } else if (event.pointerType === 'touch') {
        setInputMethod(InputMethod.TOUCH);
      } else if (event.pointerType === 'pen') {
        // Check if it's Apple Pencil (high pressure sensitivity)
        if (event.pressure > 0 && typeof event.tiltX !== 'undefined') {
          setInputMethod(InputMethod.PENCIL);
        } else {
          setInputMethod(InputMethod.STYLUS);
        }
      } else {
        setInputMethod(InputMethod.UNKNOWN);
      }
    };

    // Add event listeners
    window.addEventListener('pointerdown', detectInputMethod);
    
    // Clean up
    return () => {
      window.removeEventListener('pointerdown', detectInputMethod);
    };
  }, []);

  return { inputMethod, setInputMethod };
}
