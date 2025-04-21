
// Geometry Web Worker
// Handles intensive geometry calculations off the main thread

import {
  calculatePolygonArea,
  perpendicularDistance,
  optimizePoints,
  snapPointToGrid
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
  return points.map(point => snapPointToGrid(point, gridSize));
}

// Optimize path by removing redundant points
function optimizePath(points: Point[], tolerance: number): Point[] {
  return optimizePoints(points, tolerance);
}

// Notify the main thread that the worker is ready
self.postMessage({
  id: 'init',
  success: true,
  result: { initialized: true }
} as WorkerResponse);
