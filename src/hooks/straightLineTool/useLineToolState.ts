
import { useState, useRef, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { MeasurementData } from '../useStraightLineTool.d';
import { useLineState } from './useLineState';

/**
 * Hook that manages the state for the straight line tool
 */
export const useLineToolState = (
  canvas: FabricCanvas | null,
  enabled: boolean,
  lineColor = '#000000',
  lineThickness = 2,
  saveCurrentState = () => {}
) => {
  // Create a reference to hold the canvas
  const fabricCanvasRef = useRef<FabricCanvas | null>(canvas);
  
  // Update the ref when canvas changes
  useEffect(() => {
    fabricCanvasRef.current = canvas;
  }, [canvas]);
  
  // Get line state from the hook
  const lineState = useLineState({
    canvas: fabricCanvasRef.current,
    lineColor,
    lineThickness,
    saveCurrentState
  });
  
  // Default measurement data
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    snapped: false,
    unit: 'px'
  });
  
  // Track if we're enabled
  const [isEnabled, setIsEnabled] = useState(enabled);

  // Update isEnabled state when enabled prop changes
  useEffect(() => {
    setIsEnabled(enabled);
  }, [enabled]);

  /**
   * Update the measurement data based on current drawing
   */
  const updateMeasurementData = (startPoint: Point, currentPoint: Point, snapEnabled: boolean, anglesEnabled: boolean) => {
    const dx = currentPoint.x - startPoint.x;
    const dy = currentPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    setMeasurementData({
      distance,
      angle,
      snapped: snapEnabled,
      unit: 'px',
      snapType: anglesEnabled ? 'angle' : (snapEnabled ? 'grid' : undefined)
    });
  };

  return {
    lineState,
    measurementData,
    setMeasurementData,
    updateMeasurementData,
    isEnabled,
    setIsEnabled,
    fabricCanvasRef
  };
};
