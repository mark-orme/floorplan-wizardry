
/**
 * Distance tooltip component
 * Displays the distance measurement between two points
 * @module DistanceTooltip
 */
import React, { memo } from "react";
import { type Point } from "@/types/drawingTypes";
import { Ruler } from "lucide-react";
import { calculateDistance, formatDistance } from "@/utils/geometry/lineOperations";
import { PIXELS_PER_METER } from "@/constants/numerics";
import { MIN_VISIBLE_DISTANCE, DEFAULT_TOOLTIP_MAX_WIDTH } from "@/utils/geometry/constants";
import { UI_SIZES } from "@/constants/uiConstants";

/**
 * Tooltip style constants
 * @constant {Object}
 */
const TOOLTIP_STYLES = {
  /**
   * Background color with opacity
   * @constant {string}
   */
  BACKGROUND_COLOR: "rgba(0, 0, 0, 0.9)",
  
  /**
   * Border opacity
   * @constant {number}
   */
  BORDER_OPACITY: 0.8,
  
  /**
   * Shadow opacity
   * @constant {number}
   */
  SHADOW_OPACITY: 0.4,
  
  /**
   * Icon size in pixels
   * @constant {number}
   */
  ICON_SIZE: UI_SIZES.SMALL_ICON_SIZE / 4,
  
  /**
   * Border width in pixels
   * @constant {number}
   */
  BORDER_WIDTH: 2,
  
  /**
   * Line height multiplier
   * @constant {number}
   */
  LINE_HEIGHT: 1.2,
  
  /**
   * CSS classes for tooltip container
   * @constant {string}
   */
  CONTAINER_CLASSES: "absolute pointer-events-none z-50 bg-black text-white px-2 py-1 rounded-md shadow-md text-xs inline-flex items-center",
  
  /**
   * CSS classes for tooltip content
   * @constant {string}
   */
  CONTENT_CLASSES: "flex items-center gap-2 whitespace-nowrap"
};

interface DistanceTooltipProps {
  startPoint?: Point | null;
  currentPoint?: Point | null;
  midPoint?: Point | null;
  isVisible: boolean;
  position?: Point | null;
  zoomLevel?: number;
  currentZoom?: number;
  isSnappedToGrid?: boolean;
  isAutoStraightened?: boolean;
}

/**
 * Tooltip component that displays the distance measurement of a line being drawn
 * Memoized for better performance
 * @param {DistanceTooltipProps} props - Component properties
 * @returns {JSX.Element | null} Distance tooltip component or null if not visible
 */
export const DistanceTooltip = memo(({
  startPoint,
  currentPoint,
  midPoint,
  isVisible,
  position,
  zoomLevel = 1,
  currentZoom = 1,
  isSnappedToGrid = false,
  isAutoStraightened = false
}: DistanceTooltipProps): React.ReactElement | null => {
  // Basic visibility check - if explicitly not visible, don't render
  if (!isVisible) {
    return null;
  }
  
  // Required points check
  if (!startPoint || !currentPoint) {
    return null;
  }
  
  // Calculate distance in meters - divide by PIXELS_PER_METER for proper unit conversion
  const distanceInPixels = calculateDistance(startPoint, currentPoint);
  const distanceInMeters = distanceInPixels / PIXELS_PER_METER;
  
  // Format distance for display - already in meters
  const formattedDistance = formatDistance(distanceInMeters);
  
  // Only show if distance is meaningful (avoid tiny movements)
  if (distanceInMeters < MIN_VISIBLE_DISTANCE) {
    return null;
  }
  
  // Use provided midpoint or calculate it
  const tooltipPosition = midPoint || {
    x: (startPoint.x + currentPoint.x) / 2,
    y: (startPoint.y + currentPoint.y) / 2
  };
  
  // Calculate position in pixels
  const pixelX = tooltipPosition.x;
  const pixelY = tooltipPosition.y;
  
  // Use effective zoom (current zoom from canvas if available)
  const effectiveZoom = currentZoom || zoomLevel;
  
  return (
    <div 
      className={TOOLTIP_STYLES.CONTAINER_CLASSES}
      style={{ 
        left: `${pixelX}px`, 
        top: `${pixelY}px`,
        transform: `translate(-50%, -50%) scale(${effectiveZoom > 0 ? 1/effectiveZoom : 1})`, 
        willChange: "transform", 
        outline: `${TOOLTIP_STYLES.BORDER_WIDTH}px solid rgba(255,255,255,${TOOLTIP_STYLES.BORDER_OPACITY})`,
        maxWidth: `${DEFAULT_TOOLTIP_MAX_WIDTH}px`,
        lineHeight: TOOLTIP_STYLES.LINE_HEIGHT,
        backgroundColor: TOOLTIP_STYLES.BACKGROUND_COLOR,
        boxShadow: `0 2px 6px rgba(0,0,0,${TOOLTIP_STYLES.SHADOW_OPACITY}), 0 0 0 1px rgba(255,255,255,${TOOLTIP_STYLES.BORDER_OPACITY})`
      }}
      data-testid="distance-tooltip"
    >
      <div className={TOOLTIP_STYLES.CONTENT_CLASSES}>
        <Ruler className="w-4 h-4 flex-shrink-0" />
        <span className="font-semibold">{formattedDistance}</span>
        {(isSnappedToGrid || isAutoStraightened) && (
          <span className="ml-1 text-xs opacity-80">
            {isSnappedToGrid && '📏'}
            {isAutoStraightened && '📐'}
          </span>
        )}
      </div>
    </div>
  );
});

// Add displayName for better debugging
DistanceTooltip.displayName = "DistanceTooltip";
