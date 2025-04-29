
import React from 'react';
import { cn } from '@/lib/utils';

interface LineToolMeasurementOverlayProps {
  visible: boolean;
  distance?: number | null;
  angle?: number | null;
  isSnapped?: boolean;
  unit?: string;
}

export const LineToolMeasurementOverlay: React.FC<LineToolMeasurementOverlayProps> = ({
  visible,
  distance,
  angle,
  isSnapped,
  unit = 'px'
}) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 p-2 bg-white/90 dark:bg-gray-800/90 rounded-md shadow-lg z-50 text-xs font-mono">
      <div className="flex flex-col gap-1">
        {distance !== null && distance !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Distance:</span>
            <span className={cn("font-semibold", isSnapped ? "text-green-600 dark:text-green-400" : "")}>
              {Math.round(distance)} {unit}
            </span>
          </div>
        )}
        
        {angle !== null && angle !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Angle:</span>
            <span className="font-semibold">
              {Math.round(angle)}°
            </span>
          </div>
        )}
        
        {isSnapped && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-green-600 dark:text-green-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>
            <span className="text-xs text-green-600 dark:text-green-400">Snapped</span>
          </div>
        )}
      </div>
    </div>
  );
};
