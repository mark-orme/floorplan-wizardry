
import React from 'react';
import { Point } from '@/types/core/Point';

interface LineDistanceTooltipProps {
  startPoint: Point;
  endPoint: Point;
  distance: number | null;
  angle?: number | null;
  unit?: string;
  isSnapped?: boolean;
  snapType?: 'grid' | 'angle' | 'object' | 'both' | null;
}

export const LineDistanceTooltip: React.FC<LineDistanceTooltipProps> = ({
  startPoint,
  endPoint,
  distance,
  angle = null,
  unit = 'px',
  isSnapped = false,
  snapType = null
}) => {
  if (!distance) return null;
  
  // Calculate midpoint for tooltip positioning
  const midX = (startPoint.x + endPoint.x) / 2;
  const midY = (startPoint.y + endPoint.y) / 2;
  
  // Determine background color based on snap type
  let bgColor = 'rgba(0, 0, 0, 0.75)';
  if (isSnapped) {
    if (snapType === 'grid') bgColor = 'rgba(59, 130, 246, 0.85)';  // Blue
    if (snapType === 'angle') bgColor = 'rgba(249, 115, 22, 0.85)'; // Orange
    if (snapType === 'object') bgColor = 'rgba(139, 92, 246, 0.85)'; // Purple
    if (snapType === 'both') bgColor = 'rgba(16, 185, 129, 0.85)';  // Green
  }
  
  return (
    <div 
      className="absolute pointer-events-none z-50 px-2 py-1 rounded-md flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-medium shadow-lg"
      style={{
        left: midX,
        top: midY - 10, // Offset a bit above the line
        backgroundColor: bgColor,
        minWidth: '60px'
      }}
    >
      <div className="whitespace-nowrap">
        {distance.toFixed(1)} {unit}
      </div>
      {angle !== null && (
        <div className="text-xs opacity-80">
          {angle.toFixed(1)}°
        </div>
      )}
    </div>
  );
};
