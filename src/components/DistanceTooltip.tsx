import React, { memo, useEffect, useState } from "react";
import { type Point } from "@/types/drawingTypes";
import { Ruler } from "lucide-react";
import { calculateDistance, isExactGridMultiple } from "@/utils/geometry";
import { GRID_SIZE } from "@/utils/drawing";

interface DistanceTooltipProps {
  startPoint?: Point;
  currentPoint?: Point;
  midPoint?: Point;
  isVisible: boolean;
  position?: Point;
  zoomLevel?: number;
  currentZoom?: number; // Add currentZoom as an alternative to zoomLevel
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
  // Exit early if we don't have the necessary data
  if (!startPoint || !currentPoint || !isVisible) {
    return null;
  }
  
  // Use currentZoom if provided, otherwise fall back to zoomLevel
  const effectiveZoom = currentZoom || zoomLevel;
  
  // Calculate distance in meters with precision matching grid size (0.1m)
  const distanceInMeters = calculateDistance(startPoint, currentPoint);
  
  // If the distance is too small, don't show the tooltip
  if (distanceInMeters < 0.1) {
    return null;
  }
  
  // Calculate grid units for clearer representation (how many 0.1m grid cells)
  const gridUnits = Math.round(distanceInMeters / GRID_SIZE);
  
  // Calculate angle for diagonal lines (in degrees)
  const dx = currentPoint.x - startPoint.x;
  const dy = currentPoint.y - startPoint.y;
  const angleInDegrees = Math.atan2(dy, dx) * (180 / Math.PI);
  const normalizedAngle = ((angleInDegrees % 360) + 360) % 360;
  
  // Determine if this is a diagonal line (roughly 45, 135, 225, or 315 degrees)
  const diagonalAngles = [45, 135, 225, 315];
  const isDiagonal = diagonalAngles.some(angle => 
    Math.abs(normalizedAngle - angle) < 10
  );
  
  // Format the distance to always show 1 decimal place for consistency
  // This ensures measurements like 1.0m, 1.1m, 1.2m, etc.
  const formattedDistance = distanceInMeters.toFixed(1);
  
  // Determine position for tooltip - prefer midPoint if available
  const tooltipPosition = midPoint || position;
  
  // If we don't have position data, we can't show the tooltip
  if (!tooltipPosition) {
    return null;
  }
  
  // Calculate a vertical offset to position tooltip above the line
  // Scale the offset based on zoom level to ensure visibility at high zoom levels
  const baseOffset = -30; // Base offset in pixels
  const scaledOffset = baseOffset / Math.max(0.5, Math.min(effectiveZoom, 3)); // Adjust offset inversely with zoom
  
  // Background opacity adjusted based on zoom for better visibility
  const bgOpacity = Math.min(0.9, 0.8 + (effectiveZoom / 10));
  
  return (
    <div 
      className="absolute pointer-events-none z-50 text-white px-3 py-2 rounded-md shadow-lg"
      style={{ 
        left: `${tooltipPosition.x}px`, 
        top: `${tooltipPosition.y + scaledOffset}px`,
        transform: `translate(-50%, -100%)`, // Center horizontally and position above the point
        willChange: "transform", // Hint for browser optimization
        backgroundColor: `rgba(0, 0, 0, ${bgOpacity})`,
        boxShadow: "0 0 0 2px rgba(255,255,255,0.3), 0 4px 6px rgba(0,0,0,0.3)", // More visible outline
        fontSize: `${Math.max(12, Math.min(16, 14 / Math.sqrt(effectiveZoom)))}px` // Adjust font size based on zoom
      }}
    >
      <div className="flex items-center gap-2 whitespace-nowrap">
        <Ruler className="w-4 h-4" />
        <span className="font-medium">{formattedDistance} m</span>
        {gridUnits > 0 && (
          <span className="opacity-80">({gridUnits} grid units)</span>
        )}
        {isDiagonal && (
          <span className="opacity-80">({Math.round(normalizedAngle)}°)</span>
        )}
      </div>
    </div>
  );
});

// Add displayName for better debugging
DistanceTooltip.displayName = "DistanceTooltip";
