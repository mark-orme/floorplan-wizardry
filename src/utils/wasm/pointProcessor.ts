
import { Point } from '@/types/core/Geometry';

let wasmModule: WebAssembly.Instance | null = null;

export async function initPointProcessor(): Promise<void> {
  try {
    const response = await fetch('/wasm/geometry.wasm');
    const buffer = await response.arrayBuffer();
    const { instance } = await WebAssembly.instantiate(buffer);
    wasmModule = instance;
  } catch (error) {
    console.error('Failed to load WASM module:', error);
    throw new Error('Failed to initialize point processor');
  }
}

export function processPoints(points: Point[], smoothingFactor: number = 0.5): Point[] {
  if (!wasmModule) {
    console.warn('WASM module not initialized, falling back to JS implementation');
    return smoothPoints(points);
  }

  try {
    // Convert points to flat array for WASM
    const flatPoints = new Float64Array(points.length * 2);
    points.forEach((point, i) => {
      flatPoints[i * 2] = point.x;
      flatPoints[i * 2 + 1] = point.y;
    });

    // Process points using WASM
    const result = (wasmModule.exports as any).processPoints(
      flatPoints.buffer,
      points.length,
      smoothingFactor
    );

    // Convert result back to Point array
    const processed = new Float64Array(result);
    return Array.from({ length: points.length }, (_, i) => ({
      x: processed[i * 2],
      y: processed[i * 2 + 1]
    }));
  } catch (error) {
    console.error('Error in WASM point processing:', error);
    return smoothPoints(points);
  }
}

// Fallback JS implementation
function smoothPoints(points: Point[]): Point[] {
  if (points.length <= 2) return points;
  
  return points.map((point, i, arr) => {
    if (i === 0 || i === arr.length - 1) return point;
    
    const prev = arr[i - 1];
    const next = arr[i + 1];
    
    return {
      x: (prev.x + point.x * 2 + next.x) / 4,
      y: (prev.y + point.y * 2 + next.y) / 4
    };
  });
}
