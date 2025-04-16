
import { useState, useCallback } from 'react';
import { Point } from '@/types/core/Point';
import { Line, Text } from 'fabric';
import { useSnapToGrid } from '../useSnapToGrid';

/**
 * Hook for managing the state of line drawing
 */
export const useLineDrawingState = ({
  snapEnabled: initialSnapEnabled = true,
  anglesEnabled: initialAnglesEnabled = true
} = {}) => {
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isToolInitialized, setIsToolInitialized] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [distanceTooltip, setDistanceTooltip] = useState<Text | null>(null);
  
  // Grid snapping state
  const [snapEnabled, setSnapEnabled] = useState(initialSnapEnabled);
  const [anglesEnabled, setAnglesEnabled] = useState(initialAnglesEnabled);
  
  // Use the snap to grid hook
  const { snapPointToGrid } = useSnapToGrid({
    initialSnapEnabled: snapEnabled
  });
  
  // Toggle snap to grid
  const toggleSnap = useCallback(() => {
    setSnapEnabled(prev => !prev);
  }, []);
  
  // Toggle angle constraints
  const toggleAngles = useCallback(() => {
    setAnglesEnabled(prev => !prev);
  }, []);
  
  // Initialize the tool
  const initializeTool = useCallback(() => {
    setIsToolInitialized(true);
  }, []);
  
  // Reset drawing state
  const resetDrawingState = useCallback(() => {
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoint(null);
    setCurrentLine(null);
    setDistanceTooltip(null);
  }, []);

  return {
    // State
    isDrawing,
    isActive,
    isToolInitialized,
    startPoint,
    currentPoint,
    currentLine,
    distanceTooltip,
    snapEnabled,
    anglesEnabled,
    
    // Setters
    setIsDrawing,
    setIsActive,
    setStartPoint,
    setCurrentPoint,
    setCurrentLine,
    setDistanceTooltip,
    
    // Functions
    snapPointToGrid,
    toggleSnap,
    toggleAngles,
    initializeTool,
    resetDrawingState
  };
};
