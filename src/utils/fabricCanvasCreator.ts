
/**
 * Utility for creating a Fabric.js canvas instance
 * Includes fallback mechanisms and validation
 */
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { MIN_CANVAS_WIDTH, MIN_CANVAS_HEIGHT } from '@/constants/canvas';

// Constants for canvas creation (no magic numbers)
const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;
const CANVAS_ERROR_CHECK_INTERVAL = 500; // ms

/**
 * Creates a Fabric.js canvas with validation and error handling
 * @param canvasElement HTML canvas element to initialize
 * @param width Canvas width
 * @param height Canvas height
 * @returns Created Fabric.js canvas or null if failed
 */
export const createFabricCanvas = (
  canvasElement: HTMLCanvasElement,
  width: number = DEFAULT_CANVAS_WIDTH,
  height: number = DEFAULT_CANVAS_HEIGHT
): FabricCanvas | null => {
  if (!canvasElement) {
    logger.error('Cannot create Fabric.js canvas: Canvas element is null');
    return null;
  }

  try {
    // Ensure canvas element has dimensions
    canvasElement.width = Math.max(width, MIN_CANVAS_WIDTH);
    canvasElement.height = Math.max(height, MIN_CANVAS_HEIGHT);
    
    // Force a layout reflow to ensure dimensions are applied
    canvasElement.getBoundingClientRect();
    
    // Create Fabric.js canvas with performance optimizations
    const fabricCanvas = new FabricCanvas(canvasElement, {
      width: canvasElement.width,
      height: canvasElement.height,
      backgroundColor: '#FFFFFF',
      selection: false,
      renderOnAddRemove: false,
      stateful: false,
      fireRightClick: false,
      stopContextMenu: true,
      enableRetinaScaling: false,
      skipOffscreen: true
    });
    
    // Register in global registry for emergency recovery
    if (!window.fabricCanvasInstances) {
      window.fabricCanvasInstances = [];
    }
    
    // Only register if not already in the registry
    if (!window.fabricCanvasInstances.includes(fabricCanvas)) {
      window.fabricCanvasInstances.push(fabricCanvas);
    }
    
    // Enable regular rendering
    fabricCanvas.renderOnAddRemove = true;
    
    // Store a reference to the canvas on the element itself
    // This allows us to recover it later if needed
    canvasElement._fabric = fabricCanvas;
    
    logger.info(`Fabric.js canvas created: ${width}x${height}`);
    return fabricCanvas;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to create Fabric.js canvas: ${errorMessage}`);
    return null;
  }
};

/**
 * Validates that a Fabric.js canvas is properly initialized
 * @param canvas Fabric.js canvas to validate
 * @returns Whether the canvas is valid
 */
export const validateFabricCanvas = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) return false;
  
  // Check for required methods and properties
  const hasRequiredMethods = 
    typeof canvas.getWidth === 'function' &&
    typeof canvas.getHeight === 'function' &&
    typeof canvas.add === 'function' &&
    typeof canvas.remove === 'function' &&
    typeof canvas.getObjects === 'function';
    
  // Check for valid dimensions
  const hasValidDimensions = 
    canvas.width > 0 && 
    canvas.height > 0 && 
    canvas.getWidth() > 0 && 
    canvas.getHeight() > 0;
    
  return hasRequiredMethods && hasValidDimensions;
};

/**
 * Finds an existing Fabric.js canvas in the DOM
 * Uses multiple strategies for reliability
 * @returns Found Fabric.js canvas or null
 */
export const findExistingFabricCanvas = (): FabricCanvas | null => {
  try {
    // Strategy 1: Look for canvas in global registry
    if (window.fabricCanvasInstances && window.fabricCanvasInstances.length > 0) {
      const registeredCanvas = window.fabricCanvasInstances[0];
      if (validateFabricCanvas(registeredCanvas)) {
        return registeredCanvas;
      }
    }
    
    // Strategy 2: Find canvas element and check for _fabric property
    const canvasElements = document.querySelectorAll('canvas');
    for (let i = 0; i < canvasElements.length; i++) {
      const canvasEl = canvasElements[i] as HTMLCanvasElement;
      if (canvasEl._fabric && validateFabricCanvas(canvasEl._fabric)) {
        return canvasEl._fabric;
      }
    }
    
    // Strategy 3: Look for a canvas with specific ID or data attribute
    const canvasWithId = document.getElementById('fabric-canvas');
    if (canvasWithId instanceof HTMLCanvasElement && canvasWithId._fabric) {
      return canvasWithId._fabric;
    }
    
    const canvasWithTestId = document.querySelector('[data-testid="canvas-element"]');
    if (canvasWithTestId instanceof HTMLCanvasElement && canvasWithTestId._fabric) {
      return canvasWithTestId._fabric;
    }
    
    return null;
  } catch (error) {
    logger.error('Error finding existing Fabric.js canvas:', error);
    return null;
  }
};
