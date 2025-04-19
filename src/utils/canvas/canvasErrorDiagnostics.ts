
import logger from '@/utils/logger';

/**
 * Validates the canvas element for common initialization issues
 * @param canvas - The canvas element to validate
 * @returns Validation result with any detected issues
 */
export function validateCanvasElement(canvas: HTMLCanvasElement | null): { 
  valid: boolean; 
  issues: string[];
} {
  const issues: string[] = [];
  
  if (!canvas) {
    issues.push('Canvas element is null or undefined');
    return { valid: false, issues };
  }
  
  // Check canvas dimensions
  if (canvas.width === 0 || canvas.height === 0) {
    issues.push(`Canvas has zero dimensions: ${canvas.width}x${canvas.height}`);
  }
  
  // Check if canvas is visible in the DOM
  if (canvas.offsetParent === null) {
    issues.push('Canvas is not visible in the DOM (offsetParent is null)');
  }
  
  // Check for CSS that might interfere with canvas rendering
  const styles = window.getComputedStyle(canvas);
  if (styles.display === 'none') {
    issues.push('Canvas has display:none style');
  }
  
  if (styles.visibility === 'hidden') {
    issues.push('Canvas has visibility:hidden style');
  }
  
  if (Number(styles.opacity) === 0) {
    issues.push('Canvas has opacity:0 style');
  }
  
  // Check parent container dimensions
  const parent = canvas.parentElement;
  if (parent) {
    if (parent.offsetWidth === 0 || parent.offsetHeight === 0) {
      issues.push(`Canvas parent container has zero dimensions: ${parent.offsetWidth}x${parent.offsetHeight}`);
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Validates a Fabric.js canvas instance for common issues
 * @param fabricCanvas - The Fabric.js canvas instance
 * @returns Validation result with any detected issues
 */
export function validateFabricCanvas(fabricCanvas: any): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (!fabricCanvas) {
    issues.push('Fabric.js canvas is null or undefined');
    return { valid: false, issues };
  }
  
  // Check that essential methods exist
  if (typeof fabricCanvas.renderAll !== 'function') {
    issues.push('fabricCanvas.renderAll is not a function');
  }
  
  if (typeof fabricCanvas.add !== 'function') {
    issues.push('fabricCanvas.add is not a function');
  }
  
  // Check for valid dimensions
  if (!fabricCanvas.width || !fabricCanvas.height) {
    issues.push(`Fabric.js canvas has invalid dimensions: ${fabricCanvas.width}x${fabricCanvas.height}`);
  }
  
  // Check that the drawing brush is available
  if (fabricCanvas.isDrawingMode && (!fabricCanvas.freeDrawingBrush || !fabricCanvas.freeDrawingBrush.color)) {
    issues.push('Canvas is in drawing mode but freeDrawingBrush is not properly initialized');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Logs diagnostic information about canvas initialization
 * Useful for troubleshooting canvas issues
 */
export function logCanvasInitialization(
  htmlCanvas: HTMLCanvasElement | null, 
  fabricCanvas: any,
  context: Record<string, any> = {}
): void {
  // Check HTML canvas
  const htmlCanvasValidation = validateCanvasElement(htmlCanvas);
  
  // Check Fabric.js canvas
  const fabricCanvasValidation = validateFabricCanvas(fabricCanvas);
  
  const isValid = htmlCanvasValidation.valid && fabricCanvasValidation.valid;
  const allIssues = [...htmlCanvasValidation.issues, ...fabricCanvasValidation.issues];
  
  if (!isValid) {
    logger.canvasError('Canvas initialization validation failed', 
      new Error('Canvas validation issues: ' + allIssues.join(', ')),
      {
        ...context,
        htmlCanvasIssues: htmlCanvasValidation.issues,
        fabricCanvasIssues: fabricCanvasValidation.issues,
        htmlCanvasDimensions: htmlCanvas ? `${htmlCanvas.width}x${htmlCanvas.height}` : 'null',
        fabricCanvasDimensions: fabricCanvas ? `${fabricCanvas.width}x${fabricCanvas.height}` : 'null'
      }
    );
  } else {
    logger.info('Canvas initialization validated successfully', {
      htmlCanvasDimensions: htmlCanvas ? `${htmlCanvas.width}x${htmlCanvas.height}` : 'null',
      fabricCanvasDimensions: fabricCanvas ? `${fabricCanvas.width}x${fabricCanvas.height}` : 'null',
      ...context
    });
  }
  
  return;
}
