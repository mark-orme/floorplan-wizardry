
import { Point } from '@/types/canvas';

/**
 * Rotate a point around an origin point by a given angle in radians
 */
export const rotatePoint = (point: Point, origin: Point, angleRad: number): Point => {
  // Translate point to origin
  const translatedX = point.x - origin.x;
  const translatedY = point.y - origin.y;
  
  // Rotate
  const rotatedX = translatedX * Math.cos(angleRad) - translatedY * Math.sin(angleRad);
  const rotatedY = translatedX * Math.sin(angleRad) + translatedY * Math.cos(angleRad);
  
  // Translate back
  return {
    x: rotatedX + origin.x,
    y: rotatedY + origin.y
  };
};

/**
 * Scale a point from an origin point by scale factors
 */
export const scalePoint = (point: Point, origin: Point, scaleX: number, scaleY: number): Point => {
  // Translate point to origin
  const translatedX = point.x - origin.x;
  const translatedY = point.y - origin.y;
  
  // Scale
  const scaledX = translatedX * scaleX;
  const scaledY = translatedY * scaleY;
  
  // Translate back
  return {
    x: scaledX + origin.x,
    y: scaledY + origin.y
  };
};

/**
 * Translate a point by given offsets
 */
export const translatePoint = (point: Point, offsetX: number, offsetY: number): Point => {
  return {
    x: point.x + offsetX,
    y: point.y + offsetY
  };
};
