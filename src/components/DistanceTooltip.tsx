
import React, { memo } from "react";
import { type Point } from "@/types/drawingTypes";
import { Ruler } from "lucide-react";
import { calculateDistance, isExactGridMultiple } from "@/utils/geometry";
import { GRID_SIZE, PIXELS_PER_METER } from "@/utils/drawing";

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
  // For hovering (not actively drawing), we need either the position or the current point
  if (!isVisible) {
    return null;
  }
  
  // Use start & current point for active drawing, or position for hover measurements
  const displayStartPoint = startPoint || position;
  const displayEndPoint = currentPoint || position;
  
  // Exit if we don't have sufficient points to calculate
  if (!displayStartPoint || !displayEndPoint) {
    return null;
  }
  
  // Use currentZoom if provided, otherwise fall back to zoomLevel
  const effectiveZoom = currentZoom || zoomLevel;
  
  // Calculate distance in meters with precision matching grid size (0.1m)
  const distanceInMeters = calculateDistance(displayStartPoint, displayEndPoint);
  
  // If position is same as startPoint (no movement) or distance is too small, don't show
  if (position === startPoint || distanceInMeters < 0.05) {
    return null;
  }
  
  // Calculate grid units for clearer representation (how many 0.1m grid cells)
  const gridUnits = Math.round(distanceInMeters / GRID_SIZE);
  
  // Format the distance to always show 1 decimal place for consistency
  // This ensures measurements like 1.0m, 1.1m, 1.2m, etc.
  const formattedDistance = distanceInMeters.toFixed(1);
  
  // Calculate the exact midpoint of the line for tooltip placement
  // This is crucial for placing the tooltip directly on the line
  const tooltipPosition = midPoint || {
    x: (displayStartPoint.x + displayEndPoint.x) / 2,
    y: (displayStartPoint.y + displayEndPoint.y) / 2
  };
  
  // Convert the meter position to pixel position for display
  // The PIXELS_PER_METER conversion is critical for correct positioning
  const pixelX = tooltipPosition.x * PIXELS_PER_METER;
  const pixelY = tooltipPosition.y * PIXELS_PER_METER;
  
  return (
    <div 
      className="absolute pointer-events-none z-50 bg-black text-white px-2 py-1 rounded-md shadow-md text-xs inline-flex items-center"
      style={{ 
        left: `${pixelX}px`, 
        top: `${pixelY}px`,
        transform: `translate(-50%, -50%) scale(${effectiveZoom > 0 ? 1/effectiveZoom : 1})`, // Scale inversely with zoom
        willChange: "transform", 
        outline: "2px solid rgba(255,255,255,0.6)",
        maxWidth: "120px",
        lineHeight: 1.2,
        // Ensure high contrast for visibility
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.3)"
      }}
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Ruler className="w-3 h-3 flex-shrink-0" />
        <span className="font-semibold">{formattedDistance}m</span>
        {gridUnits > 0 && (
          <span className="opacity-90 text-[0.7rem]">({gridUnits})</span>
        )}
      </div>
    </div>
  );
});

// Add displayName for better debugging
DistanceTooltip.displayName = "DistanceTooltip";
