
/**
 * Safe canvas initialization utilities
 * Helps manage canvas initialization state to prevent errors
 */

/**
 * Track if canvas is being initialized
 */
let isInitializing = false;

/**
 * Get current initialization state
 * @returns {boolean} Whether canvas is initializing
 */
export const getInitializationState = (): boolean => {
  return isInitializing;
};

/**
 * Set canvas as initializing
 * @returns {boolean} Whether state was changed
 */
export const setInitializing = (): boolean => {
  if (isInitializing) return false;
  
  isInitializing = true;
  return true;
};

/**
 * Set canvas as done initializing
 */
export const setInitialized = (): void => {
  isInitializing = false;
};

/**
 * Reset initialization state
 * Used when component unmounts or needs to restart
 */
export const resetInitializationState = (): void => {
  isInitializing = false;
};

/**
 * Prepare canvas element for initialization
 * Ensures the canvas element is ready for fabric initialization
 * @param {HTMLCanvasElement} canvasElement - The canvas element to prepare
 */
export const prepareCanvasForInitialization = (canvasElement: HTMLCanvasElement): void => {
  // Clear any existing context
  const ctx = canvasElement.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }
  
  // Reset any transforms
  if (ctx && 'resetTransform' in ctx) {
    (ctx as any).resetTransform();
  }
};

/**
 * Validate that canvas initialization was successful
 * @param {any} canvas - The fabric canvas instance to validate
 * @returns {boolean} Whether canvas is valid
 */
export const validateCanvasInitialization = (canvas: any): boolean => {
  if (!canvas) return false;
  
  // Check essential methods exist
  if (typeof canvas.getWidth !== 'function' || 
      typeof canvas.getHeight !== 'function' ||
      typeof canvas.add !== 'function') {
    return false;
  }
  
  // Check dimensions are valid
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  return width > 0 && height > 0;
};

/**
 * Handle initialization failure
 * @param {string} errorMessage - Error message
 * @param {boolean} resetState - Whether to reset initialization state
 */
export const handleInitializationFailure = (errorMessage: string, resetState: boolean): void => {
  console.error(`Canvas initialization failed: ${errorMessage}`);
  
  if (resetState) {
    resetInitializationState();
  }
};
