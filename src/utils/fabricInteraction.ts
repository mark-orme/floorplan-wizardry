
/**
 * Fabric.js interaction utilities
 * Handles zooming, panning, and other interactive behaviors for canvas elements
 * @module fabricInteraction
 */
import { Canvas, Point as FabricPoint, Object as FabricObject } from "fabric";
import { Point, GRID_SIZE } from "@/utils/drawingTypes";
import { toFabricPoint, createSimplePoint } from "./fabricPointConverter";
import { forceGridAlignment } from "./geometry";

/**
 * Add pinch-to-zoom support for touch devices
 * Enables multi-touch gestures for zooming the canvas in and out
 * @param {Canvas} canvas - The fabric canvas instance
 */
export const addPinchToZoom = (canvas: Canvas) => {
  if (!canvas) {
    console.error("Cannot add pinch-to-zoom: canvas is null");
    return;
  }
  
  let startDistance: number = 0;
  let initialZoom: number = 0;
  
  // Cast to access custom touch events
  interface ExtendedCanvas extends Canvas {
    on(eventName: string, handler: (event: any) => void): this;
  }
  
  const extendedCanvas = canvas as ExtendedCanvas;
  
  extendedCanvas.on('touch:gesture', (event: any) => {
    if (event.e.touches && event.e.touches.length === 2) {
      // Disable object selection during pinch zoom
      canvas.selection = false;
      
      const touch1 = event.e.touches[0];
      const touch2 = event.e.touches[1];
      
      // Calculate current distance between the two points
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (event.type === 'touch:gesture:start') {
        startDistance = currentDistance;
        initialZoom = canvas.getZoom();
      } else if (event.type === 'touch:gesture:move') {
        if (startDistance === 0) return;
        
        const zoomFactor = currentDistance / startDistance;
        let newZoom = initialZoom * zoomFactor;
        
        // Limit zoom level
        newZoom = Math.max(0.5, Math.min(newZoom, 2));
        
        // Create a proper Fabric.js Point for zooming
        const zoomPoint = new FabricPoint(event.e.offsetX, event.e.offsetY);
        canvas.zoomToPoint(zoomPoint, newZoom);
        canvas.requestRenderAll();
      }
    }
  });
  
  extendedCanvas.on('touch:gesture:end', () => {
    canvas.selection = true; // Re-enable selection
  });
};

/**
 * Snap a line to common angles (0°, 45°, 90°)
 * Improved version with strict grid enforcement for walls
 * 
 * @param {Point} startPoint - The starting point of the line
 * @param {Point} endPoint - The current end point of the line
 * @param {number} snapThreshold - Angular threshold for snapping in degrees
 * @returns {Point} The snapped end point
 */
export const snapToAngle = (
  startPoint: Point, 
  endPoint: Point, 
  snapThreshold: number = 5 // Reduced threshold for better precision
): Point => {
  // Calculate the angle between the points
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  
  // No movement or very small movement - return original point
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
    return startPoint; // Return start point to avoid zero-length lines
  }
  
  // Calculate the angle in radians and convert to degrees
  const rawAngle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Common angles to snap to (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
  const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  
  // Find the closest snap angle
  let closestAngle = rawAngle;
  let minDifference = 360;
  
  snapAngles.forEach(snapAngle => {
    // Calculate the absolute difference between current angle and snap angle
    // Convert angles to 0-360 range for comparison
    const normalizedRawAngle = ((rawAngle % 360) + 360) % 360;
    const difference = Math.min(
      Math.abs(normalizedRawAngle - snapAngle),
      Math.abs(normalizedRawAngle - (snapAngle + 360))
    );
    
    if (difference < minDifference) {
      minDifference = difference;
      closestAngle = snapAngle;
    }
  });
  
  // Always snap to closest angle for wall lines
  // Convert the angle back to radians
  const angleInRadians = closestAngle * (Math.PI / 180);
  
  // Calculate the distance between the points
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Round the distance to nearest grid multiple for exact alignment
  const roundedDistance = Math.round(distance / GRID_SIZE) * GRID_SIZE;
  
  // Calculate the raw end point based on the snapped angle and rounded distance
  const rawEndPoint = {
    x: startPoint.x + roundedDistance * Math.cos(angleInRadians),
    y: startPoint.y + roundedDistance * Math.sin(angleInRadians)
  };
  
  // Force grid alignment for absolute precision
  const snappedEndPoint = forceGridAlignment(rawEndPoint);
  
  // For perfectly horizontal lines (0° or 180°)
  if (closestAngle === 0 || closestAngle === 180) {
    return {
      x: snappedEndPoint.x,
      y: startPoint.y // Keep exact same Y coordinate
    };
  }
  
  // For perfectly vertical lines (90° or 270°)
  if (closestAngle === 90 || closestAngle === 270) {
    return {
      x: startPoint.x, // Keep exact same X coordinate
      y: snappedEndPoint.y
    };
  }
  
  // For diagonal lines (45°, 135°, 225°, 315°)
  if ([45, 135, 225, 315].includes(closestAngle)) {
    // Calculate the exact diagonal distance for perfect 45° angles
    const diagonalLength = Math.round(Math.min(
      Math.abs(snappedEndPoint.x - startPoint.x),
      Math.abs(snappedEndPoint.y - startPoint.y)
    ) / GRID_SIZE) * GRID_SIZE;
    
    // Calculate signs for X and Y direction
    const signX = Math.sign(snappedEndPoint.x - startPoint.x);
    const signY = Math.sign(snappedEndPoint.y - startPoint.y);
    
    // Create a perfect 45° diagonal point
    return {
      x: Number((startPoint.x + diagonalLength * signX).toFixed(3)),
      y: Number((startPoint.y + diagonalLength * signY).toFixed(3))
    };
  }
  
  return snappedEndPoint;
};

