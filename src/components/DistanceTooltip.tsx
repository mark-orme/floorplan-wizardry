
/**
 * Distance tooltip component
 * Displays measurement tooltips on the canvas
 * @module components/DistanceTooltip
 */
import React from 'react';
import type { Point } from '@/types/geometryTypes';
import { PIXELS_PER_METER } from '@/constants/numerics';
import { useUnitConversion } from '@/hooks/useUnitConversion';
import { useTranslation } from 'react-i18next';

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
  OFFSET: 10,
  
  /** Pixels per meter conversion factor */
  PIXELS_PER_METER: PIXELS_PER_METER
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
  distance?: number;
  /** Position adjustment factor */
  positionAdjust?: number;
  /** Conversion factor from pixels to measurement units */
  pixelsPerUnit?: number;
  /** Whether to show angle */
  showAngle?: boolean;
  /** Fixed CSS class for overrides */
  className?: string;
  /** Whether tooltip is visible */
  visible?: boolean;
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
  distance: propDistance,
  visible = true,
  positionAdjust = TOOLTIP_CONSTANTS.OFFSET,
  pixelsPerUnit = TOOLTIP_CONSTANTS.PIXELS_PER_METER,
  showAngle = true,
  className = ''
}) => {
  const { t } = useTranslation();
  const { formatDistance } = useUnitConversion();
  
  if (!visible) return null;
  
  // Calculate midpoint for tooltip position
  const midX = (startPoint.x + endPoint.x) / 2;
  const midY = (startPoint.y + endPoint.y) / 2;
  
  // Calculate distance if not provided
  const distanceInPixels = propDistance !== undefined ? propDistance : Math.sqrt(
    Math.pow(endPoint.x - startPoint.x, 2) + 
    Math.pow(endPoint.y - startPoint.y, 2)
  );
  
  // Convert distance from pixels to meters
  const distanceInMeters = distanceInPixels / pixelsPerUnit;
  
  // Format the distance using our localization utility
  const formattedDistance = formatDistance(distanceInMeters);
  
  // Calculate angle if needed
  let angleDisplay = null;
  if (showAngle) {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * (180 / Math.PI)).toFixed(1);
    angleDisplay = <span className="text-gray-600 ml-1">{angleDeg}°</span>;
  }
  
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
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };
  
  return (
    <div 
      className={`distance-tooltip ${className}`} 
      style={tooltipStyle} 
      data-testid="distance-tooltip"
    >
      <div className="flex items-center">
        <span className="font-medium">{formattedDistance}</span>
        {angleDisplay}
      </div>
    </div>
  );
};
