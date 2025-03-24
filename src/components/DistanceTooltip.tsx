
import React, { memo } from "react";
import { Point } from "@/utils/drawingTypes";
import { PIXELS_PER_METER } from "@/utils/drawing";
import { Ruler } from "lucide-react";

interface DistanceTooltipProps {
  startPoint: Point | null;
  currentPoint: Point | null;
  isVisible: boolean;
  position: { x: number; y: number };
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
  position
}: DistanceTooltipProps) => {
  if (!isVisible || !startPoint || !currentPoint) {
    return null;
  }
  
  // Calculate distance in pixels then convert to meters
  const dx = currentPoint.x - startPoint.x;
  const dy = currentPoint.y - startPoint.y;
  const distanceInPixels = Math.sqrt(dx * dx + dy * dy);
  const distanceInMeters = distanceInPixels;
  
  return (
    <div 
      className="absolute pointer-events-none z-50"
      style={{ 
        left: `${position.x + 20}px`, 
        top: `${position.y + 20}px`,
        transform: `translate3d(0,0,0)`, // Hardware acceleration
        willChange: "transform", // Hint for browser optimization
        transition: "transform 0.1s ease-out"
      }}
    >
      <div className="bg-black/80 text-white px-3 py-2 rounded-md flex items-center gap-2 text-sm shadow-md">
        <Ruler className="w-4 h-4" />
        <span className="font-medium">{distanceInMeters.toFixed(2)} m</span>
      </div>
    </div>
  );
});

// Add displayName for better debugging
DistanceTooltip.displayName = "DistanceTooltip";
