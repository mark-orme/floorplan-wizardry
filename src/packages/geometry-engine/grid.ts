
import { Point } from '@/types/canvas';

/**
 * Generate grid points
 */
export const generateGridPoints = (
  width: number, 
  height: number, 
  gridSize: number
): Point[] => {
  const points: Point[] = [];
  
  // Generate grid points
  for (let x = 0; x <= width; x += gridSize) {
    for (let y = 0; y <= height; y += gridSize) {
      points.push({ x, y });
    }
  }
  
  return points;
};

/**
 * Generate grid lines
 */
export const generateGridLines = (
  width: number, 
  height: number, 
  gridSize: number
): { start: Point; end: Point }[] => {
  const lines: { start: Point; end: Point }[] = [];
  
  // Generate horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    lines.push({
      start: { x: 0, y },
      end: { x: width, y }
    });
  }
  
  // Generate vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    lines.push({
      start: { x, y: 0 },
      end: { x, y: height }
    });
  }
  
  return lines;
};
