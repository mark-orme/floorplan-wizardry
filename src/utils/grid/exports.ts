
/**
 * Organized grid utility exports
 * Grouped by functionality for cleaner imports
 */
import { createGrid, forceGridVisibility, setGridVisibility } from '@/utils/canvasGrid';
import { createBasicEmergencyGrid, resetGridProgress } from '@/utils/gridCreationUtils';
import { forceGridCreationAndVisibility } from '@/utils/grid/gridVisibility';
import { runGridDiagnostics, applyGridFixes, emergencyGridFix } from '@/utils/grid/gridDiagnostics';

// Define the core grid utility functions to export
export const snapPointToGrid = (point: { x: number, y: number }, gridSize = 10) => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

export const snapLineToGrid = (line: { x1: number, y1: number, x2: number, y2: number }, gridSize = 10) => {
  return {
    x1: Math.round(line.x1 / gridSize) * gridSize,
    y1: Math.round(line.y1 / gridSize) * gridSize,
    x2: Math.round(line.x2 / gridSize) * gridSize,
    y2: Math.round(line.y2 / gridSize) * gridSize
  };
};

export const snapLineToStandardAngles = (line: { x1: number, y1: number, x2: number, y2: number }, angleStep = 45) => {
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const length = Math.sqrt(dx * dx + dy * dy);
  
  // Snap to nearest standard angle
  const snappedAngle = Math.round(angle / angleStep) * angleStep;
  const snappedRad = snappedAngle * (Math.PI / 180);
  
  return {
    x1: line.x1,
    y1: line.y1,
    x2: line.x1 + length * Math.cos(snappedRad),
    y2: line.y1 + length * Math.sin(snappedRad)
  };
};

export const snapToAngle = (startX: number, startY: number, endX: number, endY: number, snapAngle = 45) => {
  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const length = Math.sqrt(dx * dx + dy * dy);
  
  // Snap to nearest angle
  const snappedAngle = Math.round(angle / snapAngle) * snapAngle;
  const snappedRad = snappedAngle * (Math.PI / 180);
  
  return {
    x: startX + length * Math.cos(snappedRad),
    y: startY + length * Math.sin(snappedRad)
  };
};

export const isPointOnGrid = (point: { x: number, y: number }, gridSize = 10, tolerance = 2) => {
  const xDiff = point.x % gridSize;
  const yDiff = point.y % gridSize;
  
  return (
    (xDiff <= tolerance || xDiff >= gridSize - tolerance) &&
    (yDiff <= tolerance || yDiff >= gridSize - tolerance)
  );
};

export const getNearestGridPoint = (point: { x: number, y: number }, gridSize = 10) => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

export const distanceToGrid = (point: { x: number, y: number }, gridSize = 10) => {
  const xDist = point.x % gridSize;
  const yDist = point.y % gridSize;
  
  // Get the minimum distance to a grid line
  const xDistToGrid = Math.min(xDist, gridSize - xDist);
  const yDistToGrid = Math.min(yDist, gridSize - yDist);
  
  // Return the minimum of the two
  return Math.min(xDistToGrid, yDistToGrid);
};

export const distanceToGridLine = (point: { x: number, y: number }, gridSize = 10) => {
  const xDist = point.x % gridSize;
  const yDist = point.y % gridSize;
  
  // Get the minimum distance to a grid line
  const xDistToGrid = Math.min(xDist, gridSize - xDist);
  const yDistToGrid = Math.min(yDist, gridSize - yDist);
  
  return {
    x: xDistToGrid,
    y: yDistToGrid
  };
};

/**
 * Grid creation utilities
 */
export const GridCreation = {
  createGrid,
  createEmergencyGrid: createBasicEmergencyGrid,
  forceGridVisibility,
  forceGridCreationAndVisibility,
  resetProgress: resetGridProgress
};

/**
 * Grid validation utilities
 */
export const GridValidation = {
  runDiagnostics: runGridDiagnostics
};

/**
 * Grid debugging utilities
 */
export const GridDebug = {
  fix: forceGridCreationAndVisibility,
  reset: resetGridProgress,
  forceVisible: forceGridVisibility
};
