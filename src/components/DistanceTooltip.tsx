
import React, { memo } from "react";
import { type Point } from "@/types/drawingTypes";
import { Ruler } from "lucide-react";
import { calculateDistance, isExactGridMultiple } from "@/utils/geometry";
import { GRID_SIZE } from "@/utils/drawing";

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
  
  // Calculate a vertical offset to position tooltip above the line
  // Scale the offset based on zoom level to ensure visibility at high zoom levels
  const baseOffset = -30; // Base offset in pixels
  const scaledOffset = baseOffset / Math.max(0.5, Math.min(effectiveZoom, 3)); // Adjust offset inversely with zoom
  
  // Background opacity adjusted based on zoom for better visibility
  const bgOpacity = Math.min(0.9, 0.8 + (effectiveZoom / 10));
  
  // Convert meter position to pixel position for display
  const pixelX = tooltipPosition.x * 100; // Using constant 100 pixels per meter for display
  const pixelY = tooltipPosition.y * 100;
  
  return (
    <div 
      className="absolute pointer-events-none z-50 text-white px-3 py-2 rounded-md shadow-lg"
      style={{ 
        left: `${pixelX}px`, 
        top: `${pixelY + scaledOffset}px`,
        transform: `translate(-50%, -100%)`, // Center horizontally and position above the point
        willChange: "transform", // Hint for browser optimization
        backgroundColor: `rgba(0, 0, 0, ${bgOpacity})`,
        boxShadow: "0 0 0 2px rgba(255,255,255,0.3), 0 4px 6px rgba(0,0,0,0.3)" // More visible outline
      }}
    >
      <div className="flex items-center gap-2 text-sm whitespace-nowrap">
        <Ruler className="w-4 h-4" />
        <span className="font-medium">{formattedDistance} m</span>
        {gridUnits > 0 && (
          <span className="text-xs opacity-80">({gridUnits} grid units)</span>
        )}
      </div>
    </div>
  );
});

// Add displayName for better debugging
DistanceTooltip.displayName = "DistanceTooltip";
