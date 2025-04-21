
// Geometry Web Worker
// Handles intensive geometry calculations off the main thread

import {
  calculatePolygonArea,
  perpendicularDistance
} from "@/utils/geometry/engine";
import { Point } from "@/types/core/Geometry";

// Types for messages
type WorkerRequest = {
  id: string;
  type: string;
  payload: any;
};

type WorkerResponse = {
  id: string;
  success: boolean;
  result?: any;
  error?: string;
};

// Handle messages from the main thread
self.onmessage = function(e: MessageEvent<WorkerRequest>) {
  const { id, type, payload } = e.data;
  
  try {
    let result: any;
    
    // Process based on request type
    switch (type) {
      case 'calculateArea':
        result = calculateArea(payload.points);
        break;
        
      case 'snapToGrid':
        result = snapToGridPoints(payload.points, payload.gridSize);
        break;
        
      case 'optimizePath':
        result = optimizePath(payload.points, payload.tolerance);
        break;
        
      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
    
    // Send successful response back to main thread
    self.postMessage({
      id,
      success: true,
      result
    } as WorkerResponse);
    
  } catch (error) {
    // Send error response back to main thread
    self.postMessage({
      id,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    } as WorkerResponse);
  }
};

// Calculate area of polygon
function calculateArea(points: Point[]): number {
  return calculatePolygonArea(points);
}

// Snap points to grid
function snapToGridPoints(points: Point[], gridSize: number): Point[] {
  return points.map(point => ({
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  }));
}

// Optimize path by removing redundant points
function optimizePath(points: Point[], tolerance: number): Point[] {
  // Use Douglas-Peucker algorithm
  if (points.length <= 2) return points;
  
  const result: Point[] = [];
  const markers = new Array(points.length).fill(false);
  
  // Mark start and end points
  markers[0] = markers[points.length - 1] = true;
  
  // Apply the algorithm recursively
  douglasPeucker(points, 0, points.length - 1, tolerance, markers);
  
  // Collect the marked points
  for (let i = 0; i < points.length; i++) {
    if (markers[i]) result.push(points[i]);
  }
  
  return result;
}

// Douglas-Peucker algorithm for path simplification
function douglasPeucker(points: Point[], start: number, end: number, tolerance: number, markers: boolean[]): void {
  if (end <= start + 1) return;
  
  let maxDistance = 0;
  let maxIndex = 0;
  
  // Find the point with the maximum distance
  for (let i = start + 1; i < end; i++) {
    const distance = perpendicularDistance(points[i], points[start], points[end]);
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = i;
    }
  }
  
  // If max distance is greater than tolerance, recursively simplify
  if (maxDistance > tolerance) {
    markers[maxIndex] = true;
    douglasPeucker(points, start, maxIndex, tolerance, markers);
    douglasPeucker(points, maxIndex, end, tolerance, markers);
  }
}

// Notify the main thread that the worker is ready
self.postMessage({
  id: 'init',
  success: true,
  result: { initialized: true }
} as WorkerResponse);
