
/**
 * Grid Testing Utility
 * Provides testing tools for diagnosing grid rendering issues
 * @module utils/grid/gridTester
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { toast } from "sonner";
import { captureError } from "../sentryUtils";
import logger from "../logger";
import { checkCanvasHealth, trackGridError } from "./gridErrorTracker";
import { validateCanvasForGrid } from "./gridValidator";
import { runGridDiagnostics } from "./gridDiagnostics";

/**
 * Test grid creation capabilities
 * @param {FabricCanvas} canvas - Canvas to test
 * @returns {Object} Test results
 */
export const testGridCreationCapabilities = (
  canvas: FabricCanvas | null
): Record<string, any> => {
  const results = {
    timestamp: Date.now(),
    success: false,
    canvasValid: false,
    canvasHealth: null as Record<string, any> | null,
    lineCreationTest: false,
    canvasRenderingTest: false,
    testObjectCount: 0,
    issues: [] as string[],
    elapsedTime: 0
  };
  
  const startTime = performance.now();
  
  if (!canvas) {
    results.issues.push("Canvas is null or undefined");
    results.elapsedTime = performance.now() - startTime;
    return results;
  }
  
  try {
    // Test 1: Check canvas health
    results.canvasHealth = checkCanvasHealth(canvas);
    results.canvasValid = results.canvasHealth.canvasValid;
    
    if (!results.canvasValid) {
      results.issues.push(...results.canvasHealth.issues);
      results.elapsedTime = performance.now() - startTime;
      return results;
    }
    
    // Test 2: Validate canvas
    if (!validateCanvasForGrid(canvas)) {
      results.issues.push("Canvas failed validation checks");
      results.elapsedTime = performance.now() - startTime;
      return results;
    }
    
    // Test 3: Create test lines
    const testObjects: FabricObject[] = [];
    
    try {
      // Simple horizontal and vertical lines
      const hLine = new Line([0, 50, 100, 50], {
        stroke: '#ff0000',
        strokeWidth: 2
      });
      
      const vLine = new Line([50, 0, 50, 100], {
        stroke: '#0000ff',
        strokeWidth: 2
      });
      
      // Try to add them to canvas
      canvas.add(hLine);
      canvas.add(vLine);
      
      testObjects.push(hLine, vLine);
      results.lineCreationTest = true;
      results.testObjectCount += 2;
      
    } catch (error) {
      results.issues.push(`Line creation test failed: ${error instanceof Error ? error.message : String(error)}`);
      trackGridError(error, "grid-test-line-creation");
    }
    
    // Test 4: Canvas rendering
    try {
      canvas.requestRenderAll();
      // If we got here without an error, rendering seems to work
      results.canvasRenderingTest = true;
    } catch (error) {
      results.issues.push(`Canvas rendering test failed: ${error instanceof Error ? error.message : String(error)}`);
      trackGridError(error, "grid-test-rendering");
    }
    
    // Clean up test objects
    testObjects.forEach(obj => {
      try {
        canvas.remove(obj);
      } catch (error) {
        // Ignore cleanup errors
      }
    });
    
    // Determine overall success
    results.success = 
      results.canvasValid && 
      results.lineCreationTest && 
      results.canvasRenderingTest && 
      results.issues.length === 0;
    
    results.elapsedTime = performance.now() - startTime;
    
    // Report results to Sentry for analysis
    captureError(
      new Error(results.success ? "Grid test successful" : "Grid test failed"),
      "grid-test-results",
      {
        level: results.success ? "info" : "warning",
        extra: results
      }
    );
    
    return results;
  } catch (error) {
    results.issues.push(`Grid test encountered an error: ${error instanceof Error ? error.message : String(error)}`);
    results.elapsedTime = performance.now() - startTime;
    trackGridError(error, "grid-test-error");
    return results;
  }
};

/**
 * Run a comprehensive grid analysis
 * @param {FabricCanvas} canvas - Canvas to analyze
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Grid objects reference
 * @returns {Object} Analysis results
 */
export const analyzeGridRendering = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): Record<string, any> => {
  const analysis = {
    timestamp: Date.now(),
    creationCapabilities: null as Record<string, any> | null,
    diagnostics: null as Record<string, any> | null,
    canvasSnapshot: null as Record<string, any> | null,
    recommendations: [] as string[]
  };
  
  if (!canvas) {
    analysis.recommendations.push("Fix null canvas reference");
    return analysis;
  }
  
  // Test grid creation capabilities
  analysis.creationCapabilities = testGridCreationCapabilities(canvas);
  
  // Run diagnostics on current grid
  analysis.diagnostics = runGridDiagnostics(canvas, gridLayerRef.current, true);
  
  // Add canvas snapshot
  analysis.canvasSnapshot = {
    width: canvas.width,
    height: canvas.height,
    objects: canvas.getObjects().length,
    hasContext: !!(canvas as any).contextContainer,
    renderOnAddRemove: canvas.renderOnAddRemove,
    gridObjectsCount: gridLayerRef.current.length,
    gridObjectsOnCanvas: gridLayerRef.current.filter(obj => canvas.contains(obj)).length
  };
  
  // Generate recommendations
  if (!analysis.creationCapabilities.success) {
    if (!analysis.creationCapabilities.canvasValid) {
      analysis.recommendations.push("Fix canvas dimensions");
    }
    if (!analysis.creationCapabilities.lineCreationTest) {
      analysis.recommendations.push("Fix line creation capability");
    }
    if (!analysis.creationCapabilities.canvasRenderingTest) {
      analysis.recommendations.push("Fix canvas rendering");
    }
  }
  
  if (analysis.diagnostics.status !== 'ok') {
    analysis.recommendations.push(...analysis.diagnostics.recommendations);
  }
  
  // Log analysis results
  logger.info("Grid analysis completed", {
    success: analysis.creationCapabilities.success && analysis.diagnostics.status === 'ok',
    recommendations: analysis.recommendations
  });
  
  return analysis;
};

/**
 * Test immediate grid rendering
 * Shows a visible test pattern to verify grid display
 * @param {FabricCanvas} canvas - Canvas to test
 * @returns {boolean} Success status
 */
export const showGridTestPattern = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) {
    toast.error("Cannot create test pattern: Canvas is null");
    return false;
  }
  
  try {
    // Create a visually distinct test pattern
    const testObjects: FabricObject[] = [];
    
    // Create a red cross in the center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const size = 100;
    
    const hLine = new Line([centerX - size, centerY, centerX + size, centerY], {
      stroke: '#ff0000',
      strokeWidth: 4
    });
    
    const vLine = new Line([centerX, centerY - size, centerX, centerY + size], {
      stroke: '#ff0000',
      strokeWidth: 4
    });
    
    // Add a blue square around it
    const squareSize = 150;
    const square = new fabric.Rect({
      left: centerX - squareSize/2,
      top: centerY - squareSize/2,
      width: squareSize,
      height: squareSize,
      fill: 'transparent',
      stroke: '#0000ff',
      strokeWidth: 3
    });
    
    // Add objects to canvas
    canvas.add(hLine);
    canvas.add(vLine);
    canvas.add(square);
    
    testObjects.push(hLine, vLine, square);
    
    // Force render
    canvas.requestRenderAll();
    
    toast.success("Test pattern displayed. A red cross in a blue square should be visible.");
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      testObjects.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      canvas.requestRenderAll();
    }, 5000);
    
    return true;
  } catch (error) {
    trackGridError(error, "grid-test-pattern-failed");
    toast.error("Failed to create test pattern");
    return false;
  }
};
