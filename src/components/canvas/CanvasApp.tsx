import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { useCanvasController } from './controller/CanvasController';
import { DrawingTool, DEFAULT_DRAWING_TOOL } from '@/types/drawing/DrawingToolTypes';
import { Toolbar } from './Toolbar';
import { CanvasWrapper } from './CanvasWrapper';
import { createBasicGrid } from '@/utils/gridCreationUtils';
import { ZoomDirection } from '@/types/drawingTypes';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';

interface CanvasAppProps {
  createGrid?: (canvas: FabricCanvas, existingGrid?: FabricObject[]) => FabricObject[];
  setCanvas?: (canvas: FabricCanvas | null) => void;
}

export const CanvasApp: React.FC<CanvasAppProps> = ({ 
  createGrid = createBasicGrid,
  setCanvas: externalSetCanvas
}) => {
  const { canvas, setCanvas, canvasRef, clearCanvas } = useCanvasController();
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
  const historyRef = useRef<{ past: FabricObject[][], future: FabricObject[][] }>({ past: [], future: [] });
  
  const [tool, setTool] = useState<DrawingTool>(DEFAULT_DRAWING_TOOL);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [gia, setGia] = useState<number>(0);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef?.current) return;
    
    try {
      // Create Fabric.js canvas
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        backgroundColor: '#FFFFFF',
        selection: true,
        preserveObjectStacking: true,
        width: canvasRef.current.width,
        height: canvasRef.current.height
      });
      
      // Store references
      fabricCanvasRef.current = fabricCanvas;
      setCanvas(fabricCanvas);
      
      // Also provide canvas to external handler if provided
      if (externalSetCanvas) {
        externalSetCanvas(fabricCanvas);
      }
      
      // Create grid
      if (createGrid) {
        const gridObjects = createGrid(fabricCanvas);
        gridLayerRef.current = gridObjects;
      }
      
      // Initialize drawing brush
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      fabricCanvas.freeDrawingBrush.color = lineColor;
      
      // Clean up on unmount
      return () => {
        fabricCanvas.dispose();
        fabricCanvasRef.current = null;
        setCanvas(null);
        
        if (externalSetCanvas) {
          externalSetCanvas(null);
        }
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      toast.error('Failed to initialize canvas');
    }
  }, [canvasRef, setCanvas, externalSetCanvas, createGrid, lineThickness, lineColor]);
  
  // Handle tool change
  const handleToolChange = useCallback((newTool: DrawingTool) => {
    if (!fabricCanvasRef.current) return;
    const canvas = fabricCanvasRef.current;
    
    // Save current state before changing tools
    saveCurrentState();
    
    // Update tool state
    setTool(newTool);
    
    // Apply tool-specific settings
    switch (newTool) {
      case 'draw':
        canvas.isDrawingMode = true;
        canvas.selection = false;
        break;
      case 'select':
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
      case 'straight-line':
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'crosshair';
        break;
      default:
        canvas.isDrawingMode = false;
        canvas.selection = true;
    }
    
    // Update brush settings
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = lineThickness;
      canvas.freeDrawingBrush.color = lineColor;
    }
    
    canvas.requestRenderAll();
    toast.success(`Tool changed to ${newTool}`);
  }, [fabricCanvasRef, lineThickness, lineColor]);
  
  // Handle line thickness change
  const handleLineThicknessChange = useCallback((thickness: number) => {
    setLineThickness(thickness);
    
    if (fabricCanvasRef.current?.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.width = thickness;
    }
  }, [fabricCanvasRef]);
  
  // Handle line color change
  const handleLineColorChange = useCallback((color: string) => {
    setLineColor(color);
    
    if (fabricCanvasRef.current?.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = color;
    }
  }, [fabricCanvasRef]);
  
  // Save current canvas state for undo/redo
  const saveCurrentState = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const currentState = canvas.getObjects().filter(obj => 
      !gridLayerRef.current.includes(obj)
    );
    
    // Deep clone objects to avoid reference issues
    const serializedState = currentState.map(obj => 
      canvas._objects.indexOf(obj) !== -1 ? obj : null
    ).filter(Boolean);
    
    historyRef.current.past.push(serializedState as FabricObject[]);
    historyRef.current.future = [];
    
    // Limit history size
    if (historyRef.current.past.length > 20) {
      historyRef.current.past.shift();
    }
  }, [fabricCanvasRef]);
  
  // Handle undo
  const handleUndo = useCallback(() => {
    if (!fabricCanvasRef.current || historyRef.current.past.length === 0) {
      toast.info('Nothing to undo');
      return;
    }
    
    const canvas = fabricCanvasRef.current;
    
    // Get current state and move to future
    const currentState = canvas.getObjects().filter(obj => 
      !gridLayerRef.current.includes(obj)
    );
    
    historyRef.current.future.unshift(currentState);
    
    // Remove non-grid objects
    currentState.forEach(obj => {
      canvas.remove(obj);
    });
    
    // Get previous state
    const prevState = historyRef.current.past.pop();
    
    // Restore previous state
    if (prevState) {
      prevState.forEach(obj => {
        canvas.add(obj);
      });
    }
    
    canvas.requestRenderAll();
    toast.success('Undo successful');
  }, [fabricCanvasRef]);
  
  // Handle redo
  const handleRedo = useCallback(() => {
    if (!fabricCanvasRef.current || historyRef.current.future.length === 0) {
      toast.info('Nothing to redo');
      return;
    }
    
    const canvas = fabricCanvasRef.current;
    
    // Get current state and move to past
    const currentState = canvas.getObjects().filter(obj => 
      !gridLayerRef.current.includes(obj)
    );
    
    historyRef.current.past.push(currentState);
    
    // Remove non-grid objects
    currentState.forEach(obj => {
      canvas.remove(obj);
    });
    
    // Get future state
    const futureState = historyRef.current.future.shift();
    
    // Restore future state
    if (futureState) {
      futureState.forEach(obj => {
        canvas.add(obj);
      });
    }
    
    canvas.requestRenderAll();
    toast.success('Redo successful');
  }, [fabricCanvasRef]);
  
  // Handle zoom
  const handleZoom = useCallback((direction: ZoomDirection) => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    let newZoom = zoomLevel;
    if (direction === 'in') {
      newZoom = Math.min(zoomLevel * 1.2, 5);
    } else {
      newZoom = Math.max(zoomLevel * 0.8, 0.2);
    }
    
    canvas.setZoom(newZoom);
    setZoomLevel(newZoom);
    
    toast.success(`Zoom level: ${Math.round(newZoom * 100)}%`);
  }, [fabricCanvasRef, zoomLevel]);
  
  // Handle clear canvas
  const handleClear = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    // Save current state before clearing
    saveCurrentState();
    
    clearCanvas();
    toast.success('Canvas cleared');
  }, [fabricCanvasRef, clearCanvas, saveCurrentState]);
  
  // Handle save canvas
  const handleSave = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    toast.success('Canvas saved');
    // Implement actual save functionality here
  }, [fabricCanvasRef]);
  
  // Handle delete selected objects
  const handleDelete = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    
    if (activeObjects.length === 0) {
      toast.info('No objects selected');
      return;
    }
    
    // Save current state before deleting
    saveCurrentState();
    
    // Remove selected objects
    canvas.remove(...activeObjects);
    
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    
    toast.success(`Deleted ${activeObjects.length} object(s)`);
  }, [fabricCanvasRef, saveCurrentState]);
  
  return (
    <div className="flex flex-col w-full h-full">
      <Toolbar
        activeTool={tool}
        lineThickness={lineThickness}
        lineColor={lineColor}
        onToolChange={handleToolChange}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSave={handleSave}
        onDelete={handleDelete}
        onLineThicknessChange={handleLineThicknessChange}
        onLineColorChange={handleLineColorChange}
      />
      
      <div className="flex-1 relative overflow-hidden">
        <CanvasWrapper />
        
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
          <Button size="sm" onClick={() => handleZoom('in')}>Zoom In</Button>
          <Button size="sm" onClick={() => handleZoom('out')}>Zoom Out</Button>
        </div>
      </div>
    </div>
  );
};
