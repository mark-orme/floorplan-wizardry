
import React, { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useDrawingContext } from '@/contexts/DrawingContext';
import logger from '@/utils/logger';

interface CanvasEventManagerProps {
  canvas: FabricCanvas | null;
  onSelectionChanged?: (objects: any[]) => void;
  onModified?: () => void;
  onHistoryChange?: () => void;
}

/**
 * Manages canvas events and coordinates with the drawing context
 */
export const CanvasEventManager: React.FC<CanvasEventManagerProps> = ({
  canvas,
  onSelectionChanged,
  onModified,
  onHistoryChange
}) => {
  const { 
    addToHistory, 
    undo, 
    redo, 
    activeTool, 
    setActiveTool 
  } = useDrawingContext();
  
  // Handle keyboard shortcuts
  useEffect(() => {
    if (!canvas) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if target is input, textarea, etc.
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
        if (onHistoryChange) onHistoryChange();
        return;
      }
      
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey && e.key === 'y') || 
          (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
        if (onHistoryChange) onHistoryChange();
        return;
      }
      
      // Tool shortcuts
      switch (e.key) {
        case 'v':
          logger.info('Switching to Select tool');
          setActiveTool(DrawingMode.SELECT);
          break;
        case 'p':
          logger.info('Switching to Draw tool');
          setActiveTool(DrawingMode.DRAW);
          break;
        case 'l':
          logger.info('Switching to Line tool');
          setActiveTool(DrawingMode.STRAIGHT_LINE);
          break;
        case 'w':
          logger.info('Switching to Wall tool');
          setActiveTool(DrawingMode.WALL);
          break;
        case 'e':
          logger.info('Switching to Eraser tool');
          setActiveTool(DrawingMode.ERASER);
          break;
        case 'h':
          logger.info('Switching to Hand tool');
          setActiveTool(DrawingMode.HAND);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, undo, redo, setActiveTool, onHistoryChange]);
  
  // Handle object modifications and update history
  useEffect(() => {
    if (!canvas) return;
    
    const handleObjectModified = () => {
      addToHistory();
      if (onModified) onModified();
    };
    
    const handleSelectionUpdated = () => {
      const selectedObjects = canvas.getActiveObjects();
      if (onSelectionChanged) onSelectionChanged(selectedObjects);
    };
    
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:created', handleSelectionUpdated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionUpdated);
    
    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:created', handleSelectionUpdated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionUpdated);
    };
  }, [canvas, addToHistory, onModified, onSelectionChanged]);
  
  return null;
};
