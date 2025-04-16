
import React from 'react';
import { Point } from '@/types/core/Point';
import { Badge } from '../ui/badge';

interface LineDistanceTooltipProps {
  startPoint: Point;
  endPoint: Point;
  distance: number | null;
  angle: number | null;
  unit?: string;
  isSnapped?: boolean;
  snapType?: 'grid' | 'angle' | 'both';
}

/**
 * Tooltip showing distance and angle information for a line
 */
export const LineDistanceTooltip: React.FC<LineDistanceTooltipProps> = ({
  startPoint,
  endPoint,
  distance,
  angle,
  unit = 'px',
  isSnapped = false,
  snapType
}) => {
  if (!distance || !angle) return null;
  
  // Calculate position at the midpoint of the line
  const midPoint = {
    x: (startPoint.x + endPoint.x) / 2,
    y: (startPoint.y + endPoint.y) / 2 - 30 // Position above the line
  };
  
  // Determine snap indicator symbol based on angle
  let snapIndicator = '↔';
  if (angle !== null) {
    if (angle === 0 || angle === 180) snapIndicator = '↔';
    else if (angle === 90 || angle === 270) snapIndicator = '↕';
    else if (angle === 45 || angle === 225) snapIndicator = '↗';
    else if (angle === 135 || angle === 315) snapIndicator = '↖';
  }
  
  // Determine background color based on snap type
  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  if (snapType === 'angle') badgeVariant = 'destructive';
  else if (snapType === 'both') badgeVariant = 'secondary';
  
  return (
    <div 
      className="absolute pointer-events-none z-10 bg-white/90 px-2 py-1 rounded-md shadow-md text-xs flex flex-col items-center border border-gray-300"
      style={{
        left: midPoint.x,
        top: midPoint.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex items-center gap-1">
        <span>{distance}{unit}</span>
        <span className="mx-1">|</span>
        <span>{angle}°</span>
        
        {isSnapped && (
          <Badge variant={badgeVariant} className="ml-1 h-5 min-w-5 flex items-center justify-center">
            {snapIndicator}
          </Badge>
        )}
      </div>
    </div>
  );
};
