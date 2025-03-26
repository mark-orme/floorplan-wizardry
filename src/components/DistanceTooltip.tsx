
/**
 * Distance tooltip component
 * Displays the distance measurement between two points
 * @module DistanceTooltip
 */
import React, { memo } from "react";
import { type Point } from "@/types/drawingTypes";
import { Ruler } from "lucide-react";
import { calculateDistance, formatDistance } from "@/utils/geometry/lineOperations";
import { PIXELS_PER_METER } from "@/constants/numerics";

interface DistanceTooltipProps {
  startPoint?: Point | null;
  currentPoint?: Point | null;
  midPoint?: Point | null;
  isVisible: boolean;
  position?: Point | null;
  zoomLevel?: number;
  currentZoom?: number;
}

/**
 * Tooltip component that displays the distance measurement of a line being drawn
 * Memoized for better performance
 * @param {DistanceTooltipProps} props - Component properties
 * @returns {JSX.Element | null} Distance tooltip component or null if not visible
 */
export const DistanceTooltip = memo(({
  startPoint,
  currentPoint,
  midPoint,
  isVisible,
  position,
  zoomLevel = 1,
  currentZoom = 1
}: DistanceTooltipProps): React.ReactElement | null => {
  // Basic visibility check - if explicitly not visible, don't render
  if (!isVisible) {
    return null;
  }
  
  // Required points check
  if (!startPoint || !currentPoint) {
    console.log("Missing required points for distance tooltip");
    return null;
  }
  
  // Calculate distance in meters
  const distance = calculateDistance(startPoint, currentPoint);
  
  // Format distance to 2 decimal places
  const formattedDistance = formatDistance(distance);
  
  // Only show if distance is meaningful (avoid tiny movements)
  if (distance < 0.05) {
    return null;
  }
  
  // Use provided midpoint or calculate it
  const tooltipPosition = midPoint || {
    x: (startPoint.x + currentPoint.x) / 2,
    y: (startPoint.y + currentPoint.y) / 2
  };
  
  // Calculate position in pixels
  const pixelX = tooltipPosition.x;
  const pixelY = tooltipPosition.y;
  
  // Use effective zoom (current zoom from canvas if available)
  const effectiveZoom = currentZoom || zoomLevel;
  
  return (
    <div 
      className="absolute pointer-events-none z-50 bg-black text-white px-2 py-1 rounded-md shadow-md text-xs inline-flex items-center"
      style={{ 
        left: `${pixelX}px`, 
        top: `${pixelY}px`,
        transform: `translate(-50%, -50%) scale(${effectiveZoom > 0 ? 1/effectiveZoom : 1})`, 
        willChange: "transform", 
        outline: "2px solid rgba(255,255,255,0.8)",
        maxWidth: "120px",
        lineHeight: 1.2,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.4)"
      }}
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Ruler className="w-3 h-3 flex-shrink-0" />
        <span className="font-semibold">{formattedDistance}m</span>
      </div>
    </div>
  );
});

// Add displayName for better debugging
DistanceTooltip.displayName = "DistanceTooltip";
