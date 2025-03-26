
import React, { memo } from "react";
import { type Point } from "@/types/drawingTypes";
import { Ruler } from "lucide-react";
import { calculateDistance, formatDistance } from "@/utils/geometry/lineOperations";
import { PIXELS_PER_METER } from "@/utils/drawing";

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
  currentZoom
}: DistanceTooltipProps): React.ReactElement | null => {
  // Enhanced visibility check
  // If explicitly not visible, don't render
  if (isVisible === false) {
    console.log("Tooltip explicitly hidden");
    return null;
  }
  
  // Use start & current point for active drawing, or position for hover measurements
  const displayStartPoint = startPoint || position;
  const displayEndPoint = currentPoint || position;
  
  // Exit early if we don't have sufficient points to calculate
  if (!displayStartPoint || !displayEndPoint) {
    console.log("Missing points for distance tooltip", { displayStartPoint, displayEndPoint });
    return null;
  }
  
  // Use currentZoom if provided, otherwise fall back to zoomLevel
  const effectiveZoom = currentZoom || zoomLevel;
  
  // Calculate distance in meters with precision matching grid size (0.1m)
  const distanceInMeters = calculateDistance(displayStartPoint, displayEndPoint);
  
  // If points are too close, don't show tooltip yet
  if (distanceInMeters < 0.05) {
    return null;
  }
  
  // Format the distance to always show 1 decimal place for consistency
  const formattedDistance = formatDistance(distanceInMeters);
  
  // Calculate the exact midpoint of the line for tooltip placement
  const tooltipPosition = midPoint || {
    x: (displayStartPoint.x + displayEndPoint.x) / 2,
    y: (displayStartPoint.y + displayEndPoint.y) / 2
  };
  
  // Convert the meter position to pixel position for display
  const pixelX = tooltipPosition.x * PIXELS_PER_METER;
  const pixelY = tooltipPosition.y * PIXELS_PER_METER;
  
  // Log for debugging
  console.log("Rendering distance tooltip:", { 
    formattedDistance, 
    startPoint: displayStartPoint, 
    endPoint: displayEndPoint,
    position: { x: pixelX, y: pixelY },
    isVisible
  });
  
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
