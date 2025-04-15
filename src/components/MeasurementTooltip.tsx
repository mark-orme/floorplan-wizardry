
/**
 * Enhanced measurement tooltip component
 * Displays precise measurements for lines and positions
 * @module components/MeasurementTooltip
 */
import React from 'react';
import { Point } from '@/types/core/Point';
import { PIXELS_PER_METER, DISTANCE_PRECISION, STANDARD_ANGLES } from '@/constants/numerics';

interface MeasurementTooltipProps {
  /** Start point of measurement */
  startPoint: Point;
  /** End point of measurement */
  endPoint: Point;
  /** Whether to show angle */
  showAngle?: boolean;
  /** Whether to show grid position */
  showGridPosition?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * Calculate distance between two points in pixels
 */
const calculatePixelDistance = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate angle between two points in degrees
 */
const calculateAngle = (p1: Point, p2: Point): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  
  // Calculate angle in radians
  const angleRad = Math.atan2(dy, dx);
  
  // Convert to degrees
  let angleDeg = angleRad * (180 / Math.PI);
  
  // Normalize to 0-360
  if (angleDeg < 0) {
    angleDeg += 360;
  }
  
  return angleDeg;
};

/**
 * Format distance for display
 */
const formatDistance = (pixels: number): string => {
  const meters = pixels / PIXELS_PER_METER;
  return `${meters.toFixed(DISTANCE_PRECISION)}m`;
};

/**
 * Get nearest standard angle
 */
const getNearestStandardAngle = (angle: number): number | null => {
  const nearest = STANDARD_ANGLES.reduce((closest, current) => {
    const currentDiff = Math.abs(angle - current);
    const closestDiff = Math.abs(angle - closest);
    return currentDiff < closestDiff ? current : closest;
  }, STANDARD_ANGLES[0]);
  
  // Only return if within threshold
  const diff = Math.abs(angle - nearest);
  return diff <= 5 ? nearest : null;
};

/**
 * Enhanced measurement tooltip component
 */
export const MeasurementTooltip: React.FC<MeasurementTooltipProps> = ({
  startPoint,
  endPoint,
  showAngle = true,
  showGridPosition = false,
  className = ''
}) => {
  // Calculate measurements
  const distance = calculatePixelDistance(startPoint, endPoint);
  const angle = calculateAngle(startPoint, endPoint);
  const nearestStandardAngle = getNearestStandardAngle(angle);
  
  // Calculate position for tooltip (midpoint)
  const midpointX = (startPoint.x + endPoint.x) / 2;
  const midpointY = (startPoint.y + endPoint.y) / 2;
  
  // Format distance and angle
  const formattedDistance = formatDistance(distance);
  const formattedAngle = angle.toFixed(1) + '°';
  
  return (
    <div 
      className={`absolute bg-white/90 px-2 py-1 rounded border border-gray-300 text-xs font-medium shadow-sm ${className}`}
      style={{
        left: midpointX + 'px',
        top: midpointY - 25 + 'px',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        pointerEvents: 'none'
      }}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-bold">{formattedDistance}</span>
          {showAngle && (
            <span className={nearestStandardAngle !== null ? "text-green-600 font-bold" : ""}>
              {formattedAngle}
            </span>
          )}
        </div>
        
        {showGridPosition && (
          <div className="text-gray-500 text-[10px]">
            ({(endPoint.x / PIXELS_PER_METER).toFixed(1)}m, {(endPoint.y / PIXELS_PER_METER).toFixed(1)}m)
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasurementTooltip;
