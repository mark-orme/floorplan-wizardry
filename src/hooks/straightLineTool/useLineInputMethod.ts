
import { useState, useCallback } from 'react';

export type InputMethod = 'mouse' | 'touch' | 'pencil';

export const useLineInputMethod = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>('mouse');

  const handleInputMethodChange = useCallback((method: InputMethod) => {
    setInputMethod(method);
  }, []);

  return {
    inputMethod,
    setInputMethod: handleInputMethodChange
  };
};
