
import { useState, useEffect } from 'react';

export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil',
}

export const useLineInputMethod = () => {
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState<boolean>(false);

  // Detect input method changes
  useEffect(() => {
    setIsPencilMode(inputMethod === InputMethod.PENCIL);
  }, [inputMethod]);

  return {
    inputMethod,
    setInputMethod,
    isPencilMode
  };
};
