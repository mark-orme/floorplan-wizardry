
import React from 'react';
import { Point } from '@/types/core/Geometry';

interface LineDistanceTooltipProps {
  startPoint: Point;
  endPoint: Point;
  distance: number;
  angle?: number | null;
  unit?: string;
  isSnapped?: boolean;
  snapType?: string | null;
}

export const LineDistanceTooltip: React.FC<LineDistanceTooltipProps> = ({
  startPoint,
  endPoint,
  distance,
  angle = null,
  unit = 'm',
  isSnapped = false,
  snapType = null
}) => {
  // Calculate position (midpoint of the line)
  const positionX = (startPoint.x + endPoint.x) / 2;
  const positionY = (startPoint.y + endPoint.y) / 2;
  
  // Format distance (rounded to 2 decimal places)
  const formattedDistance = distance.toFixed(2);
  
  // Format angle if available (rounded to 1 decimal place)
  const formattedAngle = angle !== null ? angle.toFixed(1) : null;
  
  return (
    <div
      className="absolute pointer-events-none z-50 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
      style={{
        left: `${positionX}px`,
        top: `${positionY}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="flex flex-col items-center">
        <span className="font-medium">{formattedDistance} {unit}</span>
        {formattedAngle !== null && (
          <span className="text-xs text-gray-300">{formattedAngle}°</span>
        )}
        {isSnapped && snapType && (
          <span className="text-xs text-green-300">Snapped to {snapType}</span>
        )}
      </div>
    </div>
  );
};
