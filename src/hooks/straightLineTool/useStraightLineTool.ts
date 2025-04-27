import { useCallback, useEffect, useRef, useState } from 'react';
import { Point } from '@/types/core/Point';
import { Canvas, Object as FabricObject } from 'fabric';
import { MeasurementData } from './types';
import { FabricCanvasMouseEvent, FabricCanvasObjectEvent } from '@/types/fabricEvents';

export interface UseStraightLineToolProps {
  canvas: Canvas | null;
  enabled?: boolean;
  snapToGrid?: boolean;
  snapAngle?: number;
  color?: string;
  thickness?: number;
  onLineCreated?: (line: FabricObject) => void;
  onMeasurementChange?: (measurement: MeasurementData) => void;
}

export interface StraightLineMeta {
  isDrawing: boolean;
  startPoint: Point | null;
  activeLine: FabricObject | null;
  measurement: MeasurementData | null;
}

export interface StraightLineToolResult {
  isEnabled: boolean;
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  finishDrawing: () => void;
  cancelDrawing: () => void;
  currentMeasurement: MeasurementData | null;
}

export const useStraightLineTool = ({
  canvas,
  enabled = false,
  snapToGrid = true,
  snapAngle = 45,
  color = '#000000',
  thickness = 2,
  onLineCreated,
  onMeasurementChange
}: UseStraightLineToolProps): StraightLineToolResult => {
  const lineMetaRef = useRef<StraightLineMeta>({
    isDrawing: false,
    startPoint: null,
    activeLine: null,
    measurement: null
  });
  
  const [currentMeasurement, setCurrentMeasurement] = useState<MeasurementData | null>(null);
  
  // Cleanup function for when component unmounts or tool is disabled
  const cleanup = useCallback(() => {
    const { activeLine } = lineMetaRef.current;
    
    if (canvas && activeLine && canvas.contains(activeLine)) {
      canvas.remove(activeLine);
      canvas.requestRenderAll();
    }
    
    lineMetaRef.current.isDrawing = false;
    lineMetaRef.current.startPoint = null;
    lineMetaRef.current.activeLine = null;
    lineMetaRef.current.measurement = null;
    setCurrentMeasurement(null);
  }, [canvas]);

  // Clean up when component unmounts or when canvas changes
  useEffect(() => {
    return cleanup;
  }, [canvas, cleanup]);

  // Start drawing a line from the given point
  const startDrawing = useCallback((point: Point) => {
    if (!canvas || !enabled) return;
    
    cleanup();
    
    lineMetaRef.current.isDrawing = true;
    lineMetaRef.current.startPoint = { x: point.x, y: point.y };
    
    try {
      // Create new line
      const fabricCanvas = canvas;
      const line = new fabric.Line([point.x, point.y, point.x, point.y], {
        stroke: color,
        strokeWidth: thickness,
        selectable: false,
        evented: false,
        originX: 'center',
        originY: 'center'
      });
      
      fabricCanvas.add(line);
      lineMetaRef.current.activeLine = line;
      
      // Initialize measurement
      const initialMeasurement: MeasurementData = {
        distance: 0,
        angle: 0,
        snapped: false,
        unit: 'px',
        startPoint: { x: point.x, y: point.y },
        endPoint: { x: point.x, y: point.y }
      };
      
      lineMetaRef.current.measurement = initialMeasurement;
      setCurrentMeasurement(initialMeasurement);
      
      if (onMeasurementChange) {
        onMeasurementChange(initialMeasurement);
      }
    } catch (error) {
      console.error('Error creating line:', error);
      cleanup();
    }
  }, [canvas, enabled, color, thickness, cleanup, onMeasurementChange]);

  // Update the line while drawing
  const continueDrawing = useCallback((point: Point) => {
    if (!canvas || !enabled || !lineMetaRef.current.isDrawing || !lineMetaRef.current.startPoint || !lineMetaRef.current.activeLine) {
      return;
    }
    
    const startPoint = lineMetaRef.current.startPoint;
    const line = lineMetaRef.current.activeLine;
    
    if (!line) return;
    
    let endPoint = { ...point };
    let isSnapped = false;
    
    // Apply snapping if enabled
    if (snapToGrid || snapAngle) {
      // Calculate angle in degrees
      const deltaX = point.x - startPoint.x;
      const deltaY = point.y - startPoint.y;
      let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      
      if (snapAngle) {
        // Snap to nearest multiple of snapAngle
        const snappedAngle = Math.round(angle / snapAngle) * snapAngle;
        
        // Only snap if we're close to a snap point
        const angleDifference = Math.abs(angle - snappedAngle);
        if (angleDifference < 10) { // Snap within 10 degrees
          angle = snappedAngle;
          isSnapped = true;
        }
        
        // Calculate new endpoint based on snapped angle and original distance
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const radians = angle * (Math.PI / 180);
        
        endPoint = {
          x: startPoint.x + distance * Math.cos(radians),
          y: startPoint.y + distance * Math.sin(radians)
        };
      }
    }
    
    // Update line coordinates
    const lineObj = line as unknown as fabric.Line;
    lineObj.set({
      x2: endPoint.x,
      y2: endPoint.y
    });
    
    canvas.requestRenderAll();
    
    // Update measurement
    const distance = Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) + 
      Math.pow(endPoint.y - startPoint.y, 2)
    );
    
    const angle = Math.atan2(
      endPoint.y - startPoint.y,
      endPoint.x - startPoint.x
    ) * (180 / Math.PI);
    
    const measurement: MeasurementData = {
      distance: Math.round(distance * 100) / 100,
      angle: Math.round(angle * 10) / 10,
      snapped: isSnapped,
      unit: 'px',
      startPoint,
      endPoint,
      snapType: isSnapped ? 'angle' : undefined
    };
    
    lineMetaRef.current.measurement = measurement;
    setCurrentMeasurement(measurement);
    
    if (onMeasurementChange) {
      onMeasurementChange(measurement);
    }
  }, [canvas, enabled, snapToGrid, snapAngle, onMeasurementChange]);

  // Complete the drawing
  const finishDrawing = useCallback(() => {
    if (!canvas || !enabled || !lineMetaRef.current.isDrawing || !lineMetaRef.current.activeLine) {
      return;
    }
    
    const line = lineMetaRef.current.activeLine;
    
    // Make line selectable
    line.set({
      selectable: true,
      evented: true
    });
    
    canvas.requestRenderAll();
    
    // Notify about line creation
    if (onLineCreated) {
      onLineCreated(line);
    }
    
    // Reset drawing state but keep the line
    lineMetaRef.current.isDrawing = false;
    lineMetaRef.current.activeLine = null;
  }, [canvas, enabled, onLineCreated]);

  // Cancel the current drawing
  const cancelDrawing = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return {
    isEnabled: enabled,
    startDrawing,
    continueDrawing,
    finishDrawing,
    cancelDrawing,
    currentMeasurement
  };
};

// Add Fabric.js event types to help with typings
export interface FabricCanvasMouseEvent {
  e: MouseEvent;
  target?: FabricObject;
  pointer: Point;
  absolutePointer: Point;
}

export interface FabricCanvasObjectEvent {
  target: FabricObject;
  e?: Event;
}
