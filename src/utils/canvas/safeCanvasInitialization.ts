/**
 * Safe canvas initialization utilities
 * Provides safety checks and error handling for canvas initialization
 * @module canvas/safeCanvasInitialization
 */
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

/**
 * Track initialization state
 */
let initializationState = {
  attemptCount: 0,
  lastAttemptTime: 0,
  isInitialized: false,
  initializationInProgress: false,
  canvasDisposalInProgress: false,
  maxAttempts: 5,
  canInitialize: true,
  blockedReason: "",
  errors: [] as string[]
};

/**
 * Reset all initialization state tracking
 */
export const resetInitializationState = (): void => {
  initializationState = {
    attemptCount: 0,
    lastAttemptTime: 0,
    isInitialized: false,
    initializationInProgress: false,
    canvasDisposalInProgress: false,
    maxAttempts: 5,
    canInitialize: true,
    blockedReason: "",
    errors: []
  };
  logger.info("Canvas initialization state reset");
};

/**
 * Prepare a canvas element for initialization
 * @param {HTMLCanvasElement} canvasElement - Canvas DOM element to prepare
 */
export const prepareCanvasForInitialization = (canvasElement: HTMLCanvasElement): void => {
  // Clear any existing content or state
  const ctx = canvasElement.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }
  
  // Remove any classes that might affect initialization
  canvasElement.classList.remove('fabric-initializing', 'fabric-error');
  
  // Add initializing class
  canvasElement.classList.add('fabric-initializing');
  
  // Reset any custom attributes
  canvasElement.removeAttribute('data-initialized');
  canvasElement.removeAttribute('data-error');
  
  // Set initialization attribute
  canvasElement.setAttribute('data-initializing', 'true');
  
  // Ensure the canvas is visible
  canvasElement.style.display = 'block';
  
  // Force a reflow to ensure styles are applied
  canvasElement.getBoundingClientRect();
};

/**
 * Validate a canvas after initialization
 * @param {FabricCanvas} canvas - Fabric canvas to validate
 * @returns {boolean} Whether the canvas is valid
 */
export const validateCanvasInitialization = (canvas: FabricCanvas): boolean => {
  // Basic validation checks
  if (!canvas) return false;
  
  // Check for required methods and properties
  if (typeof canvas.renderAll !== 'function') return false;
  if (typeof canvas.getWidth !== 'function') return false;
  if (typeof canvas.getHeight !== 'function') return false;
  
  // Ensure canvas has valid dimensions
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  if (width <= 0 || height <= 0) return false;
  
  // Check if viewport transform is valid
  if (!canvas.viewportTransform || canvas.viewportTransform.length !== 6) {
    return false;
  }
  
  // Check if the canvas element is accessible
  try {
    const element = canvas.getElement();
    if (!element || !(element instanceof HTMLCanvasElement)) {
      return false;
    }
  } catch (error) {
    return false;
  }
  
  // All checks passed
  return true;
};

/**
 * Handle initialization failure
 * @param {string} errorMessage - Error message
 * @param {boolean} shouldRetry - Whether to allow retry
 */
export const handleInitializationFailure = (errorMessage: string, shouldRetry: boolean): void => {
  logger.error(`Canvas initialization failed: ${errorMessage}`);
  
  // Update state
  initializationState.initializationInProgress = false;
  initializationState.errors.push(errorMessage);
  
  // Increment attempt counter if retry is allowed
  if (shouldRetry) {
    initializationState.attemptCount++;
    initializationState.lastAttemptTime = Date.now();
  } else {
    // Block further initialization attempts
    initializationState.canInitialize = false;
    initializationState.blockedReason = errorMessage;
  }
  
  // If we've exceeded max attempts, block further attempts
  if (initializationState.attemptCount >= initializationState.maxAttempts) {
    initializationState.canInitialize = false;
    initializationState.blockedReason = `Exceeded maximum initialization attempts (${initializationState.maxAttempts})`;
  }
};

