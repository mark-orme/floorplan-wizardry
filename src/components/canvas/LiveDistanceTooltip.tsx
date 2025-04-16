
import React from 'react';
import { Point } from '@/types/core/Point';
import { cn } from '@/lib/utils';

interface LiveDistanceTooltipProps {
  startPoint: Point;
  endPoint: Point;
  distance: number;
  angle: number;
  isVisible: boolean;
  isSnapped?: boolean;
  snapType?: 'grid' | 'angle' | 'both';
  unit?: string;
  className?: string;
}

/**
 * Component that shows a live distance and angle tooltip during drawing
 */
export const LiveDistanceTooltip: React.FC<LiveDistanceTooltipProps> = ({
  startPoint,
  endPoint,
  distance,
  angle,
  isVisible,
  isSnapped = false,
  snapType,
  unit = 'm',
  className
}) => {
  if (!isVisible) return null;
  
  // Calculate position at midpoint
  const midX = (startPoint.x + endPoint.x) / 2;
  const midY = (startPoint.y + endPoint.y) / 2 - 30; // Position above the line
  
  // Format for display
  const formattedDistance = (distance / 100).toFixed(2); // Assuming 100px = 1m
  const formattedAngle = Math.round(angle);
  
  // Determine snap indicator
  let snapIndicator = '⟷'; // Default horizontal
  if (isSnapped) {
    if (angle === 0 || angle === 180) snapIndicator = '⟷';
    else if (angle === 90 || angle === 270) snapIndicator = '⟵';
    else if (angle === 45 || angle === 225) snapIndicator = '⟲';
    else if (angle === 135 || angle === 315) snapIndicator = '⟳';
    else snapIndicator = '⟲';
  }
  
  // Style for tooltip
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${midX}px`,
    top: `${midY}px`,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none'
  };
  
  return (
    <div 
      className={cn(
        "px-2 py-1 bg-white/90 border border-gray-300 rounded shadow-sm text-xs flex flex-col items-center z-50",
        className
      )}
      style={style}
      data-testid="live-distance-tooltip"
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{formattedDistance}{unit}</span>
        <span className="text-gray-500">|</span>
        <span className="font-medium">{formattedAngle}°</span>
        
        {isSnapped && (
          <span className={cn(
            "ml-1 px-1 rounded text-white text-xs",
            snapType === 'grid' ? "bg-blue-500" : 
            snapType === 'angle' ? "bg-orange-500" : 
            "bg-purple-500"
          )}>
            {snapIndicator}
          </span>
        )}
      </div>
    </div>
  );
};
