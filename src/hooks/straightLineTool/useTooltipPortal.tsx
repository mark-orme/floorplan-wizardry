
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Point } from '@/types/core/Point';
import { MeasurementData } from '../useStraightLineTool.d';
import { LineDistanceTooltip } from '@/components/canvas/LineDistanceTooltip';

/**
 * Hook for managing the tooltip portal for line measurements
 */
export const useTooltipPortal = (
  isDrawing: boolean,
  startPoint: Point | null,
  currentPoint: Point | null,
  measurementData: MeasurementData
) => {
  const [tooltipPortalContainer, setTooltipPortalContainer] = useState<HTMLElement | null>(null);
  
  // Create tooltip portal container
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
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
    
    // Cleanup on unmount
    return () => {
      const container = document.getElementById('line-tooltip-container');
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);
  
  // Render tooltip with measurement data
  const renderTooltip = () => {
    if (!tooltipPortalContainer || !isDrawing || !measurementData.distance || !startPoint || !currentPoint) {
      return null;
    }
    
    return createPortal(
      <LineDistanceTooltip
        startPoint={startPoint}
        endPoint={currentPoint}
        distance={measurementData.distance}
        angle={measurementData.angle}
        unit={measurementData.unit}
        isSnapped={measurementData.snapped}
        snapType={measurementData.snapType}
      />,
      tooltipPortalContainer
    );
  };
  
  return {
    renderTooltip
  };
};