/**
 * Create a basic emergency grid
 * @param {FabricCanvas} canvas - Canvas to create grid on 
 * @param {React.MutableRefObject<any[]>} gridLayerRef - Reference to store grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas, 
  gridLayerRef: React.MutableRefObject<any[]>
): void => {
  logger.info("Creating basic emergency grid");
  
  // Clear any existing grid layer
  if (gridLayerRef.current.length > 0) {
    gridLayerRef.current.forEach(obj => {
      canvas.remove(obj);
    });
    gridLayerRef.current = [];
  }
  
  // Get canvas dimensions
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Create a very basic grid
  const gridSize = 50; // 50px grid
  const gridColor = 'rgba(200, 200, 200, 0.4)';
  const gridObjects: any[] = [];
  
  // Create horizontal grid lines
  for (let y = 0; y <= height; y += gridSize) {
    const line = new fabric.Line([0, y, width, y], {
      stroke: gridColor,
      selectable: false,
      evented: false,
      objectType: 'grid',
      excludeFromExport: true,
      strokeWidth: 1
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create vertical grid lines
  for (let x = 0; x <= width; x += gridSize) {
    const line = new fabric.Line([x, 0, x, height], {
      stroke: gridColor,
      selectable: false,
      evented: false,
      objectType: 'grid',
      excludeFromExport: true,
      strokeWidth: 1
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Add a center marker
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Horizontal center line (thicker)
  const centerHLine = new fabric.Line([0, centerY, width, centerY], {
    stroke: 'rgba(255, 0, 0, 0.5)',
    selectable: false,
    evented: false,
    objectType: 'grid',
    excludeFromExport: true,
    strokeWidth: 2
  });
  
  // Vertical center line (thicker)
  const centerVLine = new fabric.Line([centerX, 0, centerX, height], {
    stroke: 'rgba(255, 0, 0, 0.5)',
    selectable: false,
    evented: false,
    objectType: 'grid',
    excludeFromExport: true,
    strokeWidth: 2
  });
  
  canvas.add(centerHLine);
  canvas.add(centerVLine);
  gridObjects.push(centerHLine);
  gridObjects.push(centerVLine);
  
  // Add a text label for emergency mode
  const text = new fabric.Text('Emergency Grid Mode', {
    left: 10,
    top: 10,
    fontSize: 16,
    fill: 'rgba(255, 0, 0, 0.8)',
    selectable: false,
    evented: false,
    objectType: 'grid',
    excludeFromExport: true
  });
  canvas.add(text);
  gridObjects.push(text);
  
  // Store grid objects in the ref
  gridLayerRef.current = gridObjects;
  
  // Render the canvas
  canvas.requestRenderAll();
  
  // Mark initialization as complete in the state
  initializationState.isInitialized = true;
  initializationState.initializationInProgress = false;
};

/**
 * Mark a canvas as successfully initialized
 * @param {FabricCanvas} canvas - The initialized canvas
 * @param {HTMLCanvasElement} canvasElement - The canvas DOM element
 */
export const markCanvasAsInitialized = (
  canvas: FabricCanvas,
  canvasElement: HTMLCanvasElement
): void => {
  // Update state
  initializationState.isInitialized = true;
  initializationState.initializationInProgress = false;
  
  // Update canvas element
  canvasElement.classList.remove('fabric-initializing');
  canvasElement.classList.add('fabric-initialized');
  canvasElement.removeAttribute('data-initializing');
  canvasElement.setAttribute('data-initialized', 'true');
  
  // Log success
  logger.info("Canvas successfully initialized");
};

/**
 * Check if canvas initialization is allowed
 * @returns {boolean} Whether initialization is allowed
 */
export const canInitializeCanvas = (): boolean => {
  return initializationState.canInitialize;
};

/**
 * Get the current initialization state
 * @returns {object} Current initialization state
 */
export const getInitializationState = () => {
  return { ...initializationState };
};

/**
 * Check if a canvas is currently being initialized
 * @returns {boolean} Whether initialization is in progress
 */
export const isInitializationInProgress = (): boolean => {
  return initializationState.initializationInProgress;
};

/**
 * Check if a canvas has been successfully initialized
 * @returns {boolean} Whether initialization is complete
 */
export const isCanvasInitialized = (): boolean => {
  return initializationState.isInitialized;
};
