
import React from 'react';
import { cn } from '@/lib/utils';

interface LineToolMeasurementOverlayProps {
  visible: boolean;
  distance: number | null;
  angle: number | null;
  isSnapped: boolean;
  unit?: string;
  className?: string;
}

/**
 * Component that displays live measurement info during line drawing
 */
export const LineToolMeasurementOverlay: React.FC<LineToolMeasurementOverlayProps> = ({
  visible,
  distance,
  angle,
  isSnapped,
  unit = 'px',
  className
}) => {
  if (!visible || distance === null) return null;
  
  // Format distance for display
  const formattedDistance = Math.round(distance);
  
  // Standard angles for highlighting
  const standardAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  
  // Check if angle is near a standard angle
  const isStandardAngle = angle !== null && 
    standardAngles.some(stdAngle => Math.abs((angle % 360) - stdAngle) < 2);
  
  // Format angle for display
  const formattedAngle = angle !== null ? Math.round(angle % 360) : null;
  
  return (
    <div className={cn(
      "fixed bottom-4 left-4 z-50 px-4 py-3 rounded-lg shadow-md transition-opacity duration-200",
      "bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700",
      className
    )}>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Distance:</span>
          <span className="text-sm font-bold">{formattedDistance} {unit}</span>
          {isSnapped && (
            <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Snapped
            </span>
          )}
        </div>
        
        {angle !== null && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Angle:</span>
            <span className={cn(
              "text-sm font-bold",
              isStandardAngle && "text-blue-600 dark:text-blue-400"
            )}>
              {formattedAngle}°
            </span>
            {isStandardAngle && (
              <span className="px-1.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Standard
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
