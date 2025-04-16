
import { useEffect, useCallback, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { useLineToolHandlers } from './useLineToolHandlers';
import { InputMethod } from './useLineInputMethod';
import { LineDistanceTooltip } from '@/components/canvas/LineDistanceTooltip';
import { createPortal } from 'react-dom';

interface UseStraightLineToolProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

export const useStraightLineTool = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseStraightLineToolProps) => {
  const [tooltipPortalContainer, setTooltipPortalContainer] = useState<HTMLElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    startPoint: Point | null;
    endPoint: Point | null;
  }>({
    startPoint: null,
    endPoint: null
  });

  const {
    isActive,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    shiftKeyPressed,
    measurementData,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    toggleGridSnapping,
    toggleAngles
  } = useLineToolHandlers({
    canvas,
    enabled,
    lineColor,
    lineThickness,
    saveCurrentState
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
    if (isActive && measurementData.distance !== null && canvas) {
      setIsDrawing(true);
    } else {
      setIsDrawing(false);
    }
  }, [isActive, measurementData, canvas]);

  // Setup event listeners
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    const canvasElement = canvas.getElement();
    
    canvasElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [canvas, enabled, handleMouseDown, handleMouseMove, handleMouseUp]);
  
  // Render tooltip through portal
  const renderTooltip = useCallback(() => {
    if (!tooltipPortalContainer || !isActive || !measurementData.distance) return null;
    
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
  }, [tooltipPortalContainer, isActive, measurementData, tooltipData]);

  return {
    isActive,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    shiftKeyPressed,
    measurementData,
    toggleGridSnapping,
    toggleAngles,
    renderTooltip,
    isDrawing
  };
};
