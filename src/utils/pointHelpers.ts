
import { Point } from '../types/core/Point';

export interface PointOptions {
  x: number;
  y: number;
}

export const createPoint = (x: number, y: number): Point => {
  return { x, y };
};

export const distanceBetweenPoints = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const midpoint = (p1: Point, p2: Point): Point => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

export const isPointWithinRadius = (p: Point, center: Point, radius: number): boolean => {
  return distanceBetweenPoints(p, center) <= radius;
};

export const snapPointToGrid = (p: Point, gridSize: number): Point => {
  return {
    x: Math.round(p.x / gridSize) * gridSize,
    y: Math.round(p.y / gridSize) * gridSize
  };
};
