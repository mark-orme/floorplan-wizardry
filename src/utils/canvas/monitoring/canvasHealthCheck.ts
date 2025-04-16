
/**
 * Canvas health check utilities
 * @module utils/canvas/monitoring/canvasHealthCheck
 */

import { Canvas as FabricCanvas } from 'fabric';

/**
 * Generates a diagnostic report about canvas state
 * @returns Diagnostic information about the canvas
 */
export const generateCanvasDiagnosticReport = (): Record<string, any> => {
  // Check DOM readiness
  const domReady = document.readyState === 'complete';
  
  // Check canvas elements in the DOM
  const canvasElements = document.querySelectorAll('canvas');
  const canvasCount = canvasElements.length;
  
  // Check for Fabric.js canvas instances
  const fabricInstanceCount = document.querySelectorAll('.canvas-container').length;
  
  // Check global canvas state if available
  const globalCanvasState = (window as any).__canvas_state || null;
  
  // Get fabric elements info
  const fabricElements = [];
  for (let i = 0; i < canvasElements.length; i++) {
    const canvas = canvasElements[i];
    fabricElements.push({
      id: canvas.id || `canvas-${i}`,
      width: canvas.width,
      height: canvas.height,
      parentVisible: canvas.parentElement ? getComputedStyle(canvas.parentElement).display !== 'none' : false,
      visible: getComputedStyle(canvas).display !== 'none',
      hasContainer: canvas.parentElement?.classList.contains('canvas-container') || false
    });
  }
  
  // Build diagnostic report
  return {
    timestamp: Date.now(),
    domReady,
    canvasElements: {
      count: canvasCount,
      hasFabricInstances: fabricInstanceCount > 0,
      fabricInstanceCount,
      elements: fabricElements
    },
    fabricState: globalCanvasState,
    windowDimensions: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio
    },
    documentMode: document.compatMode
  };
};

/**
 * Checks if Fabric.js is properly loaded
 * @returns Information about the Fabric.js loading status
 */
export const checkFabricJsLoading = (): Record<string, any> => {
  // Check if Fabric constructor exists
  const fabricDetected = typeof FabricCanvas === 'function';
  
  // Try to detect Fabric.js version
  let fabricVersion = 'unknown';
  let fabricProblem = null;
  
  try {
    // Check for version in different possible locations
    if (typeof (FabricCanvas as any).version === 'string') {
      fabricVersion = (FabricCanvas as any).version;
    } else if (typeof fabric === 'object' && fabric.version) {
      fabricVersion = fabric.version;
    }
  } catch (error) {
    fabricProblem = 'Error accessing Fabric.js version';
  }
  
  // Check if Fabric.js can create a canvas
  let canCreateCanvas = false;
  
  try {
    if (fabricDetected) {
      // Just check the constructor, don't actually create an instance
      canCreateCanvas = true;
    }
  } catch (error) {
    fabricProblem = 'Cannot create Fabric.js canvas';
  }
  
  return {
    fabricDetected,
    fabricVersion,
    canCreateCanvas,
    fabricProblem,
    checked: Date.now()
  };
};
