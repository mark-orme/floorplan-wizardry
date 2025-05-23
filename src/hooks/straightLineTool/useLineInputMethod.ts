
/**
 * Input method types for drawing tools
 */
export enum InputMethod {
  MOUSE = 'mouse',
  TOUCH = 'touch',
  STYLUS = 'stylus',
  KEYBOARD = 'keyboard',
  PENCIL = 'pencil'
}

/**
 * Hook for detecting and managing input method for drawing tools
 */
export const useLineInputMethod = () => {
  // Default to mouse input
  return InputMethod.MOUSE;
};

export default useLineInputMethod;
