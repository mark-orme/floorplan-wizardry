
import React, { memo } from "react";
import { Point } from "@/utils/drawingTypes";
import { Ruler } from "lucide-react";

interface DistanceTooltipProps {
  startPoint: Point | null;
  currentPoint: Point | null;
  isVisible: boolean;
  position: { x: number; y: number } | null;
  midPoint?: { x: number; y: number } | null; // Added optional midPoint prop
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
  isVisible,
  position,
  midPoint
}: DistanceTooltipProps) => {
  // Debug the tooltip visibility conditions
  console.log("Tooltip props:", { isVisible, startPoint, currentPoint, position, midPoint });
  
  // Exit early if we don't have the necessary data
  if (!startPoint || !currentPoint) {
    return null;
  }
  
  // Calculate distance in meters
  const dx = currentPoint.x - startPoint.x;
  const dy = currentPoint.y - startPoint.y;
  const distanceInMeters = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate angle for diagonal lines (in degrees)
  const angleInDegrees = Math.atan2(dy, dx) * (180 / Math.PI);
  const normalizedAngle = ((angleInDegrees % 360) + 360) % 360;
  
  // Determine if this is a diagonal line (roughly 45, 135, 225, or 315 degrees)
  const diagonalAngles = [45, 135, 225, 315];
  const isDiagonal = diagonalAngles.some(angle => 
    Math.abs(normalizedAngle - angle) < 15
  );
  
  // Exit if the distance is too small (prevents flickering for tiny movements)
  if (distanceInMeters < 0.01) {
    return null;
  }
  
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
        <span className="font-medium">{distanceInMeters.toFixed(2)} m</span>
        {isDiagonal && (
          <span className="text-xs opacity-80">({Math.round(normalizedAngle)}°)</span>
        )}
      </div>
    </div>
  );
});

// Add displayName for better debugging
DistanceTooltip.displayName = "DistanceTooltip";
