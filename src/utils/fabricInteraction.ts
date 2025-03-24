
/**
 * Fabric.js interaction utilities
 * Handles zooming, panning, and other interactive behaviors
 * @module fabricInteraction
 */
import { Canvas, Point as FabricPoint } from "fabric";
import { Point } from "@/utils/drawingTypes";
import { toFabricPoint, createSimplePoint } from "./fabricPointConverter";

/**
 * Add pinch-to-zoom support for touch devices
 * @param {Canvas} canvas - The fabric canvas instance
 */
export const addPinchToZoom = (canvas: Canvas) => {
  if (!canvas) {
    console.error("Cannot add pinch-to-zoom: canvas is null");
    return;
  }
  
  let startDistance: number = 0;
  let initialZoom: number = 0;
  
  // Using 'as any' to bypass strict typing for custom events
  // These events are declared in our fabric.d.ts file
  (canvas as any).on('touch:gesture', (event: any) => {
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
  
  // Using 'as any' to bypass strict typing for custom events
  (canvas as any).on('touch:gesture:end', () => {
    canvas.selection = true; // Re-enable selection
  });
};

/**
 * Snap a line to common angles (0°, 45°, 90°)
 * Improves drawing precision for straight and diagonal lines
 * 
 * @param {Point} startPoint - The starting point of the line
 * @param {Point} endPoint - The current end point of the line
 * @param {number} snapThreshold - Angular threshold for snapping in degrees
 * @returns {Point} The snapped end point
 */
export const snapToAngle = (
  startPoint: Point, 
  endPoint: Point, 
  snapThreshold: number = 15
): Point => {
  // Calculate the angle between the points
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  
  // No movement or very small movement - return original point
  if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
    return endPoint;
  }
  
  // Calculate the angle in radians and convert to degrees
  const rawAngle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // Common angles to snap to (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
  const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  
  // Find the closest snap angle
  let closestAngle = rawAngle;
  let minDifference = snapThreshold + 1; // Initialize higher than threshold
  
  snapAngles.forEach(snapAngle => {
    // Calculate the absolute difference between current angle and snap angle
    // Convert angles to 0-360 range for comparison
    const normalizedRawAngle = ((rawAngle % 360) + 360) % 360;
    const difference = Math.min(
      Math.abs(normalizedRawAngle - snapAngle),
      Math.abs(normalizedRawAngle - (snapAngle + 360))
    );
    
    if (difference < minDifference && difference < snapThreshold) {
      minDifference = difference;
      closestAngle = snapAngle;
    }
  });
  
  // If we found a close enough angle, snap to it
  if (minDifference < snapThreshold) {
    // Convert the angle back to radians
    const angleInRadians = closestAngle * (Math.PI / 180);
    
    // Calculate the distance between the points
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate the new end point based on the snapped angle
    return createSimplePoint(
      startPoint.x + distance * Math.cos(angleInRadians),
      startPoint.y + distance * Math.sin(angleInRadians)
    );
  }
  
  // If no snap is needed, return the original end point
  return endPoint;
};

/**
 * Enable panning on the canvas
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
 * @param {Canvas} canvas - The fabric canvas instance
 */
export const enableSelection = (canvas: Canvas) => {
  if (!canvas) return;
  
  canvas.selection = true;
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  
  // Make all objects selectable
  canvas.getObjects().forEach(obj => {
    if (obj.type !== 'line' && !obj.objectType?.includes('grid')) {
      obj.selectable = true;
      obj.hoverCursor = 'move';
    }
  });
  
  canvas.renderAll();
};

/**
 * Disable selection of objects on the canvas
 * @param {Canvas} canvas - The fabric canvas instance
 */
export const disableSelection = (canvas: Canvas) => {
  if (!canvas) return;
  
  canvas.selection = false;
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'default';
  
  // Make all objects non-selectable
  canvas.getObjects().forEach(obj => {
    obj.selectable = false;
    obj.hoverCursor = 'default';
  });
  
  canvas.discardActiveObject().renderAll();
};
