
import { useState } from 'react';
import { InputMethodEnum } from '@/types/core/DrawingToolAdapter';

export type InputMethod = InputMethodEnum;

export const useLineInputMethod = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethodEnum.MOUSE);
  
  return {
    inputMethod,
    setInputMethod
  };
};

// Re-export InputMethodEnum for compatibility
export { InputMethodEnum };
