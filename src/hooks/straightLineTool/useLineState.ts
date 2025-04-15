
/**
 * Hook for managing line drawing state
 * @module hooks/straightLineTool/useLineState
 */
import { useCallback, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';
import { useApplePencilSupport } from './useApplePencilSupport';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { toast } from 'sonner';
import { 
  snapPointToGridPrecise, 
  snapLineToPreciseGrid, 
  snapLineToStandardAngles,
  formatMeasurementData
} from '@/utils/grid/enhancedSnapping';

// Input method for drawing - changed to include all possible values
export type InputMethod = 'mouse' | 'touch' | 'pencil' | 'stylus' | 'keyboard';

interface UseLineStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineThickness?: number;
  lineColor?: string;
  snapPointToGrid?: (point: Point) => Point;
  snapLineToGrid?: (start: Point, end: Point) => { start: Point, end: Point };
  isToolActive?: boolean;
}

export const useLineState = ({
  fabricCanvasRef,
  lineThickness,
  lineColor,
  snapPointToGrid,
  snapLineToGrid,
  isToolActive
}: UseLineStateProps) => {
  // State for drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [inputMethod, setInputMethod] = useState<InputMethod>('mouse');
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [anglesEnabled, setAnglesEnabled] = useState(true);
  const [measurementData, setMeasurementData] = useState<any>(null);
  
  // Refs for current drawing objects
  const startPointRef = useRef<Point | null>(null);
  const currentLineRef = useRef<Line | null>(null);
  const distanceTooltipRef = useRef<HTMLDivElement | null>(null);
  
  // Use Apple Pencil support
  const { 
    isPencilMode, 
    isApplePencil, 
    snapPencilPointToGrid 
  } = useApplePencilSupport({
    fabricCanvasRef,
    lineThickness: lineThickness || 2
  });
  
  // Function to set start point
  const setStartPoint = useCallback((point: Point | null) => {
    startPointRef.current = point;
  }, []);
  
  // Function to set current line
  const setCurrentLine = useCallback((line: Line | null) => {
    currentLineRef.current = line;
  }, []);
  
  // Function to set distance tooltip
  const setDistanceTooltip = useCallback((tooltip: HTMLDivElement | null) => {
    distanceTooltipRef.current = tooltip;
  }, []);
  
  // Function to initialize the tool
  const initializeTool = useCallback(() => {
    setIsToolInitialized(true);
    console.log('Line tool initialized with enhanced precision');
    
    // Check for touch/stylus support
    if (navigator.maxTouchPoints > 0) {
      setInputMethod('touch');
      console.log('Touch input detected, optimizing for touch');
    }
    
    toast.info(snapEnabled ? 'Precise grid snapping enabled (0.1m increments)' : 'Grid snapping disabled (press G to toggle)', {
      id: 'grid-snap-status',
      duration: 3000
    });
    
    toast.info(anglesEnabled ? 'Angle snapping enabled (press A to toggle)' : 'Angle snapping disabled (press A to toggle)', {
      id: 'angle-snap-status',
      duration: 3000
    });
  }, [snapEnabled, anglesEnabled]);
  
  // Function to reset drawing state
  const resetDrawingState = useCallback(() => {
    // Keep start point for reference
    currentLineRef.current = null;
    
    // Clean up tooltip if exists
    if (distanceTooltipRef.current) {
      const parent = distanceTooltipRef.current.parentElement;
      if (parent) {
        parent.removeChild(distanceTooltipRef.current);
      }
      distanceTooltipRef.current = null;
    }
    
    // Reset measurement data
    setMeasurementData(null);
  }, []);
  
  // Toggle snap to grid
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
    
    // Show feedback to user
    toast.info(!snapEnabled ? 'Grid snapping enabled (0.1m increments)' : 'Grid snapping disabled', {
      id: 'grid-snap-toggle'
    });
  }, [snapEnabled]);
  
  // Toggle angle constraints
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
    
    // Show feedback to user
    toast.info(!anglesEnabled ? 'Angle snapping enabled' : 'Angle snapping disabled', {
      id: 'angle-snap-toggle'
    });
  }, [anglesEnabled]);
  
  // Function to snap point to grid
  const handleSnapPointToGrid = useCallback((point: Point): Point => {
    if (!snapEnabled) return { ...point };
    
    // For Apple Pencil, use specialized snap function
    if (isPencilMode) {
      return snapPencilPointToGrid(point);
    }
    
    // Use enhanced precision snapping by default
    return snapPointToGridPrecise(point);
  }, [snapEnabled, isPencilMode, snapPencilPointToGrid]);
  
  // Function to snap line to grid
  const handleSnapLineToGrid = useCallback((start: Point, end: Point) => {
    if (!snapEnabled) return { start: { ...start }, end: { ...end } };
    
    // Get basic grid-snapped points
    const gridSnapped = snapLineToPreciseGrid(start, end);
    
    // Add angle snapping if enabled
    if (anglesEnabled) {
      return {
        start: gridSnapped.start,
        end: snapLineToStandardAngles(gridSnapped.start, gridSnapped.end)
      };
    }
    
    return gridSnapped;
  }, [snapEnabled, anglesEnabled]);
  
  // Calculate and update measurement data
  const updateMeasurementData = useCallback((start: Point, end: Point) => {
    if (start && end) {
      const data = formatMeasurementData(start, end);
      setMeasurementData(data);
    } else {
      setMeasurementData(null);
    }
  }, []);
  
  return {
    // State
    isDrawing,
    isToolInitialized,
    snapEnabled,
    anglesEnabled,
    inputMethod,
    isPencilMode,
    measurementData,
    
    // Setters
    setIsDrawing,
    setStartPoint,
    setCurrentLine,
    setDistanceTooltip,
    setIsToolInitialized,
    
    // Refs
    startPointRef,
    currentLineRef,
    distanceTooltipRef,
    
    // Methods
    initializeTool,
    resetDrawingState,
    snapPointToGrid: handleSnapPointToGrid,
    snapLineToGrid: handleSnapLineToGrid,
    toggleSnap,
    toggleAngles,
    updateMeasurementData
  };
};
