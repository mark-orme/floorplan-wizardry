
/**
 * Utilities for canvas interaction handling (panning, zooming, etc.)
 * @module fabricInteraction
 */
import { Canvas } from "fabric";
import { Point } from "./drawingTypes";

/**
 * Add pinch-to-zoom gesture support for mobile and trackpad
 * @param {Canvas} fabricCanvas - The Fabric canvas instance
 * @param {Function} setZoomLevel - Function to update zoom level state
 */
export const addPinchToZoom = (fabricCanvas: Canvas, setZoomLevel?: (zoom: number) => void) => {
  try {
    // Track pinch gesture state
    let scaling = false;
    let startDistance = 0;
    let startZoom = 1;
    
    // Listen for gesture events on the canvas
    fabricCanvas.on("mouse:wheel", (opt) => {
      const delta = opt.e.deltaY;
      const zoom = fabricCanvas.getZoom();
      const newZoom = delta > 0 ? Math.max(0.1, zoom * 0.9) : Math.min(10, zoom * 1.1);
      
      // Zoom to point - more natural than zooming to center
      fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, newZoom);
      
      // Update zoom level state if callback provided
      if (setZoomLevel) {
        setZoomLevel(newZoom);
      }
      
      // Prevent page scrolling
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
    
    // Handle gesture events for touch devices
    // Webkit gesture events for Safari and some other mobile browsers
    const el = fabricCanvas.upperCanvasEl;
    el.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      scaling = true;
      startDistance = e.scale;
      startZoom = fabricCanvas.getZoom();
    });
    
    el.addEventListener('gesturechange', (e) => {
      if (!scaling) return;
      e.preventDefault();
      
      const newZoom = Math.min(10, Math.max(0.1, startZoom * (e.scale / startDistance)));
      const pointer = fabricCanvas.getPointer(e);
      fabricCanvas.zoomToPoint({ x: pointer.x, y: pointer.y }, newZoom);
      
      // Update zoom level state if callback provided
      if (setZoomLevel) {
        setZoomLevel(newZoom);
      }
    });
    
    el.addEventListener('gestureend', (e) => {
      e.preventDefault();
      scaling = false;
    });
    
    console.log("Pinch-to-zoom gesture support added");
  } catch (error) {
    console.error("Failed to add pinch-to-zoom:", error);
  }
};

/**
 * Enable panning on the canvas
 * @param {Canvas} fabricCanvas - The Fabric canvas instance
 */
export const enablePanning = (fabricCanvas: Canvas) => {
  try {
    let isPanning = false;
    let lastPosX = 0;
    let lastPosY = 0;
    
    fabricCanvas.on('mouse:down', (opt) => {
      const evt = opt.e;
      // Middle mouse button or spacebar + mouse down for panning
      if (evt.button === 1 || (evt.keyCode === 32 && evt.button === 0)) {
        isPanning = true;
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
        fabricCanvas.setCursor('grabbing');
      }
    });
    
    fabricCanvas.on('mouse:move', (opt) => {
      if (!isPanning) return;
      
      const evt = opt.e;
      const vpt = fabricCanvas.viewportTransform;
      if (!vpt) return;
      
      vpt[4] += evt.clientX - lastPosX;
      vpt[5] += evt.clientY - lastPosY;
      
      fabricCanvas.requestRenderAll();
      
      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
    });
    
    fabricCanvas.on('mouse:up', () => {
      isPanning = false;
      fabricCanvas.setCursor('default');
    });
    
    console.log("Panning enabled on canvas");
  } catch (error) {
    console.error("Failed to enable panning:", error);
  }
};

/**
 * Snap a line to common angles (0, 45, 90 degrees)
 * 
 * @param {Point} startPoint - The starting point of the line
 * @param {Point} endPoint - The current end point of the line
 * @param {number} [angleThreshold=15] - The threshold in degrees for snapping
 * @returns {Point} The snapped endpoint
 */
export const snapToAngle = (startPoint: Point, endPoint: Point, angleThreshold: number = 15): Point => {
  // Calculate angle of current line
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  
  // Calculate distance from start to end
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate current angle in degrees (0 to 360)
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  
  // Determine the closest snap angle (0, 45, 90, 135, etc.)
  // 0/180: horizontal, 90/270: vertical, 45/135/225/315: diagonal
  const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  
  // Find the closest snap angle
  let closestAngle = snapAngles[0];
  let minDiff = Math.abs(angle - closestAngle);
  
  for (let i = 1; i < snapAngles.length; i++) {
    const diff = Math.abs(angle - snapAngles[i]);
    if (diff < minDiff) {
      minDiff = diff;
      closestAngle = snapAngles[i];
    }
  }
  
  // Only snap if we're within the threshold
  if (minDiff <= angleThreshold) {
    // Convert angle back to radians for calculating the new point
    const snapAngleRad = closestAngle * (Math.PI / 180);
    
    // Calculate snapped endpoint
    return {
      x: startPoint.x + distance * Math.cos(snapAngleRad),
      y: startPoint.y + distance * Math.sin(snapAngleRad)
    };
  }
  
  // If not within threshold, return the original endpoint
  return endPoint;
};
