
import React, { useCallback, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { ConnectedDrawingCanvas } from './ConnectedDrawingCanvas';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileDrawingToolbar } from './MobileDrawingToolbar';
import { DrawingMode } from '@/constants/drawingModes';

interface FloorPlanCanvasProps {
  onCanvasReady?: (canvas: any) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({ onCanvasReady }) => {
  const isMobile = useIsMobile();
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState<string>("#000000");
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  
  // Set consistent canvas dimensions for both mobile and desktop
  const width = 800; // Fixed width for consistency
  const height = 600; // Fixed height for consistency
  
  const containerStyle = {
    width: '100%',
    maxWidth: width,
    height: 'auto',
    aspectRatio: `${width}/${height}`,
    overflow: 'hidden'
  };
  
  const handleCanvasRef = useCallback((canvas: FabricCanvas) => {
    setCanvas(canvas);
    
    if (onCanvasReady) {
      // Track undo/redo state
      const updateUndoRedoState = () => {
        // This would be connected to your actual history management
        // For now, just a placeholder logic
        setCanUndo(true);
        setCanRedo(false);
      };
      
      canvas.on('object:added', updateUndoRedoState);
      canvas.on('object:modified', updateUndoRedoState);
      canvas.on('object:removed', updateUndoRedoState);
      
      // Add necessary operations to the canvas object before passing it up
      const canvasOperations = {
        canvas,
        undo: () => {
          console.log("Undo operation");
          // Implement undo logic here if needed
        },
        redo: () => {
          console.log("Redo operation");
          // Implement redo logic here if needed
        },
        clearCanvas: () => {
          const objects = canvas.getObjects();
          objects.forEach(obj => {
            if (!(obj as any).isGrid) { // Don't remove grid objects
              canvas.remove(obj);
            }
          });
          canvas.renderAll();
        },
        saveCanvas: () => {
          console.log("Save operation");
          // Implement save logic here if needed
        },
        canUndo: true,
        canRedo: false
      };
      
      onCanvasReady(canvasOperations);
    }
  }, [onCanvasReady]);
  
  const handleToolChange = (tool: DrawingMode) => {
    setActiveTool(tool);
    if (canvas) {
      // Configure canvas based on selected tool
      canvas.isDrawingMode = tool === DrawingMode.DRAW;
      
      if (tool === DrawingMode.SELECT) {
        canvas.selection = true;
      }
      
      if (tool === DrawingMode.DRAW && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;
      }
      
      canvas.renderAll();
    }
  };
  
  const handleLineColorChange = (color: string) => {
    setLineColor(color);
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
  };
  
  const handleLineThicknessChange = (thickness: number) => {
    setLineThickness(thickness);
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = thickness;
    }
  };
  
  const handleUndo = () => {
    // Implement actual undo logic here
    console.log("Undo triggered");
  };
  
  const handleRedo = () => {
    // Implement actual redo logic here
    console.log("Redo triggered");
  };
  
  const handleClear = () => {
    if (canvas) {
      const objects = canvas.getObjects();
      objects.forEach(obj => {
        if (!(obj as any).isGrid) { // Don't remove grid objects
          canvas.remove(obj);
        }
      });
      canvas.renderAll();
    }
  };
  
  const handleSave = () => {
    // Implement save logic here
    console.log("Save triggered");
  };
  
  const handleZoomIn = () => {
    if (canvas) {
      let zoom = canvas.getZoom();
      zoom = zoom * 1.1;
      if (zoom > 20) zoom = 20;
      canvas.setZoom(zoom);
    }
  };
  
  const handleZoomOut = () => {
    if (canvas) {
      let zoom = canvas.getZoom();
      zoom = zoom / 1.1;
      if (zoom < 0.1) zoom = 0.1;
      canvas.setZoom(zoom);
    }
  };
  
  return (
    <div className="flex flex-col items-center w-full min-h-0">
      <div style={containerStyle} className="relative border border-border rounded-md bg-white shadow-sm">
        <ConnectedDrawingCanvas
          width={width}
          height={height}
          showGrid={true}
          onCanvasReady={handleCanvasRef}
        />
        
        {isMobile && (
          <MobileDrawingToolbar 
            activeTool={activeTool}
            onToolChange={handleToolChange}
            lineColor={lineColor}
            lineThickness={lineThickness}
            onLineColorChange={handleLineColorChange}
            onLineThicknessChange={handleLineThicknessChange}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClear}
            onSave={handleSave}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        )}
      </div>
    </div>
  );
};

export default FloorPlanCanvas;
