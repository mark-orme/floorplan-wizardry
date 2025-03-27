
import React from 'react';
import { Point } from '@/types/drawingTypes';
import { PIXELS_PER_METER } from '@/constants/numerics';

interface DistanceTooltipProps {
  startPoint: Point | null;
  currentPoint: Point | null;
  midPoint: Point | null;
  isVisible: boolean;
  currentZoom: number;
  isSnappedToGrid?: boolean;
  isAutoStraightened?: boolean;
}

export const DistanceTooltip: React.FC<DistanceTooltipProps> = ({
  startPoint,
  currentPoint,
  midPoint,
  isVisible,
  currentZoom,
  isSnappedToGrid = false,
  isAutoStraightened = false
}) => {
  if (!isVisible || !midPoint || !startPoint || !currentPoint) return null;

  // Calculate distance in meters for display
  const calculateMetricDistance = (): string => {
    // Calculate distance in pixels
    const dx = currentPoint.x - startPoint.x;
    const dy = currentPoint.y - startPoint.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Convert to meters (assuming PIXELS_PER_METER is defined in constants)
    // Default to 100 pixels = 1 meter if constant not available
    const pixelsPerMeter = PIXELS_PER_METER || 100;
    const metersDistance = pixelDistance / pixelsPerMeter;
    
    // Format to 2 decimal places and add units
    return `${metersDistance.toFixed(2)}m`;
  };

  // Position tooltip at the midpoint of the line, accounting for zoom
  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${midPoint.x}px`,
    top: `${midPoint.y - 28}px`, // Position above the line
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: `${Math.max(12, 12 / currentZoom)}px`, // Scale font for better visibility during zoom
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    pointerEvents: 'none', // Prevent tooltip from interfering with mouse events
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    whiteSpace: 'nowrap'
  };

  return (
    <div 
      className="distance-tooltip" 
      style={tooltipStyle}
      data-testid="distance-tooltip"
    >
      <span>{calculateMetricDistance()}</span>
      {isSnappedToGrid && (
        <span style={{ fontSize: `${Math.max(10, 10 / currentZoom)}px`, opacity: 0.8 }}>Snapped to grid</span>
      )}
      {isAutoStraightened && (
        <span style={{ fontSize: `${Math.max(10, 10 / currentZoom)}px`, opacity: 0.8 }}>Auto-straightened</span>
      )}
    </div>
  );
};
