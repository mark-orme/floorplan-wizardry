
import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import logger from '@/utils/logger';
import { Point } from '@/types/core/Point';
import { useLineState } from './useLineState';
import { useLineEvents } from './useLineEvents';
import { calculateDistance, calculateAngle } from '@/utils/geometry/lineOperations';
import { InputMethod } from '@/types/input/InputMethod';
import { MeasurementData } from '@/types/measurement/MeasurementData';
import { snapToGrid } from '@/utils/geometry/pointOperations';

interface StraightLineToolProps {
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
}: StraightLineToolProps) => {
  // Initialize the line state
  const lineState = useLineState({ 
    fabricCanvasRef: { current: canvas }, 
    lineColor, 
    lineThickness,
    saveCurrentState 
  });
  
  // Track input method
  const [inputMethod, setInputMethod] = useState<InputMethod>(InputMethod.MOUSE);
  const [isPencilMode, setIsPencilMode] = useState(false);
  
  // Snap and angle settings
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  
  // Line measurement data
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    distance: null,
    angle: null,
    unit: 'px'
  });
  
  // Visual aids refs
  const ghostLineRef = useRef<Line | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const snapIndicatorRef = useRef<any | null>(null);
  
  // Setup event handlers with the line state
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleKeyDown,
    cancelDrawing
  } = useLineEvents({
    canvas,
    lineState,
    snapEnabled,
    anglesEnabled,
    updateMeasurementData: (data: MeasurementData) => setMeasurementData(data)
  });
  
  // Detect Apple Pencil and other input methods
  const detectInputMethod = useCallback((e: PointerEvent) => {
    const isPen = e.pointerType === 'pen';
    setIsPencilMode(isPen);
    setInputMethod(isPen ? InputMethod.PENCIL : (e.pointerType === 'touch' ? InputMethod.TOUCH : InputMethod.MOUSE));
    
    // Log input method for debugging
    if (isPen) {
      logger.info('Apple Pencil or stylus detected', {
        pointerType: e.pointerType,
        pressure: e.pressure,
        tiltX: e.tiltX,
        tiltY: e.tiltY
      });
    }
  }, []);
  
  // Create ghost preview line
  const createGhostLine = useCallback((point: Point) => {
    if (!canvas || !lineState.isActive) return;
    
    // Remove any existing ghost line
    if (ghostLineRef.current) {
      canvas.remove(ghostLineRef.current);
    }
    
    // Create new ghost line
    ghostLineRef.current = new Line([point.x, point.y, point.x, point.y], {
      stroke: lineColor,
      strokeWidth: lineThickness * 0.5,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      opacity: 0.5
    });
    
    canvas.add(ghostLineRef.current);
    canvas.renderAll();
  }, [canvas, lineState.isActive, lineColor, lineThickness]);
  
  // Update ghost line as cursor moves
  const updateGhostLine = useCallback((startPoint: Point, endPoint: Point) => {
    if (!canvas || !ghostLineRef.current) return;
    
    ghostLineRef.current.set({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: endPoint.x,
      y2: endPoint.y
    });
    
    canvas.renderAll();
  }, [canvas]);
  
  // Create drawing tooltip
  const createTooltip = useCallback(() => {
    if (tooltipRef.current) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded pointer-events-none z-50 flex flex-col shadow-md';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
    tooltipRef.current = tooltip;
  }, []);
  
  // Update tooltip with measurement data
  const updateTooltip = useCallback((point: Point, data: MeasurementData) => {
    if (!tooltipRef.current || !canvas) return;
    
    const { distance, angle, snapped } = data;
    const zoom = canvas.getZoom();
    const offset = canvas.calcOffset();
    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    
    // Position tooltip relative to canvas and pointer
    const tooltipX = rect.left + (point.x * zoom) + offset.left + 10;
    const tooltipY = rect.top + (point.y * zoom) + offset.top - 30;
    
    tooltipRef.current.style.left = `${tooltipX}px`;
    tooltipRef.current.style.top = `${tooltipY}px`;
    tooltipRef.current.style.display = 'flex';
    
    // Update tooltip content
    let content = '';
    
    if (distance !== null) {
      content += `Length: ${Math.round(distance)}px`;
    }
    
    if (angle !== null) {
      content += `<br>Angle: ${Math.round(angle)}°`;
    }
    
    if (snapped) {
      content += `<br><span class="text-green-400">Snapped</span>`;
    }
    
    tooltipRef.current.innerHTML = content;
  }, [canvas]);
  
  // Hide tooltip
  const hideTooltip = useCallback(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = 'none';
    }
  }, []);
  
  // Create snap indicator
  const createSnapIndicator = useCallback((point: Point) => {
    if (!canvas) return;
    
    // Remove existing indicator
    if (snapIndicatorRef.current) {
      canvas.remove(snapIndicatorRef.current);
    }
    
    // Create new indicator (e.g., a circle at snap point)
    // Implementation details would depend on your specific UI design
  }, [canvas]);
  
  // Toggle snap to grid
  const toggleGridSnapping = useCallback(() => {
    setSnapEnabled(prev => !prev);
    logger.info(`Grid snapping ${snapEnabled ? 'disabled' : 'enabled'}`);
  }, [snapEnabled]);
  
  // Toggle angle constraints
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
    logger.info(`Angle constraints ${anglesEnabled ? 'disabled' : 'enabled'}`);
  }, [anglesEnabled]);
  
  // Attach event listeners when the tool is activated
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    logger.info('Activating straight line tool');
    
    // Set up canvas for drawing
    canvas.isDrawingMode = false;
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';
    
    // Set up ghost line and tooltip
    createGhostLine({ x: 0, y: 0 });
    createTooltip();
    
    // Attach event listeners
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);
    
    // Attach pointer events for input detection
    const canvasElement = canvas.getElement();
    canvasElement.addEventListener('pointerdown', detectInputMethod);
    
    // Attach keyboard events for esc to cancel
    document.addEventListener('keydown', handleKeyDown);
    
    // Enable object selection on all canvas objects
    canvas.getObjects().forEach(obj => {
      obj.selectable = false;
    });
    
    return () => {
      // Clean up when tool is deactivated
      logger.info('Deactivating straight line tool');
      
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
      
      canvasElement.removeEventListener('pointerdown', detectInputMethod);
      document.removeEventListener('keydown', handleKeyDown);
      
      // Remove visual aids
      if (ghostLineRef.current) {
        canvas.remove(ghostLineRef.current);
        ghostLineRef.current = null;
      }
      
      if (tooltipRef.current) {
        tooltipRef.current.remove();
        tooltipRef.current = null;
      }
      
      if (snapIndicatorRef.current) {
        canvas.remove(snapIndicatorRef.current);
        snapIndicatorRef.current = null;
      }
      
      // Restore object selectability
      canvas.getObjects().forEach(obj => {
        obj.selectable = true;
      });
      
      canvas.defaultCursor = 'default';
      canvas.renderAll();
    };
  }, [
    canvas, 
    enabled, 
    handleMouseDown, 
    handleMouseMove, 
    handleMouseUp, 
    handleKeyDown,
    detectInputMethod,
    createGhostLine,
    createTooltip
  ]);
  
  // Update ghost line during mouse moves
  useEffect(() => {
    if (!canvas || !lineState.isActive || !lineState.currentPoint) return;
    
    const startPoint = lineState.startPoint || lineState.currentPoint;
    updateGhostLine(startPoint, lineState.currentPoint);
    
    // Update measurement data while drawing
    if (lineState.startPoint && lineState.currentPoint) {
      const distance = calculateDistance(lineState.startPoint, lineState.currentPoint);
      const angle = calculateAngle(lineState.startPoint, lineState.currentPoint);
      
      // Check if point is snapped to grid
      const snappedPoint = snapToGrid(lineState.currentPoint);
      const isSnapped = Math.abs(snappedPoint.x - lineState.currentPoint.x) < 0.1 && 
                        Math.abs(snappedPoint.y - lineState.currentPoint.y) < 0.1;
      
      const data: MeasurementData = {
        distance,
        angle,
        snapped: isSnapped,
        unit: 'px'
      };
      
      setMeasurementData(data);
      updateTooltip(lineState.currentPoint, data);
    }
  }, [
    canvas, 
    lineState.isActive, 
    lineState.startPoint, 
    lineState.currentPoint,
    updateGhostLine,
    updateTooltip
  ]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (tooltipRef.current) {
        tooltipRef.current.remove();
      }
    };
  }, []);
  
  return {
    isEnabled: enabled,
    isActive: lineState.isActive,
    isDrawing: lineState.isDrawing,
    currentLine: lineState.currentLine,
    inputMethod,
    isPencilMode,
    snapEnabled,
    anglesEnabled,
    measurementData,
    toggleGridSnapping,
    toggleAngles,
    cancelDrawing
  };
};