/**
 * Enable panning on the canvas
 * Allows dragging the canvas view with the right mouse button
 * @param {Canvas} canvas - The fabric canvas instance
 */
export const enablePanning = (canvas: Canvas) => {
  if (!canvas) {
    console.error("Cannot enable panning: canvas is null");
    return;
  }
  
  let panning = false;
  
  canvas.on('mouse:down', (opt: any) => {
    const evt = opt.e;
    if (evt.buttons === 2) { // Right mouse button
      panning = true;
      canvas.selection = false;
      canvas.defaultCursor = 'grab';
    }
  });
  
  canvas.on('mouse:move', (opt: any) => {
    if (panning && opt.e) {
      // Create a proper Fabric.js Point for panning
      const delta = new FabricPoint(opt.e.movementX, opt.e.movementY);
      canvas.relativePan(delta);
      canvas.requestRenderAll();
    }
  });
  
  canvas.on('mouse:up', () => {
    panning = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';
  });
  
  canvas.on('mouse:out', () => {
    panning = false;
    canvas.selection = true;
    canvas.defaultCursor = 'default';
  });
};

/**
 * Enable selection of objects on the canvas
 * Makes objects selectable and interactive
 * @param {Canvas} canvas - The fabric canvas instance
 */
export const enableSelection = (canvas: Canvas) => {
  if (!canvas) return;
  
  canvas.selection = true;
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  
  // Make all objects selectable
  canvas.getObjects().forEach(obj => {
    // Access the custom objectType property
    const fabricObj = obj as FabricObject & { 
      objectType?: string;
      targetFindTolerance?: number;
      perPixelTargetFind?: boolean;
    };
    
    const objectType = fabricObj.objectType;
    
    // Make non-grid objects selectable
    if (!objectType || !objectType.includes('grid')) {
      obj.selectable = true;
      obj.evented = true;
      obj.hoverCursor = 'move';
      
      // Special handling for lines and walls
      if (obj.type === 'line' || obj.type === 'polyline' || objectType === 'line') {
        obj.hoverCursor = 'pointer';
        // Increase hit area to make selection easier
        fabricObj.perPixelTargetFind = false;
        fabricObj.targetFindTolerance = 10;
      }
    }
  });
  
  canvas.requestRenderAll();
};

/**
 * Disable selection of objects on the canvas
 * Makes objects non-selectable for drawing operations
 * @param {Canvas} canvas - The fabric canvas instance
 */
export const disableSelection = (canvas: Canvas) => {
  if (!canvas) return;
  
  canvas.selection = false;
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
  
  // Make all objects non-selectable
  canvas.getObjects().forEach(obj => {
    const fabricObj = obj as FabricObject & { objectType?: string };
    
    obj.selectable = false;
    obj.evented = fabricObj.objectType?.includes('grid') ? false : true; // Keep grid non-interactive
    obj.hoverCursor = 'default';
  });
  
  // Fixed: Call discardActiveObject and requestRenderAll as separate operations
  // This fixes the "renderAll is not a function" error
  canvas.discardActiveObject();
  canvas.requestRenderAll();
};
