
import { useState } from 'react';

export enum InputMethod {
  MOUSE = 'mouse',
  PENCIL = 'pencil',
  TOUCH = 'touch',
  KEYBOARD = 'keyboard'
}

export const useLineInputMethod = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  
  return {
    inputMethod,
    setInputMethod
  };
};
