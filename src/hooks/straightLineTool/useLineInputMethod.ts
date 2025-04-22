
import { useState } from 'react';

export type InputMethod = 'mouse' | 'pencil' | 'keyboard';

export const useLineInputMethod = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>('mouse');
  
  return {
    inputMethod,
    setInputMethod
  };
};
