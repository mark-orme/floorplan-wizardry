
import React, { memo } from "react";
import { type Point } from "@/types/drawingTypes";
import { Ruler } from "lucide-react";
import { calculateDistance, isExactGridMultiple } from "@/utils/geometry";

interface DistanceTooltipProps {
  startPoint?: Point;
  currentPoint?: Point;
  midPoint?: Point;
  isVisible: boolean;
  position?: { x: number; y: number };
}

/**
 * Tooltip component that displays the distance measurement of a line being drawn
 * Memoized for better performance
 * @param {DistanceTooltipProps} props - Component properties
 * @returns {JSX.Element} Distance tooltip component
 */
export const DistanceTooltip = memo(({
  startPoint,
  currentPoint,
  midPoint,
  isVisible,
  position
}: DistanceTooltipProps) => {
  // Exit early if we don't have the necessary data
  if (!startPoint || !currentPoint || !isVisible) {
    return null;
  }
  
  // Calculate distance in meters
  const distanceInMeters = calculateDistance(startPoint, currentPoint);
  
  // Don't show tooltip for very small distances or when points are the same
  // Increased threshold to prevent showing tooltip too early during initial click
  if (distanceInMeters < 0.05 || 
      (startPoint.x === currentPoint.x && startPoint.y === currentPoint.y)) {
    return null;
  }
  
  // Calculate grid counts (number of small grid cells)
  const dx = currentPoint.x - startPoint.x;
  const dy = currentPoint.y - startPoint.y;
  
  // Calculate angle for diagonal lines (in degrees)
  const angleInDegrees = Math.atan2(dy, dx) * (180 / Math.PI);
  const normalizedAngle = ((angleInDegrees % 360) + 360) % 360;
  
  // Determine if this is a diagonal line (roughly 45, 135, 225, or 315 degrees)
  const diagonalAngles = [45, 135, 225, 315];
  const isDiagonal = diagonalAngles.some(angle => 
    Math.abs(normalizedAngle - angle) < 10
  );
  
  // Check if the distance is an exact multiple of grid size (0.1m)
  const isExactMultiple = isExactGridMultiple(distanceInMeters);
  
  // Format the distance to always show 2 decimal places for consistency
  const formattedDistance = distanceInMeters.toFixed(2);
  
  // Determine position for tooltip - prefer midPoint if available
  const tooltipPosition = midPoint || position;
  
  // If we don't have position data, we can't show the tooltip
  if (!tooltipPosition) {
    return null;
  }
  
  // Calculate a vertical offset to position tooltip above the line
  const verticalOffset = -30; // Move tooltip slightly above the line
  
  return (
    <div 
      className="absolute pointer-events-none z-50 bg-black/80 text-white px-3 py-2 rounded-md shadow-lg"
      style={{ 
        left: `${tooltipPosition.x}px`, 
        top: `${tooltipPosition.y + verticalOffset}px`,
        transform: `translate(-50%, -100%)`, // Center horizontally and position above the point
        willChange: "transform", // Hint for browser optimization
        boxShadow: "0 0 0 2px rgba(255,255,255,0.3), 0 4px 6px rgba(0,0,0,0.3)" // More visible outline
      }}
    >
      <div className="flex items-center gap-2 text-sm whitespace-nowrap">
        <Ruler className="w-4 h-4" />
        <span className="font-medium">{formattedDistance} m</span>
        {isDiagonal && (
          <span className="text-xs opacity-80">({Math.round(normalizedAngle)}°)</span>
        )}
      </div>
    </div>
  );
});

// Add displayName for better debugging
DistanceTooltip.displayName = "DistanceTooltip";
