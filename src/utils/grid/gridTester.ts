
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { GRID_ERROR_MESSAGES } from "./errorTypes";
import logger from "@/utils/logger";

/**
 * Interface for grid test results
 */
interface GridTestResult {
  success: boolean;
  gridCount: number;
  message: string;
  issues: string[];
}

/**
 * Interface for grid rendering analysis
 */
interface GridRenderingAnalysis {
  horizontalLines: number;
  verticalLines: number;
  lineSpacingConsistent: boolean;
  rendering: {
    clean: boolean;
    issues: string[];
  };
  quality: "good" | "fair" | "poor";
}

/**
 * Test grid creation capabilities
 * @param canvas The fabric canvas to test
 * @returns Test results
 */
export const testGridCreationCapabilities = (canvas: FabricCanvas): GridTestResult => {
  if (!canvas) {
    return {
      success: false,
      gridCount: 0,
      message: GRID_ERROR_MESSAGES.CANVAS_NULL,
      issues: [GRID_ERROR_MESSAGES.CANVAS_NULL]
    };
  }

  const issues: string[] = [];
  
  // Get all objects on canvas
  const allObjects = canvas.getObjects();
  
  // Filter grid objects
  const gridObjects = allObjects.filter(obj => (obj as any).objectType === 'grid');
  
  if (gridObjects.length === 0) {
    issues.push(GRID_ERROR_MESSAGES.GRID_EMPTY);
  }

  // Check canvas dimensions
  if (canvas.width === 0 || canvas.height === 0) {
    issues.push(GRID_ERROR_MESSAGES.CANVAS_INVALID);
  }

  return {
    success: issues.length === 0,
    gridCount: gridObjects.length,
    message: issues.length === 0 
      ? `Grid test passed with ${gridObjects.length} grid objects` 
      : `Grid test failed with ${issues.length} issues`,
    issues
  };
};

/**
 * Analyze grid rendering
 * @param canvas The fabric canvas to analyze
 * @returns Grid rendering analysis
 */
export const analyzeGridRendering = (canvas: FabricCanvas): GridRenderingAnalysis => {
  if (!canvas) {
    return {
      horizontalLines: 0,
      verticalLines: 0,
      lineSpacingConsistent: false,
      rendering: {
        clean: false,
        issues: [GRID_ERROR_MESSAGES.CANVAS_NULL]
      },
      quality: "poor"
    };
  }

  // Get all objects on canvas
  const allObjects = canvas.getObjects();
  
  // Filter grid objects
  const gridObjects = allObjects.filter(obj => (obj as any).objectType === 'grid');
  
  // Separate horizontal and vertical lines
  const horizontalLines: Line[] = [];
  const verticalLines: Line[] = [];
  
  gridObjects.forEach(obj => {
    // Assuming grid objects are Line instances with x1, x2, y1, y2 properties
    // We classify lines as horizontal if y1 === y2 (same y coordinate)
    const line = obj as unknown as Line;
    if (line.x1 === line.x2) {
      verticalLines.push(line);
    } else if (line.y1 === line.y2) {
      horizontalLines.push(line);
    }
  });

  // Check spacing consistency
  let lineSpacingConsistent = true;
  const issues: string[] = [];
  
  // If very few grid objects, grid is inconsistent
  if (gridObjects.length < 10) {
    lineSpacingConsistent = false;
    issues.push("Too few grid lines");
  }
  
  // Check if horizontal lines are evenly spaced
  if (horizontalLines.length >= 2) {
    const yCoords = horizontalLines.map(line => (line as any).y1).sort((a, b) => a - b);
    const diffs = [];
    
    for (let i = 1; i < yCoords.length; i++) {
      diffs.push(yCoords[i] - yCoords[i-1]);
    }
    
    const avgDiff = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length;
    const tolerance = 0.5; // Tolerance for spacing variation
    
    for (const diff of diffs) {
      if (Math.abs(diff - avgDiff) > tolerance) {
        lineSpacingConsistent = false;
        issues.push("Horizontal lines not evenly spaced");
        break;
      }
    }
  }
  
  // Evaluate quality
  let quality: "good" | "fair" | "poor";
  if (horizontalLines.length >= 10 && verticalLines.length >= 10 && lineSpacingConsistent) {
    quality = "good";
  } else if (horizontalLines.length >= 5 && verticalLines.length >= 5) {
    quality = "fair";
  } else {
    quality = "poor";
  }
  
  return {
    horizontalLines: horizontalLines.length,
    verticalLines: verticalLines.length,
    lineSpacingConsistent,
    rendering: {
      clean: issues.length === 0,
      issues
    },
    quality
  };
};

/**
 * Show a grid test pattern
 * Used for debugging grid rendering issues
 * @param canvas The fabric canvas to test
 * @param scale Scale of the test pattern (default 1)
 * @returns The created test objects
 */
export const showGridTestPattern = (
  canvas: FabricCanvas, 
  scale: number = 1
): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot show grid test pattern: Canvas is null");
    return [];
  }
  
  const testObjects: FabricObject[] = [];
  const spacing = 50 * scale;
  
  // Create a test pattern with lines and rectangles
  for (let i = 0; i < 5; i++) {
    // Create horizontal line
    const hLine = new Line([
      0, i * spacing, 
      canvas.width, i * spacing
    ], {
      stroke: 'rgba(255, 0, 0, 0.5)',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      objectType: 'gridTest'
    });
    
    // Create vertical line
    const vLine = new Line([
      i * spacing, 0, 
      i * spacing, canvas.height
    ], {
      stroke: 'rgba(0, 0, 255, 0.5)',
      strokeWidth: 2,
      selectable: false,
      evented: false,
      objectType: 'gridTest'
    });
    
    canvas.add(hLine);
    canvas.add(vLine);
    
    testObjects.push(hLine);
    testObjects.push(vLine);
  }
  
  canvas.renderAll();
  
  return testObjects;
};
