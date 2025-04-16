
import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { useLineState } from './useLineState';
import { useLineInputMethod, InputMethod } from './useLineInputMethod';
import { useEnhancedGridSnapping } from './useEnhancedGridSnapping';
import { useLinePreview } from './useLinePreview';

interface UseLineToolHandlersProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
  snapColor?: string;
}

export const useLineToolHandlers = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState,
  snapColor
}: UseLineToolHandlersProps) => {
  const [isActive, setIsActive] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [previewLine, setPreviewLine] = useState<Line | null>(null);
  const { inputMethod, isPencilMode, detectInputMethod } = useLineInputMethod();
  const { snapEnabled, toggleSnap, snapToGrid } = useEnhancedGridSnapping();
  const { getLinePreview } = useLinePreview();
  const [anglesEnabled, setAnglesEnabled] = useState(false);
  const measurementDataRef = useRef({ distance: null, angle: null, snapped: false });
  const [measurementData, setMeasurementData] = useState({ distance: null, angle: null, snapped: false, unit: 'px' });

  const resetState = () => {
    setStartPoint(null);
    setPreviewLine(null);
  };

  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);

  const toggleGridSnapping = useCallback(() => {
    toggleSnap();
  }, [toggleSnap]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!canvas || !enabled) return;

    detectInputMethod(e);

    const pointer = canvas.getPointer(e);
    const startPoint = { x: pointer.x, y: pointer.y };
    const snappedStart = snapToGrid(startPoint);

    setStartPoint(snappedStart);

    const line = new Line([snappedStart.x, snappedStart.y, snappedStart.x, snappedStart.y], {
      stroke: lineColor,
      strokeWidth: lineThickness,
      selectable: false,
      evented: false,
      objectCaching: false
    });

    canvas.add(line);
    setPreviewLine(line);
  }, [canvas, enabled, lineColor, lineThickness, detectInputMethod, snapToGrid]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive || !startPoint) return;
    
    const pointer = canvas.getPointer(e);
    const currentPoint = { x: pointer.x, y: pointer.y };
    
    // Get line preview with snapping
    const linePreview = getLinePreview(startPoint, currentPoint, snapEnabled);
    
    // Update preview line
    if (previewLine) {
      previewLine.set({
        x2: linePreview.endPoint.x,
        y2: linePreview.endPoint.y
      });
      
      // Apply different style if snapped
      if (linePreview.isSnapped) {
        previewLine.set({
          stroke: snapColor || lineColor,
          strokeDashArray: undefined
        });
      } else {
        previewLine.set({
          stroke: lineColor,
          strokeDashArray: [5, 5]
        });
      }
      
      canvas.renderAll();
    }
    
    // Calculate distance and angle
    const dx = linePreview.endPoint.x - startPoint.x;
    const dy = linePreview.endPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Update measurement data
    measurementDataRef.current = {
      distance: Math.round(distance),
      angle: Math.round(angle),
      snapped: linePreview.isSnapped
    };
    
    setMeasurementData({
      distance: Math.round(distance),
      angle: Math.round(angle),
      snapped: linePreview.isSnapped,
      unit: 'px'
    });
  }, [canvas, isActive, startPoint, previewLine, snapEnabled, lineColor, snapColor, getLinePreview]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!canvas || !isActive || !startPoint || !previewLine) return;

    const pointer = canvas.getPointer(e);
    const endPoint = { x: pointer.x, y: pointer.y };
    const snappedEnd = snapToGrid(endPoint);

    previewLine.set({
      x2: snappedEnd.x,
      y2: snappedEnd.y
    });

    previewLine.set({
      strokeDashArray: undefined,
      selectable: true,
      evented: true,
      objectCaching: true
    });

    canvas.renderAll();
    saveCurrentState();
    resetState();
  }, [canvas, isActive, startPoint, previewLine, snapToGrid, saveCurrentState]);

  return {
    isActive,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    measurementData,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    toggleGridSnapping,
    toggleAngles
  };
};
