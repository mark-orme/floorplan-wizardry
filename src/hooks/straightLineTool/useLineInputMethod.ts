
/**
 * Input method type for drawing tools
 */
export type InputMethod = 'mouse' | 'touch' | 'stylus' | 'keyboard' | string;

/**
 * Hook for detecting and managing input method for drawing tools
 */
export const useLineInputMethod = () => {
  // Default to mouse input
  return 'mouse' as InputMethod;
};

export default useLineInputMethod;
