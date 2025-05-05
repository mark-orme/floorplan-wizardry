
import React from 'react';
import { cn } from '@/lib/utils';

interface LineToolMeasurementOverlayProps {
  visible: boolean;
  distance?: number;
  angle?: number;
  isSnapped?: boolean;
  unit?: string;
}

/**
 * Component to display measurement information for line tools
 */
export const LineToolMeasurementOverlay: React.FC<LineToolMeasurementOverlayProps> = ({
  visible,
  distance = 0,
  angle = 0,
  isSnapped = false,
  unit = 'px'
}) => {
  if (!visible) return null;
  
  const formattedDistance = Math.round(distance * 100) / 100;
  const formattedAngle = Math.round(angle);
  
  return (
    <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-lg shadow-lg z-50 transition-opacity">
      <div className="flex flex-col space-y-1 font-mono text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Distance:</span>
          <span className={cn(
            "font-semibold",
            isSnapped && "text-green-600"
          )}>
            {formattedDistance} {unit}
            {isSnapped && <span className="ml-1 text-xs">✓</span>}
          </span>
        </div>
        
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Angle:</span>
          <span className="font-semibold">{formattedAngle}°</span>
        </div>
      </div>
    </div>
  );
};

export default LineToolMeasurementOverlay;
