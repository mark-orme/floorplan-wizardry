
/**
 * Distance tooltip component
 * Displays measurement tooltips on the canvas
 * @module components/DistanceTooltip
 */
import React from 'react';
import { Point } from '@/types/geometryTypes';

/**
 * Constants for distance tooltip
 */
const TOOLTIP_CONSTANTS = {
  /** Tooltip background color */
  BACKGROUND_COLOR: 'rgba(255, 255, 255, 0.9)',
  
  /** Tooltip border color */
  BORDER_COLOR: 'rgba(0, 0, 0, 0.2)',
  
  /** Tooltip text color */
  TEXT_COLOR: '#333333',
  
  /** Tooltip font size */
  FONT_SIZE: 12,
  
  /** Tooltip padding */
  PADDING: 5,
  
  /** Tooltip border radius */
  BORDER_RADIUS: 4,
  
  /** Tooltip offset from line */
  OFFSET: 10
};

/**
 * Props for the DistanceTooltip component
 */
interface DistanceTooltipProps {
  /** Start point of the measurement */
  startPoint: Point;
  /** End point of the measurement */
  endPoint: Point;
  /** Distance in pixels */
  distance: number;
  /** Unit of measurement */
  unit?: string;
  /** Whether tooltip is visible */
  visible?: boolean;
  /** Position adjustment factor */
  positionAdjust?: number;
}

/**
 * Distance tooltip component
 * Displays measurement information on the canvas
 * 
 * @param props - Component props
 * @returns Rendered component
 */
export const DistanceTooltip: React.FC<DistanceTooltipProps> = ({
  startPoint,
  endPoint,
  distance,
  unit = 'px',
  visible = true,
  positionAdjust = TOOLTIP_CONSTANTS.OFFSET
}) => {
  if (!visible) return null;
  
  // Calculate midpoint for tooltip position
  const midX = (startPoint.x + endPoint.x) / 2;
  const midY = (startPoint.y + endPoint.y) / 2;
  
  // Format the distance
  const formattedDistance = distance.toFixed(2);
  
  // Calculate style for tooltip
  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${midX}px`,
    top: `${midY - positionAdjust}px`,
    transform: 'translate(-50%, -100%)',
    backgroundColor: TOOLTIP_CONSTANTS.BACKGROUND_COLOR,
    border: `1px solid ${TOOLTIP_CONSTANTS.BORDER_COLOR}`,
    borderRadius: `${TOOLTIP_CONSTANTS.BORDER_RADIUS}px`,
    padding: `${TOOLTIP_CONSTANTS.PADDING}px`,
    fontSize: `${TOOLTIP_CONSTANTS.FONT_SIZE}px`,
    color: TOOLTIP_CONSTANTS.TEXT_COLOR,
    pointerEvents: 'none',
    zIndex: 1000,
    whiteSpace: 'nowrap',
  };
  
  return (
    <div className="distance-tooltip" style={tooltipStyle} data-testid="distance-tooltip">
      {formattedDistance} {unit}
    </div>
  );
};
