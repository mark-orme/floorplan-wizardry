
import { Point } from "@/types/core/Point";
import { createPoint } from "../pointHelpers";

// Function to convert data types for floor plan exports
export const convertPoints = (points: { x: number; y: number }[]): Point[] => {
  return points.map(point => createPoint(point.x, point.y));
};

// Additional conversion functions can be added here as needed
