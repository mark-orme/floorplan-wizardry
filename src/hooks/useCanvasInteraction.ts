
import { useRef, useState, useCallback } from 'react';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

export interface CanvasInteractionOptions {
  canvas: Canvas | null;
  activeTool: DrawingMode;
  gridSize?: number;
  snapToGrid?: boolean;
}

export const useCanvasInteraction = ({
  canvas,
  activeTool,
  gridSize = 20,
  snapToGrid = false
}: CanvasInteractionOptions) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const currentObjectRef = useRef<any>(null);

  // Initialize event handlers
  const initializeInteractions = useCallback(() => {
    if (!canvas) return;

    // Clean up previous listeners
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    canvas.off('selection:created');
    canvas.off('selection:updated');
    canvas.off('selection:cleared');

    // Set up appropriate event handlers based on active tool
    switch (activeTool) {
      case DrawingMode.SELECT:
        setupSelectionTool();
        break;
      case DrawingMode.DRAW:
      case DrawingMode.PENCIL:
        setupDrawingTool();
        break;
      case DrawingMode.STRAIGHT_LINE:
      case DrawingMode.LINE:
        setupLineTool();
        break;
      case DrawingMode.RECTANGLE:
        setupRectangleTool();
        break;
      case DrawingMode.CIRCLE:
        setupCircleTool();
        break;
      case DrawingMode.WALL:
        setupWallTool();
        break;
      case DrawingMode.ERASER:
      case DrawingMode.ERASE:
        setupEraserTool();
        break;
      case DrawingMode.PAN:
      case DrawingMode.HAND:
        setupPanTool();
        break;
      default:
        setupSelectionTool(); // Default to selection tool
    }
  }, [canvas, activeTool, gridSize, snapToGrid]);

  // Tool setup functions
  const setupSelectionTool = useCallback(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = false;
    canvas.selection = true;

    canvas.on('mouse:down', (e: any) => {
      if (!e.target) {
        // Clicked on empty canvas
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    });
    
    canvas.on('selection:created', (e: any) => {
      console.log('Object selected:', e.selected);
    });
    
    canvas.on('selection:updated', (e: any) => {
      console.log('Selection updated:', e.selected);
    });
    
    canvas.on('selection:cleared', () => {
      console.log('Selection cleared');
    });
  }, [canvas]);

  const setupDrawingTool = useCallback(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = '#000000';
    canvas.selection = false;
  }, [canvas]);

  const setupLineTool = useCallback(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    canvas.on('mouse:down', (e: any) => {
      if (e.target) return; // Don't start drawing if clicking on an object
      
      const pointer = canvas.getPointer(e.e);
      startPointRef.current = pointer;
      setIsDrawing(true);
      
      // Create line
      const line = new fabric.Line(
        [pointer.x, pointer.y, pointer.x, pointer.y],
        {
          strokeWidth: 2,
          stroke: '#000000',
          selectable: false
        }
      );
      
      canvas.add(line);
      currentObjectRef.current = line;
      canvas.requestRenderAll();
    });
    
    canvas.on('mouse:move', (e: any) => {
      if (!isDrawing || !startPointRef.current || !currentObjectRef.current) return;
      
      const pointer = canvas.getPointer(e.e);
      const line = currentObjectRef.current;
      
      // Update line end point
      line.set({
        x2: pointer.x,
        y2: pointer.y
      });
      
      canvas.requestRenderAll();
    });
    
    canvas.on('mouse:up', () => {
      if (!isDrawing || !currentObjectRef.current) return;
      
      const line = currentObjectRef.current;
      line.setCoords();
      line.selectable = true;
      
      setIsDrawing(false);
      startPointRef.current = null;
      currentObjectRef.current = null;
      canvas.requestRenderAll();
    });
  }, [canvas, isDrawing]);

  const setupRectangleTool = useCallback(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    canvas.on('mouse:down', (e: any) => {
      if (e.target) return; // Don't start drawing if clicking on an object
      
      const pointer = canvas.getPointer(e.e);
      startPointRef.current = pointer;
      setIsDrawing(true);
      
      // Create rectangle
      const rect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        stroke: '#000000',
        strokeWidth: 2,
        fill: 'transparent',
        selectable: false
      });
      
      canvas.add(rect);
      currentObjectRef.current = rect;
      canvas.requestRenderAll();
    });
    
    canvas.on('mouse:move', (e: any) => {
      if (!isDrawing || !startPointRef.current || !currentObjectRef.current) return;
      
      const pointer = canvas.getPointer(e.e);
      const rect = currentObjectRef.current;
      
      if (startPointRef.current.x > pointer.x) {
        rect.set('left', pointer.x);
      }
      
      if (startPointRef.current.y > pointer.y) {
        rect.set('top', pointer.y);
      }
      
      rect.set({
        width: Math.abs(pointer.x - startPointRef.current.x),
        height: Math.abs(pointer.y - startPointRef.current.y)
      });
      
      canvas.requestRenderAll();
    });
    
    canvas.on('mouse:up', () => {
      if (!isDrawing || !currentObjectRef.current) return;
      
      const rect = currentObjectRef.current;
      rect.setCoords();
      rect.selectable = true;
      
      setIsDrawing(false);
      startPointRef.current = null;
      currentObjectRef.current = null;
      canvas.requestRenderAll();
    });
  }, [canvas, isDrawing]);

  const setupCircleTool = useCallback(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    canvas.on('mouse:down', (e: any) => {
      if (e.target) return; // Don't start drawing if clicking on an object
      
      const pointer = canvas.getPointer(e.e);
      startPointRef.current = pointer;
      setIsDrawing(true);
      
      // Create circle
      const circle = new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 0,
        stroke: '#000000',
        strokeWidth: 2,
        fill: 'transparent',
        selectable: false
      });
      
      canvas.add(circle);
      currentObjectRef.current = circle;
      canvas.requestRenderAll();
    });
    
    canvas.on('mouse:move', (e: any) => {
      if (!isDrawing || !startPointRef.current || !currentObjectRef.current) return;
      
      const pointer = canvas.getPointer(e.e);
      const circle = currentObjectRef.current;
      
      const dx = pointer.x - startPointRef.current.x;
      const dy = pointer.y - startPointRef.current.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      
      circle.set({
        radius: radius / 2,
        left: startPointRef.current.x - radius / 2,
        top: startPointRef.current.y - radius / 2
      });
      
      canvas.requestRenderAll();
    });
    
    canvas.on('mouse:up', () => {
      if (!isDrawing || !currentObjectRef.current) return;
      
      const circle = currentObjectRef.current;
      circle.setCoords();
      circle.selectable = true;
      
      setIsDrawing(false);
      startPointRef.current = null;
      currentObjectRef.current = null;
      canvas.requestRenderAll();
    });
  }, [canvas, isDrawing]);

  const setupWallTool = useCallback(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    canvas.on('mouse:down', (e: any) => {
      if (e.target) return; // Don't start drawing if clicking on an object
      
      const pointer = canvas.getPointer(e.e);
      startPointRef.current = pointer;
      setIsDrawing(true);
      
      // Create wall (thick line)
      const line = new fabric.Line(
        [pointer.x, pointer.y, pointer.x, pointer.y],
        {
          strokeWidth: 10,
          stroke: '#333333',
          selectable: false
        }
      );
      
      // Add custom property to identify as wall
      line.set('type', 'wall');
      
      canvas.add(line);
      currentObjectRef.current = line;
      canvas.requestRenderAll();
    });
    
    canvas.on('mouse:move', (e: any) => {
      if (!isDrawing || !startPointRef.current || !currentObjectRef.current) return;
      
      const pointer = canvas.getPointer(e.e);
      const line = currentObjectRef.current;
      
      // Snap to grid if enabled
      let x2 = pointer.x;
      let y2 = pointer.y;
      
      if (snapToGrid) {
        x2 = Math.round(x2 / gridSize) * gridSize;
        y2 = Math.round(y2 / gridSize) * gridSize;
      }
      
      // Update line end point
      line.set({
        x2: x2,
        y2: y2
      });
      
      canvas.requestRenderAll();
    });
    
    canvas.on('mouse:up', () => {
      if (!isDrawing || !currentObjectRef.current) return;
      
      const line = currentObjectRef.current;
      line.setCoords();
      line.selectable = true;
      
      setIsDrawing(false);
      startPointRef.current = null;
      currentObjectRef.current = null;
      canvas.requestRenderAll();
    });
  }, [canvas, isDrawing, snapToGrid, gridSize]);

  const setupEraserTool = useCallback(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    canvas.on('mouse:down', (e: any) => {
      if (!e.target) return; // Only erase if clicking on an object
      
      canvas.remove(e.target);
      canvas.requestRenderAll();
    });
  }, [canvas]);

  const setupPanTool = useCallback(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = false;
    canvas.selection = false;
    
    canvas.on('mouse:down', (e: any) => {
      setIsMoving(true);
      canvas.selection = false;
      startPointRef.current = canvas.getPointer(e.e);
    });
    
    canvas.on('mouse:move', (e: any) => {
      if (!isMoving || !startPointRef.current) return;
      
      const pointer = canvas.getPointer(e.e);
      const vpt = canvas.viewportTransform;
      
      if (!vpt) return;
      
      vpt[4] += pointer.x - startPointRef.current.x;
      vpt[5] += pointer.y - startPointRef.current.y;
      
      canvas.requestRenderAll();
    });
    
    canvas.on('mouse:up', () => {
      setIsMoving(false);
      startPointRef.current = null;
      canvas.selection = true;
    });
  }, [canvas, isMoving]);

  // Initialize interactions when dependencies change
  const setupInteractions = useCallback(() => {
    if (!canvas) return;
    
    initializeInteractions();
    
    return () => {
      if (canvas) {
        // Clean up all event handlers
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        canvas.off('mouse:up');
        canvas.off('selection:created');
        canvas.off('selection:updated');
        canvas.off('selection:cleared');
      }
    };
  }, [canvas, initializeInteractions]);

  return {
    isDrawing,
    isMoving,
    setupInteractions,
    currentObject: currentObjectRef.current
  };
};

export default useCanvasInteraction;
