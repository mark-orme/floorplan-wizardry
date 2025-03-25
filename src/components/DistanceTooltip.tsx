
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
  
  // Determine position for tooltip - prefer midPoint if available
  const tooltipPosition = midPoint || position || displayEndPoint;
  
  // Position the tooltip directly on the line
  // No vertical offset - place it exactly on the line
  const baseOffset = 0; // No offset from the line
  
  // Convert meter position to pixel position for display
  const pixelX = tooltipPosition.x * PIXELS_PER_METER;
  const pixelY = tooltipPosition.y * PIXELS_PER_METER;
  
  return (
    <div 
      className="absolute pointer-events-none z-50 text-white px-1.5 py-0.5 rounded-sm shadow-lg text-xs inline-flex items-center"
      style={{ 
        left: `${pixelX}px`, 
        top: `${pixelY + baseOffset}px`,
        transform: `translate(-50%, -50%)`, // Center both horizontally and vertically
        willChange: "transform", 
        backgroundColor: `rgba(0, 0, 0, 0.85)`,
        boxShadow: "0 0 0 1px rgba(255,255,255,0.2)",
        outline: "1px solid rgba(0,0,0,0.8)",
        maxWidth: "100px", // Keep tooltip very compact
        borderRadius: "3px",
        lineHeight: 1
      }}
    >
      <div className="flex items-center gap-1 whitespace-nowrap">
        <Ruler className="w-2.5 h-2.5 flex-shrink-0" />
        <span className="font-semibold">{formattedDistance}m</span>
        {gridUnits > 0 && (
          <span className="opacity-80 text-[0.65rem]">({gridUnits})</span>
        )}
      </div>
    </div>
  );
});

// Add displayName for better debugging
DistanceTooltip.displayName = "DistanceTooltip";
