
import { useState } from 'react';
import { InputMethod } from '@/types/input/InputMethod';

export type InputMethodType = InputMethod;

export const useLineInputMethod = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  
  return {
    inputMethod,
    setInputMethod
  };
};

export { InputMethod };
