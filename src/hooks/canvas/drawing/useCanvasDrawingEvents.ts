/**
 * Canvas drawing events hook
 * Manages drawing-related event handlers
 */
import { useCallback, useEffect, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Path as FabricPath, 
  Line as FabricLine, Rect as FabricRect, IText as FabricIText, Group as FabricGroup,
  Text as FabricText } from "fabric";
import { DrawingTool } from "@/types/drawingTypes";
import { useCanvasContext } from "@/contexts/CanvasContext";
import { snapPointToGrid } from "@/utils/simpleGridCreator";
import { toast } from "sonner";
import logger from "@/utils/logger";

// Constants for drawing
const DEFAULT_LINE_WIDTH = 2;
const DEFAULT_LINE_COLOR = "#000000";
const GRID_SNAP_SIZE = 10;

/**
 * Hook for managing canvas drawing events
 * @param {DrawingTool} activeTool - Currently active drawing tool
 * @param {number} lineThickness - Line thickness for drawing
 * @param {string} lineColor - Line color for drawing
 * @returns {object} Drawing event handlers and state
 */
export const useCanvasDrawingEvents = (
  activeTool: DrawingTool,
  lineThickness: number = DEFAULT_LINE_WIDTH,
  lineColor: string = DEFAULT_LINE_COLOR
) => {
  const { canvas } = useCanvasContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<FabricObject | null>(null);
  const [pathStartPoint, setPathStartPoint] = useState<{ x: number, y: number } | null>(null);
  const [timeouts, setTimeouts] = useState<number[]>([]);

  // Add cleanup function for timeouts
  const cleanupTimeouts = useCallback(() => {
    timeouts.forEach(id => window.clearTimeout(id));
    setTimeouts([]);
  }, [timeouts]);

  /**
   * Start drawing path
   * @param {any} event - Fabric event object
   */
  const startDrawing = useCallback((event: any) => {
    if (!canvas || activeTool !== DrawingTool.DRAW) return;
    
    try {
      // Get pointer coordinates
      const pointer = canvas.getPointer(event.e);
      
      // Snap to grid
      const snappedPoint = snapPointToGrid(pointer.x, pointer.y, GRID_SNAP_SIZE);
      
      // Create a new path
      const path = new FabricPath(`M ${snappedPoint.x} ${snappedPoint.y}`, {
        stroke: lineColor,
        strokeWidth: lineThickness,
        fill: '',
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
        selectable: true
      });
      
      // Add path to canvas
      canvas.add(path);
      
      // Update state
      setIsDrawing(true);
      setCurrentPath(path);
      setPathStartPoint(snappedPoint);
      
      // Request render
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error starting drawing:", error);
      toast.error("Error starting drawing");
    }
  }, [canvas, activeTool, lineColor, lineThickness]);

  /**
   * Continue drawing path
   * @param {any} event - Fabric event object
   */
  const continueDrawing = useCallback((event: any) => {
    if (!canvas || !isDrawing || !currentPath || activeTool !== DrawingTool.DRAW) return;
    
    try {
      // Get pointer coordinates
      const pointer = canvas.getPointer(event.e);
      
      // Snap to grid
      const snappedPoint = snapPointToGrid(pointer.x, pointer.y, GRID_SNAP_SIZE);
      
      // Get current path data
      const path = currentPath as FabricPath;
      const pathData = path.path;
      
      // Add line to current point
      pathData.push(['L', snappedPoint.x, snappedPoint.y]);
      
      // Update path
      path.set({ path: pathData });
      
      // Request render
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error continuing drawing:", error);
    }
  }, [canvas, isDrawing, currentPath, activeTool]);

  /**
   * End drawing path
   */
  const endDrawing = useCallback(() => {
    if (!canvas || !isDrawing || !currentPath) return;
    
    try {
      // Finalize the path
      const path = currentPath as FabricPath;
      
      // If path is too short (just a click), remove it
      if (path.path.length <= 1) {
        canvas.remove(path);
      } else {
        // Finalize the path
        path.setCoords();
        
        // Fire object added event for history tracking
        canvas.fire('object:added', { target: path });
      }
      
      // Reset state
      setIsDrawing(false);
      setCurrentPath(null);
      setPathStartPoint(null);
      
      // Request render
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error ending drawing:", error);
    }
  }, [canvas, isDrawing, currentPath]);

  /**
   * Handle wall drawing start
   * @param {any} event - Fabric event object
   */
  const startWallDrawing = useCallback((event: any) => {
    if (!canvas || activeTool !== DrawingTool.WALL) return;
    
    try {
      // Get pointer coordinates
      const pointer = canvas.getPointer(event.e);
      
      // Snap to grid
      const snappedPoint = snapPointToGrid(pointer.x, pointer.y, GRID_SNAP_SIZE);
      
      // Create a temporary line
      const line = new FabricLine([snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y], {
        stroke: lineColor,
        strokeWidth: lineThickness * 2, // Walls are thicker
        selectable: true,
        objectType: 'wall'
      });
      
      // Add line to canvas
      canvas.add(line);
      
      // Update state
      setIsDrawing(true);
      setCurrentPath(line);
      setPathStartPoint(snappedPoint);
      
      // Request render
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error starting wall drawing:", error);
      toast.error("Error starting wall drawing");
    }
  }, [canvas, activeTool, lineColor, lineThickness]);

  /**
   * Continue wall drawing
   * @param {any} event - Fabric event object
   */
  const continueWallDrawing = useCallback((event: any) => {
    if (!canvas || !isDrawing || !currentPath || activeTool !== DrawingTool.WALL) return;
    
    try {
      // Get pointer coordinates
      const pointer = canvas.getPointer(event.e);
      
      // Snap to grid
      const snappedPoint = snapPointToGrid(pointer.x, pointer.y, GRID_SNAP_SIZE);
      
      // Update line end point
      const line = currentPath as FabricLine;
      line.set({
        x2: snappedPoint.x,
        y2: snappedPoint.y
      });
      
      // Request render
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error continuing wall drawing:", error);
    }
  }, [canvas, isDrawing, currentPath, activeTool]);

  /**
   * End wall drawing
   */
  const endWallDrawing = useCallback(() => {
    if (!canvas || !isDrawing || !currentPath || !pathStartPoint) return;
    
    try {
      // Finalize the wall
      const line = currentPath as FabricLine;
      
      // Get end points
      const x1 = line.x1 || pathStartPoint.x;
      const y1 = line.y1 || pathStartPoint.y;
      const x2 = line.x2 || x1;
      const y2 = line.y2 || y1;
      
      // If line is too short (just a click), remove it
      if (Math.abs(x2 - x1) < 5 && Math.abs(y2 - y1) < 5) {
        canvas.remove(line);
      } else {
        // Finalize the line
        line.setCoords();
        
        // Fire object added event for history tracking
        canvas.fire('object:added', { target: line });
      }
      
      // Reset state
      setIsDrawing(false);
      setCurrentPath(null);
      setPathStartPoint(null);
      
      // Request render
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error ending wall drawing:", error);
    }
  }, [canvas, isDrawing, currentPath, pathStartPoint]);

  /**
   * Handle room drawing start
   * @param {any} event - Fabric event object
   */
  const startRoomDrawing = useCallback((event: any) => {
    if (!canvas || activeTool !== DrawingTool.ROOM) return;
    
    try {
      // Get pointer coordinates
      const pointer = canvas.getPointer(event.e);
      
      // Snap to grid
      const snappedPoint = snapPointToGrid(pointer.x, pointer.y, GRID_SNAP_SIZE);
      
      // Create a temporary rectangle
      const rect = new FabricRect({
        left: snappedPoint.x,
        top: snappedPoint.y,
        width: 0,
        height: 0,
        fill: 'rgba(200, 200, 255, 0.3)',
        stroke: lineColor,
        strokeWidth: lineThickness,
        selectable: true,
        objectType: 'room'
      });
      
      // Add rectangle to canvas
      canvas.add(rect);
      
      // Update state
      setIsDrawing(true);
      setCurrentPath(rect);
      setPathStartPoint(snappedPoint);
      
      // Request render
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error starting room drawing:", error);
      toast.error("Error starting room drawing");
    }
  }, [canvas, activeTool, lineColor, lineThickness]);

  /**
   * Continue room drawing
   * @param {any} event - Fabric event object
   */
  const continueRoomDrawing = useCallback((event: any) => {
    if (!canvas || !isDrawing || !currentPath || !pathStartPoint || activeTool !== DrawingTool.ROOM) return;
    
    try {
      // Get pointer coordinates
      const pointer = canvas.getPointer(event.e);
      
      // Snap to grid
      const snappedPoint = snapPointToGrid(pointer.x, pointer.y, GRID_SNAP_SIZE);
      
      // Calculate width and height
      const width = Math.abs(snappedPoint.x - pathStartPoint.x);
      const height = Math.abs(snappedPoint.y - pathStartPoint.y);
      
      // Calculate left and top (in case drawing backwards)
      const left = Math.min(pathStartPoint.x, snappedPoint.x);
      const top = Math.min(pathStartPoint.y, snappedPoint.y);
      
      // Update rectangle
      const rect = currentPath as FabricRect;
      rect.set({
        left,
        top,
        width,
        height
      });
      
      // Request render
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error continuing room drawing:", error);
    }
  }, [canvas, isDrawing, currentPath, pathStartPoint, activeTool]);

  /**
   * End room drawing
   */
  const endRoomDrawing = useCallback(() => {
    if (!canvas || !isDrawing || !currentPath) return;
    
    try {
      // Finalize the room
      const rect = currentPath as FabricRect;
      
      // If rectangle is too small, remove it
      if (rect.width < 10 || rect.height < 10) {
        canvas.remove(rect);
      } else {
        // Finalize the rectangle
        rect.setCoords();
        
        // Fire object added event for history tracking
        canvas.fire('object:added', { target: rect });
      }
      
      // Reset state
      setIsDrawing(false);
      setCurrentPath(null);
      setPathStartPoint(null);
      
      // Request render
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error ending room drawing:", error);
    }
  }, [canvas, isDrawing, currentPath]);

  /**
   * Handle text tool activation
   * @param {any} event - Fabric event object
   */
  const handleTextTool = useCallback((event: any) => {
    if (!canvas || activeTool !== DrawingTool.TEXT) return;
    
    try {
      // Get pointer coordinates
      const pointer = canvas.getPointer(event.e);
      
      // Snap to grid
      const snappedPoint = snapPointToGrid(pointer.x, pointer.y, GRID_SNAP_SIZE);
      
      // Create a text object
      const text = new FabricIText('Text', {
        left: snappedPoint.x,
        top: snappedPoint.y,
        fontFamily: 'Arial',
        fontSize: 16,
        fill: lineColor,
        selectable: true,
        editable: true
      } as any);
      
      // Add text to canvas
      canvas.add(text);
      
      // Select the text for editing
      canvas.setActiveObject(text as any);
      text.enterEditing();
      text.selectAll();
      
      // Fire object added event for history tracking
      canvas.fire('object:added', { target: text as any });
      
      // Request render
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error adding text:", error);
      toast.error("Error adding text");
    }
  }, [canvas, activeTool, lineColor]);

  /**
   * Handle eraser tool
   * @param {any} event - Fabric event object
   */
  const handleEraserTool = useCallback((event: any) => {
    if (!canvas || activeTool !== DrawingTool.ERASER) return;
    
    try {
      // Get pointer coordinates
      const pointer = canvas.getPointer(event.e);
      
      // Find objects at pointer position
      const objects = canvas.getObjects().filter(obj => {
        // Skip objects with objectType 'grid'
        if (obj.objectType === 'grid') return false;
        
        // Check if pointer is inside object
        return obj.containsPoint(pointer);
      });
      
      // Remove objects
      if (objects.length > 0) {
        objects.forEach(obj => {
          canvas.remove(obj);
        });
        
        // Request render
        canvas.requestRenderAll();
        
        // Show toast if objects were removed
        if (objects.length === 1) {
          toast.success("Object erased");
        } else if (objects.length > 1) {
          toast.success(`${objects.length} objects erased`);
        }
      }
    } catch (error) {
      logger.error("Error using eraser:", error);
    }
  }, [canvas, activeTool]);

  /**
   * Handle measure tool
   * @param {any} event - Fabric event object
   */
  const startMeasuring = useCallback((event: any) => {
    if (!canvas || activeTool !== DrawingTool.MEASURE) return;
    
    try {
      // Get pointer coordinates
      const pointer = canvas.getPointer(event.e);
      
      // Snap to grid
      const snappedPoint = snapPointToGrid(pointer.x, pointer.y, GRID_SNAP_SIZE);
      
      // Create a temporary line
      const line = new FabricLine([snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y], {
        stroke: '#ff0000',
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: true,
        objectType: 'measurement'
      });
      
      // Add line to canvas
      canvas.add(line);
      
      // Create measurement label
      const text = new FabricText('0 cm', {
        left: snappedPoint.x,
        top: snappedPoint.y - 15,
        fontSize: 12,
        fill: '#ff0000',
        selectable: false,
        objectType: 'measurement'
      });
      
      // Add text to canvas
      canvas.add(text);
      
      // Update state
      setIsDrawing(true);
      setCurrentPath(line);
      setPathStartPoint(snappedPoint);
      
      // Store text reference in line object for later updates
      (line as any).measurementLabel = text;
      
      // Request render
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error starting measurement:", error);
      toast.error("Error starting measurement");
    }
  }, [canvas, activeTool]);

  /**
   * Continue measuring
   * @param {any} event - Fabric event object
   */
  const continueMeasuring = useCallback((event: any) => {
    if (!canvas || !isDrawing || !currentPath || !pathStartPoint || activeTool !== DrawingTool.MEASURE) return;
    
    try {
      // Get pointer coordinates
      const pointer = canvas.getPointer(event.e);
      
      // Snap to grid
      const snappedPoint = snapPointToGrid(pointer.x, pointer.y, GRID_SNAP_SIZE);
      
      // Update line end point
      const line = currentPath as FabricLine;
      line.set({
        x2: snappedPoint.x,
        y2: snappedPoint.y
      });
      
      // Calculate distance
      const dx = snappedPoint.x - pathStartPoint.x;
      const dy = snappedPoint.y - pathStartPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Convert to cm (assuming 1 unit = 1 cm)
      const distanceCm = Math.round(distance);
      
      // Update measurement label
      const text = (line as any).measurementLabel as FabricIText;
      if (text) {
        text.set({
          text: `${distanceCm} cm`,
          left: (pathStartPoint.x + snappedPoint.x) / 2,
          top: (pathStartPoint.y + snappedPoint.y) / 2 - 15
        });
      }
      
      // Request render
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error continuing measurement:", error);
    }
  }, [canvas, isDrawing, currentPath, pathStartPoint, activeTool]);

  /**
   * End measuring
   */
  const endMeasuring = useCallback(() => {
    if (!canvas || !isDrawing || !currentPath) return;
    
    try {
      // Finalize the measurement
      const line = currentPath as FabricLine;
      const text = (line as any).measurementLabel as FabricIText;
      
      // Group line and text together
      const group = new FabricGroup([line, text], {
        selectable: true
      });
      
      // Remove individual objects
      canvas.remove(line);
      canvas.remove(text);
      
      // Add group to canvas
      canvas.add(group);
      
      // Fire object added event for history tracking
      canvas.fire('object:added', { target: group });
      
      // Reset state
      setIsDrawing(false);
      setCurrentPath(null);
      setPathStartPoint(null);
      
      // Request render
      canvas.requestRenderAll();
    } catch (error) {
      logger.error("Error ending measurement:", error);
    }
  }, [canvas, isDrawing, currentPath]);

  // Set up event handlers based on active tool
  useEffect(() => {
    if (!canvas) return;
    
    // Remove existing event listeners
    canvas.off('mouse:down');
    canvas.off('mouse:move');
    canvas.off('mouse:up');
    
    // Set cursor based on tool
    switch (activeTool) {
      case DrawingTool.SELECT:
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'move';
        break;
      case DrawingTool.DRAW:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        canvas.on('mouse:down', startDrawing);
        canvas.on('mouse:move', continueDrawing);
        canvas.on('mouse:up', endDrawing);
        break;
      case DrawingTool.WALL:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        canvas.on('mouse:down', startWallDrawing);
        canvas.on('mouse:move', continueWallDrawing);
        canvas.on('mouse:up', endWallDrawing);
        break;
      case DrawingTool.ROOM:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        canvas.on('mouse:down', startRoomDrawing);
        canvas.on('mouse:move', continueRoomDrawing);
        canvas.on('mouse:up', endRoomDrawing);
        break;
      case DrawingTool.MEASURE:
        canvas.defaultCursor = 'crosshair';
        canvas.hoverCursor = 'crosshair';
        canvas.on('mouse:down', startMeasuring);
        canvas.on('mouse:move', continueMeasuring);
        canvas.on('mouse:up', endMeasuring);
        break;
      case DrawingTool.TEXT:
        canvas.defaultCursor = 'text';
        canvas.hoverCursor = 'text';
        canvas.on('mouse:down', handleTextTool);
        break;
      case DrawingTool.ERASER:
        canvas.defaultCursor = 'not-allowed';
        canvas.hoverCursor = 'not-allowed';
        canvas.on('mouse:down', handleEraserTool);
        break;
      default:
        canvas.defaultCursor = 'default';
        canvas.hoverCursor = 'default';
    }
    
    // Clean up event listeners on unmount
    return () => {
      cleanupTimeouts();
      if (canvas) {
        canvas.off('mouse:down');
        canvas.off('mouse:move');
        canvas.off('mouse:up');
      }
    };
  }, [
    canvas, 
    activeTool, 
    startDrawing, 
    continueDrawing, 
    endDrawing,
    startWallDrawing,
    continueWallDrawing,
    endWallDrawing,
    startRoomDrawing,
    continueRoomDrawing,
    endRoomDrawing,
    startMeasuring,
    continueMeasuring,
    endMeasuring,
    handleTextTool,
    handleEraserTool,
    cleanupTimeouts
  ]);

  return {
    isDrawing,
    currentPath,
    handleMouseDown: startDrawing,
    handleMouseMove: continueDrawing,
    handleMouseUp: endDrawing,
    cleanupTimeouts
  };
};
