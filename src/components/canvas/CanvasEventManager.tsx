
import React, { useEffect } from 'react';
import { useDrawingContext } from '@/contexts/DrawingContext';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Canvas Event Manager Component
 * Manages event handlers for canvas interactions
 */
interface CanvasEventManagerProps {
  children: React.ReactNode;
}

export const CanvasEventManager: React.FC<CanvasEventManagerProps> = ({ children }) => {
  const { 
    canvas, 
    tool, 
    setTool,
    addToUndoStack,
    undo,
    redo
  } = useDrawingContext();
  
  // Setup keyboard event handlers
  useEffect(() => {
    if (!canvas) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle undo/redo with keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault();
        redo();
      }
      
      // Handle tool switching with keyboard shortcuts
      switch (e.key) {
        case 'v':
        case 's':
          setTool(DrawingMode.SELECT);
          break;
        case 'p':
        case 'd':
          setTool(DrawingMode.DRAW);
          break;
        case 'r':
          setTool(DrawingMode.RECT);
          break;
        case 'c':
          setTool(DrawingMode.CIRCLE);
          break;
        case 'l':
          setTool(DrawingMode.LINE);
          break;
        case 'L':
          setTool(DrawingMode.STRAIGHT_LINE);
          break;
        case 'w':
          setTool(DrawingMode.WALL);
          break;
        case 'e':
          setTool(DrawingMode.ERASER);
          break;
        case 'h':
          setTool(DrawingMode.HAND);
          break;
        case 'Escape':
          // Deselect all and reset to select tool
          canvas.discardActiveObject();
          canvas.renderAll();
          setTool(DrawingMode.SELECT);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, setTool, undo, redo]);
  
  // Setup canvas event handlers
  useEffect(() => {
    if (!canvas) return;
    
    // Save state when objects are modified
    const handleObjectModified = () => {
      addToUndoStack(canvas.toJSON());
    };
    
    canvas.on('object:modified', handleObjectModified);
    
    return () => {
      canvas.off('object:modified', handleObjectModified);
    };
  }, [canvas, addToUndoStack]);
  
  return <>{children}</>;
};

export default CanvasEventManager;
