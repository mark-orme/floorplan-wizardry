
import { useState, useEffect, useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { createPortal } from 'react-dom';
import { LineDistanceTooltip } from '@/components/canvas/LineDistanceTooltip';
import { MeasurementData } from '../useStraightLineTool.d';

/**
 * Hook for managing the tooltip portal for line measurements
 */
export const useTooltipPortal = (isDrawing: boolean, startPoint: Point | null, currentPoint: Point | null, measurementData: MeasurementData) => {
  // Create tooltip data state for rendering
  const [tooltipPortalContainer, setTooltipPortalContainer] = useState<HTMLElement | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    startPoint: Point | null;
    endPoint: Point | null;
  }>({
    startPoint: null,
    endPoint: null
  });
  
  // Create portal container for tooltips
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingContainer = document.getElementById('line-tooltip-container');
      if (existingContainer) {
        setTooltipPortalContainer(existingContainer);
      } else {
        const container = document.createElement('div');
        container.id = 'line-tooltip-container';
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '1000';
        document.body.appendChild(container);
        setTooltipPortalContainer(container);
      }
    }

    return () => {
      // Clean up container on unmount
      const container = document.getElementById('line-tooltip-container');
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  // Update tooltip position with measurement data
  useEffect(() => {
    if (isDrawing && startPoint && currentPoint) {
      setTooltipData({
        startPoint,
        endPoint: currentPoint
      });
    }
  }, [isDrawing, startPoint, currentPoint]);
  
  /**
   * Render tooltip through portal
   */
  const renderTooltip = useCallback(() => {
    if (!tooltipPortalContainer || !isDrawing || !measurementData.distance) return null;
    
    return createPortal(
      <LineDistanceTooltip
        startPoint={tooltipData.startPoint || { x: 0, y: 0 }}
        endPoint={tooltipData.endPoint || { x: 0, y: 0 }}
        distance={measurementData.distance}
        angle={measurementData.angle}
        unit={measurementData.unit}
        isSnapped={measurementData.snapped}
        snapType={measurementData.snapType}
      />,
      tooltipPortalContainer
    );
  }, [tooltipPortalContainer, isDrawing, measurementData, tooltipData]);

  return {
    tooltipData,
    renderTooltip
  };
};
