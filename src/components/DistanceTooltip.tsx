
import React from 'react';
import { Point } from '@/types/drawingTypes';

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
  if (!isVisible || !midPoint) return null;

  // Calculate distance in meters for display
  const calculateMetricDistance = (): string => {
    if (!startPoint || !currentPoint) return '0.0m';
    
    // Calculate distance in pixels
    const dx = currentPoint.x - startPoint.x;
    const dy = currentPoint.y - startPoint.y;
    const pixelDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Convert to meters (assuming 100 pixels = 1 meter)
    const metersDistance = pixelDistance / 100;
    
    // Format to 1 decimal place and add units
    return `${metersDistance.toFixed(1)}m`;
  };

  // Position tooltip at the midpoint of the line
  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${midPoint.x}px`,
    top: `${midPoint.y - 28}px`, // Position above the line
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    transform: 'translate(-50%, -50%) scale(1)',
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
        <span style={{ fontSize: '10px', opacity: 0.8 }}>Snapped to grid</span>
      )}
      {isAutoStraightened && (
        <span style={{ fontSize: '10px', opacity: 0.8 }}>Auto-straightened</span>
      )}
    </div>
  );
};
