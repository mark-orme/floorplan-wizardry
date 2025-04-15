
import React, { useEffect, useState, useRef } from 'react';
import { Canvas as FabricCanvas, ActiveSelection } from 'fabric';
import { CanvasEventManager } from './CanvasEventManager';
import { TouchGestureHandler } from './TouchGestureHandler';
import { ToolVisualizer } from './ToolVisualizer';
import { useCanvasHistory } from '@/hooks/canvas/useCanvasHistory';
import { useDrawingContext } from '@/contexts/DrawingContext';
import { useApplePencilSupport } from '@/hooks/canvas/useApplePencilSupport';
import { updateGridWithZoom } from '@/utils/grid/gridVisibility';
import { DrawingMode } from '@/constants/drawingModes';

interface CanvasAppProps {
  setCanvas: (canvas: FabricCanvas) => void;
  width?: number;
  height?: number;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
}

export const CanvasApp: React.FC<CanvasAppProps> = ({ 
  setCanvas,
  width = 800,
  height = 600,
  tool: externalTool,
  lineColor: externalLineColor,
  lineThickness: externalLineThickness
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const { tool: contextTool, lineColor: contextLineColor, lineThickness: contextLineThickness } = useDrawingContext();
  const gridLayerRef = useRef<any[]>([]);
  
  // Use external props if provided, otherwise use context values
  const tool = externalTool || contextTool;
  const lineColor = externalLineColor || contextLineColor;
  const lineThickness = externalLineThickness || contextLineThickness;
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true
    });
    
    // Add zoom event listener for grid scaling
    canvas.on('zoom:changed', () => {
      updateGridWithZoom(canvas);
    });
    
    setFabricCanvas(canvas);
    setCanvas(canvas);
    
    return () => {
      canvas.dispose();
    };
  }, [setCanvas, width, height]);
  
  // Create a deleteSelectedObjects function
  const deleteSelectedObjects = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject) return;
    
    if (activeObject.type === 'activeSelection') {
      const activeSelection = activeObject as ActiveSelection;
      activeSelection.forEachObject((obj) => {
        fabricCanvas.remove(obj);
      });
      fabricCanvas.discardActiveObject();
    } else {
      fabricCanvas.remove(activeObject);
    }
    
    fabricCanvas.requestRenderAll();
  };
  
  // Set up canvas history management
  const { 
    undo, 
    redo, 
    saveCurrentState,
    deleteSelectedObjects: historyDeleteSelectedObjects
  } = useCanvasHistory({
    canvas: fabricCanvas
  });
  
  // Get Apple Pencil support
  const { isApplePencil } = useApplePencilSupport({
    canvas: fabricCanvas,
    lineThickness
  });
  
  // Set cursor based on current tool
  useEffect(() => {
    if (!fabricCanvas || !canvasRef.current) return;
    
    switch (tool) {
      case DrawingMode.SELECT:
        canvasRef.current.style.cursor = 'default';
        break;
      case DrawingMode.DRAW:
        canvasRef.current.style.cursor = 'crosshair';
        break;
      case DrawingMode.HAND:
        canvasRef.current.style.cursor = 'grab';
        break;
      case DrawingMode.ERASER:
        canvasRef.current.style.cursor = 'cell';
        break;
      default:
        canvasRef.current.style.cursor = 'crosshair';
    }
  }, [fabricCanvas, tool]);
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="touch-manipulation border border-gray-200"
        data-testid="canvas"
      />
      
      {fabricCanvas && (
        <>
          <CanvasEventManager
            canvas={fabricCanvas}
            tool={tool}
            lineColor={lineColor}
            lineThickness={lineThickness}
            gridLayerRef={gridLayerRef}
            saveCurrentState={saveCurrentState}
            undo={undo}
            redo={redo}
            deleteSelectedObjects={deleteSelectedObjects}
          />
          
          <TouchGestureHandler 
            canvas={fabricCanvas} 
            lineThickness={lineThickness}
            tool={tool}
          />
          
          <ToolVisualizer 
            tool={tool}
            isApplePencil={isApplePencil}
          />
        </>
      )}
    </div>
  );
};
