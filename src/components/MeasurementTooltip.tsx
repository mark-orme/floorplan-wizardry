
/**
 * Enhanced measurement tooltip component
 * Displays precise measurements for lines and positions
 * @module components/MeasurementTooltip
 */
import React from 'react';
import { Point } from '@/types/core/Point';
import { PIXELS_PER_METER, AREA_PRECISION } from '@/constants/numerics';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Define these constants locally since they may not exist in numerics.ts yet
const DISTANCE_PRECISION = 2;
const STANDARD_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315, 360];

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
            <span className={nearestStandardAngle !== null ? "text-green-600" : "text-gray-600"}>
              {formattedAngle}
              {nearestStandardAngle !== null && (
                <span className="ml-1 text-[8px] bg-green-100 px-1 rounded">
                  ≈{nearestStandardAngle}°
                </span>
              )}
            </span>
          )}
        </div>
        
        {showGridPosition && (
          <div className="text-[9px] text-gray-500 mt-0.5">
            ({(startPoint.x / PIXELS_PER_METER).toFixed(1)},{(startPoint.y / PIXELS_PER_METER).toFixed(1)}) 
            → 
            ({(endPoint.x / PIXELS_PER_METER).toFixed(1)},{(endPoint.y / PIXELS_PER_METER).toFixed(1)})
          </div>
        )}
      </div>
    </div>
  );
};
