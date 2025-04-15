
import { Point } from '@/types/core/Point';

/**
 * Represents an edge of a grid cell
 */
export interface GridEdge {
  start: Point;
  end: Point;
}

/**
 * Represents a cell in the grid
 */
export interface GridCell {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  center: Point;
  edges: {
    north: GridEdge;
    east: GridEdge;
    south: GridEdge;
    west: GridEdge;
  };
  isIntersection: boolean;
}

/**
 * Represents a grid configuration
 */
export interface GridConfig {
  cellSize: number;
  rows: number;
  cols: number;
  lineColor: string;
  lineWidth: number;
  majorLineInterval?: number;
  majorLineColor?: string;
  majorLineWidth?: number;
}
