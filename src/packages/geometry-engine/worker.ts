
import { WorkerMessageData } from './types';
import { optimizePoints, snapPointsToGrid } from './transformations';
import { calculateDistance, perpendicularDistance } from './core';
import { simplifyPolyline } from './simplification';

// Worker entrypoint
self.onmessage = (event: MessageEvent<WorkerMessageData>) => {
  try {
    const data = event.data;
    
    switch (data.type) {
      case 'transform':
        handleTransform(data);
        break;
      case 'calculate':
        handleCalculate(data);
        break;
      case 'simplify':
        handleSimplify(data);
        break;
      case 'snap':
        handleSnap(data);
        break;
      default:
        throw new Error(`Unknown operation type: ${data.type}`);
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      result: null
    });
  }
};

function handleTransform(data: WorkerMessageData) {
  const { points, options } = data;
  
  if (options?.optimize) {
    const optimized = optimizePoints(points, options.minDistance || 5);
    self.postMessage({
      type: 'transform.optimize',
      result: optimized
    });
  }
}

function handleCalculate(data: WorkerMessageData) {
  const { points, options } = data;
  
  if (options?.distances) {
    const distances: number[] = [];
    
    for (let i = 1; i < points.length; i++) {
      distances.push(calculateDistance(points[i-1], points[i]));
    }
    
    self.postMessage({
      type: 'calculate.distances',
      result: distances
    });
  }
}

function handleSimplify(data: WorkerMessageData) {
  const { points, options } = data;
  const epsilon = options?.epsilon || 2;
  
  const simplified = simplifyPolyline(points, epsilon);
  
  self.postMessage({
    type: 'simplify.result',
    result: simplified
  });
}

function handleSnap(data: WorkerMessageData) {
  const { points, options } = data;
  const gridSize = options?.gridSize || 10;
  
  const snapped = snapPointsToGrid(points, gridSize);
  
  self.postMessage({
    type: 'snap.result',
    result: snapped
  });
}
