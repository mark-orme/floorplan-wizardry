
/**
 * Input method types for the straight line tool
 */
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  PENCIL = 'pencil'
}

/**
 * Determines the input method from an event
 */
export const getInputMethod = (event: any): InputMethod => {
  if (event?.pointerType === 'pen' || event?.pointerType === 'stylus') {
    return InputMethod.PENCIL;
  }
  if (event?.pointerType === 'touch' || event?.touches) {
    return InputMethod.TOUCH;
  }
  return InputMethod.MOUSE;
};

/**
 * Hook for handling input method detection
 */
export const useLineInputMethod = () => {
  return {
    getInputMethod,
    InputMethod
  };
};
