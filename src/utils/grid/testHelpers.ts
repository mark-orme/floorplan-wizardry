
import { Point } from "@/types/core/Point";
import { createPoint } from "../pointHelpers";

// Test helper functions for grid operations
export const createTestGridPoints = (
  rows: number, 
  cols: number, 
  gridSize: number
): Point[] => {
  const points: Point[] = [];
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      points.push(createPoint(x * gridSize, y * gridSize));
    }
  }
  
  return points;
};

// Additional test helper functions can be added here
