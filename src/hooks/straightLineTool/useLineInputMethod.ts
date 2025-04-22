
import { useState, useCallback } from 'react';

export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil'
}

export const useLineInputMethod = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);

  const handleInputMethodChange = useCallback((method: InputMethod) => {
    setInputMethod(method);
  }, []);

  return {
    inputMethod,
    setInputMethod: handleInputMethodChange
  };
};
