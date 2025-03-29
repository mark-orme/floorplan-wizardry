
/**
 * Safe canvas initialization module
 * Provides reliable canvas initialization with checks and retries
 * @module utils/canvas/safeCanvasInitialization
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "../logger";

// Track global initialization state
let initializing = false;
let initialized = false;
let initializationAttempts = 0;
const MAX_INIT_ATTEMPTS = 3;

/**
 * Reset initialization state
 * Useful when unmounting and remounting components
 */
export const resetInitializationState = (): void => {
  console.log("🔄 Resetting canvas initialization state");
  initializing = false;
  initialized = false;
  initializationAttempts = 0;
};

/**
 * Safely initialize canvas with checks for existing references
 * 
 * @param {HTMLCanvasElement} canvasElement - DOM canvas element
 * @param {Object} options - Canvas initialization options
 * @returns {FabricCanvas | null} Initialized Fabric canvas or null on failure
 */
export const safelyInitializeCanvas = (
  canvasElement: HTMLCanvasElement,
  options: any = {}
): FabricCanvas | null => {
  console.log("🔍 Safely initializing canvas", {
    initializing,
    initialized,
    attempts: initializationAttempts
  });
  
  // Prevent concurrent initialization
  if (initializing) {
    logger.warn("Canvas initialization already in progress");
    return null;
  }
  
  // Prevent excessive attempts
  if (initializationAttempts >= MAX_INIT_ATTEMPTS) {
    logger.error("Maximum canvas initialization attempts reached");
    console.error("⛔ Maximum canvas initialization attempts reached");
    return null;
  }
  
  try {
    initializing = true;
    initializationAttempts++;
    
    console.log("📝 Creating canvas with options:", options);
    
    // Create Fabric canvas
    const canvas = new FabricCanvas(canvasElement, {
      width: options.width || 800,
      height: options.height || 600,
      backgroundColor: options.backgroundColor || "#ffffff",
      ...options
    });
    
    // Ensure valid dimensions
    if (!canvas.width || !canvas.height) {
      console.warn("⚠️ Canvas created with invalid dimensions", {
        width: canvas.width,
        height: canvas.height
      });
      
      // Try to set dimensions explicitly
      canvas.setDimensions({
        width: options.width || 800,
        height: options.height || 600
      });
      
      console.log("🛠️ Fixed canvas dimensions", {
        width: canvas.width,
        height: canvas.height
      });
    }
    
    // Flag as initialized
    initialized = true;
    initializing = false;
    
    console.log("✅ Canvas successfully initialized", {
      width: canvas.width,
      height: canvas.height,
      objects: canvas.getObjects().length
    });
    
    return canvas;
  } catch (error) {
    logger.error("Error initializing canvas:", error);
    console.error("❌ Error initializing canvas:", error);
    
    // Reset flags
    initializing = false;
    
    return null;
  }
};

/**
 * Check if canvas is properly initialized
 * 
 * @param {FabricCanvas} canvas - Canvas to check
 * @returns {boolean} Whether canvas is properly initialized
 */
export const isCanvasProperlyInitialized = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) {
    console.log("❌ Canvas is null in initialization check");
    return false;
  }
  
  const isValid = !!(
    canvas.width && 
    canvas.height && 
    canvas.width > 0 && 
    canvas.height > 0
  );
  
  console.log("🔍 Canvas initialization check:", isValid, {
    width: canvas.width,
    height: canvas.height
  });
  
  return isValid;
};
