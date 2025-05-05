
import React from 'react';

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
  if (!visible || distance === undefined || distance === null) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded shadow-md z-50">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center">
          <span className="text-sm font-medium">Distance:</span>
          <span className="ml-2 text-sm">{Math.round(distance)}{unit}</span>
          {isSnapped && (
            <span className="ml-1 text-xs text-green-400">(snapped)</span>
          )}
        </div>
        
        {angle !== undefined && angle !== null && (
          <div className="flex items-center">
            <span className="text-sm font-medium">Angle:</span>
            <span className="ml-2 text-sm">{Math.round(angle)}°</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineToolMeasurementOverlay;
