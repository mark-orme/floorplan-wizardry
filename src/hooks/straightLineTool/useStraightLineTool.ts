import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { Point } from '@/types/core/Point';
import { useLineDrawing } from './useLineDrawing';
import { useLineEvents } from './useStraightLineEvents';
import { UseStraightLineToolProps } from './useStraightLineTool.d';
import { useLinePreview } from './useLinePreview';
import { useMeasurementUpdates } from './useMeasurementUpdates';
import { MeasurementData } from './types';

// Add this type definition at the top of the file
type FabricCanvasMouseEvent = {
  e: MouseEvent;
};

export const useStraightLineTool = ({
  isActive = false,
  isEnabled = false,
  canvas,
  lineColor = 'black',
  lineThickness = 5,
  saveCurrentState,
}: UseStraightLineToolProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  const [measurementData, setMeasurementData] = useState<MeasurementData | null>(null);
  const lineRef = useRef<Line | null>(null);
  const tooltipRef = useRef<Text | null>(null);
  
  const fabricCanvasRef = useRef<FabricCanvas | null>(canvas || null);
  useEffect(() => {
    fabricCanvasRef.current = canvas || null;
  }, [canvas]);
  
  const {
    createLine,
    updateLine,
    createOrUpdateTooltip,
    finalizeLine,
    removeLine
  } = useLineDrawing(fabricCanvasRef, lineColor, lineThickness, saveCurrentState || (() => {}));
  
  const { renderLinePreview } = useLinePreview(fabricCanvasRef, lineColor, lineThickness);
  
  const { renderTooltip } = useMeasurementUpdates(
    fabricCanvasRef,
    tooltipRef,
    measurementData
  );
  
  /**
   * Start drawing
   */
  const startDrawing = useCallback((point: Point) => {
    setIsDrawing(true);
    
    // Create line
    const { x, y } = point;
    const line = createLine(x, y);
    lineRef.current = line;
    
    // Disable selection
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.selection = false;
    }
  }, [createLine]);
  
  /**
   * Continue drawing
   */
  const continueDrawing = useCallback((point: Point) => {
    if (!isDrawing || !lineRef.current) return;
    
    // Update line and get measurements
    const { x: startX, y: startY } = {
      x: lineRef.current.x1 || 0,
      y: lineRef.current.y1 || 0
    };
    
    const measurements = updateLine(lineRef.current, startX, startY, point.x, point.y);
    if (!measurements) return;
    
    setMeasurementData(measurements);
    
    // Update tooltip
    const { distance } = measurements;
    const { x: endX, y: endY } = { x: point.x, y: point.y };
    const text = `${distance.toFixed(2)}px`;
    
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2 - 10;
    
    createOrUpdateTooltip(tooltipRef, text, midX, midY);
    
    // Request render
    fabricCanvasRef.current?.requestRenderAll();
  }, [isDrawing, updateLine, createOrUpdateTooltip]);
  
  /**
   * Complete drawing
   */
  const completeDrawing = useCallback((point: Point) => {
    setIsDrawing(false);
    
    if (!lineRef.current) return;
    
    // Finalize line
    finalizeLine(lineRef.current);
    
    // Reset selection
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.selection = true;
    }
    
    // Clear
    lineRef.current = null;
    tooltipRef.current = null;
    setMeasurementData(null);
  }, [finalizeLine]);
  
  /**
   * Cancel drawing
   */
  const cancelDrawing = useCallback(() => {
    setIsDrawing(false);
    
    if (!lineRef.current) return;
    
    // Remove line
    removeLine(lineRef.current);
    
    // Reset selection
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.selection = true;
    }
    
    // Clear
    lineRef.current = null;
    tooltipRef.current = null;
    setMeasurementData(null);
  }, [removeLine]);
  
  /**
   * Toggle snap
   */
  const toggleSnap = useCallback(() => {
    setSnapEnabled(!snapEnabled);
  }, [snapEnabled]);
  
  /**
   * Toggle angles
   */
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(!anglesEnabled);
  }, [anglesEnabled]);

  // Modify the handleMouseDown function to use the new type
  const handleMouseDown = useCallback((event: FabricCanvasMouseEvent) => {
    if (!fabricCanvasRef.current || !isActive || !event.e) return;
    
    const pointer = fabricCanvasRef.current.getPointer(event.e);
    const point = { x: pointer.x, y: pointer.y };
    
    startDrawing(point);
  }, [fabricCanvasRef, isActive, startDrawing]);
  
  /**
   * Handle mouse move event
   */
  const handleMouseMove = useCallback((event: FabricCanvasMouseEvent) => {
    if (!fabricCanvasRef.current || !isActive || !isDrawing || !event.e) return;
    
    // Prevent default behavior
    if (event.e && event.e.preventDefault) {
      event.e.preventDefault();
    }
    
    // Get pointer coordinates
    const pointer = fabricCanvasRef.current.getPointer(event.e);
    const point = { x: pointer.x, y: pointer.y };
    
    // Continue drawing
    continueDrawing(point);
  }, [fabricCanvasRef, isActive, isDrawing, continueDrawing]);
  
  /**
   * Handle mouse up event
   */
  const handleMouseUp = useCallback((event: FabricCanvasMouseEvent) => {
    if (!fabricCanvasRef.current || !isActive || !isDrawing || !event.e) return;
    
    // Prevent default behavior
    if (event.e && event.e.preventDefault) {
      event.e.preventDefault();
    }
    
    // Get pointer coordinates
    const pointer = fabricCanvasRef.current.getPointer(event.e);
    const point = { x: pointer.x, y: pointer.y };
    
    // Complete drawing
    completeDrawing(point);
  }, [fabricCanvasRef, isActive, isDrawing, completeDrawing]);
  
  /**
   * Handle keyboard events (Escape to cancel)
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isDrawing) {
      cancelDrawing();
    }
  }, [isDrawing, cancelDrawing]);
  
  /**
   * Set up event listeners when component mounts
   */
  useEffect(() => {
    if (!fabricCanvasRef.current || !isActive) return;
    
    // Add event listeners
    fabricCanvasRef.current.on('mouse:down', handleMouseDown);
    fabricCanvasRef.current.on('mouse:move', handleMouseMove);
    fabricCanvasRef.current.on('mouse:up', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      // Clean up event listeners
      fabricCanvasRef.current?.off('mouse:down', handleMouseDown);
      fabricCanvasRef.current?.off('mouse:move', handleMouseMove);
      fabricCanvasRef.current?.off('mouse:up', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    fabricCanvasRef,
    isActive,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown
  ]);

  return {
    isEnabled,
    isDrawing,
    snapEnabled,
    anglesEnabled,
    measurementData,
    toggleSnap,
    toggleAngles,
    startDrawing,
    continueDrawing,
    completeDrawing,
    cancelDrawing,
    renderTooltip
  };
};
