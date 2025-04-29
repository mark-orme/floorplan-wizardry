
import React from 'react';

interface LineToolMeasurementOverlayProps {
  visible: boolean;
  distance?: number;
  angle?: number;
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
  if (!visible || distance === undefined) return null;

  return (
    <div className="fixed top-4 left-4 bg-white/80 p-2 rounded shadow-md z-50">
      <div className="text-sm font-medium">
        <span>Distance: {distance.toFixed(1)} {unit}</span>
        {angle !== undefined && (
          <span className="ml-3">Angle: {angle.toFixed(1)}°</span>
        )}
        {isSnapped && (
          <span className="ml-3 text-green-500">Snapped</span>
        )}
      </div>
    </div>
  );
};
