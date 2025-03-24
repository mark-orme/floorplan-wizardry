
import React from "react";
import { Point } from "@/utils/drawingTypes";
import { PIXELS_PER_METER } from "@/utils/drawing";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Ruler } from "lucide-react";

interface DistanceTooltipProps {
  startPoint: Point | null;
  currentPoint: Point | null;
  isVisible: boolean;
  position: { x: number; y: number };
}

/**
 * Tooltip component that displays the distance measurement of a line being drawn
 * @param {DistanceTooltipProps} props - Component properties
 * @returns {JSX.Element} Distance tooltip component
 */
export const DistanceTooltip = ({
  startPoint,
  currentPoint,
  isVisible,
  position
}: DistanceTooltipProps) => {
  if (!isVisible || !startPoint || !currentPoint) {
    return null;
  }
  
  // Calculate distance in meters
  const dx = currentPoint.x - startPoint.x;
  const dy = currentPoint.y - startPoint.y;
  const distanceInMeters = Math.sqrt(dx * dx + dy * dy);
  
  return (
    <div 
      className="absolute pointer-events-none z-50"
      style={{ 
        left: `${position.x + 20}px`, 
        top: `${position.y + 20}px`,
        transition: "transform 0.1s ease-out"
      }}
    >
      <div className="bg-black/80 text-white px-2 py-1 rounded-md flex items-center gap-1 text-sm">
        <Ruler className="w-4 h-4" />
        <span>{distanceInMeters.toFixed(2)} m</span>
      </div>
    </div>
  );
};
