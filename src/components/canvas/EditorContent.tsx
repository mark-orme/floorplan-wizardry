
import React, { useEffect, useState } from 'react';
import { OptimizedCanvasController } from '@/components/OptimizedCanvasController';
import { MobileToolbar } from '@/components/canvas/MobileToolbar';
import { DrawingMode } from '@/constants/drawingModes';
import { Canvas as FabricCanvas } from 'fabric';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface EditorContentProps {
  forceRefreshKey: number;
  setCanvas: (canvas: FabricCanvas) => void;
  showGridDebug: boolean;
  tool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  enableSync?: boolean;
  onToolChange?: (tool: DrawingMode) => void;
  onLineThicknessChange?: (thickness: number) => void;
  onLineColorChange?: (color: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onClear?: () => void;
  onSave?: () => void;
}

export const EditorContent: React.FC<EditorContentProps> = ({
  forceRefreshKey,
  setCanvas,
  showGridDebug,
  tool,
  lineThickness,
  lineColor,
  enableSync = true,
  onToolChange,
  onLineThicknessChange,
  onLineColorChange,
  onUndo,
  onRedo,
  onClear,
  onSave
}) => {
  const isMobile = useIsMobile();
  const [canvasReady, setCanvasReady] = useState(false);
  const [canvasInstance, setCanvasInstance] = useState<FabricCanvas | null>(null);
  
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 600
  });
  
  useEffect(() => {
    if (isMobile) {
      const mobileWidth = Math.min(window.innerWidth - 32, 800);
      const mobileHeight = Math.min(window.innerHeight - 240, 600);
      
      setDimensions({
        width: mobileWidth,
        height: mobileHeight
      });
    } else {
      setDimensions({
        width: 800,
        height: 600
      });
    }
  }, [isMobile]);
  
  const handleCanvasReady = (canvas: FabricCanvas) => {
    setCanvas(canvas);
    setCanvasInstance(canvas);
    setCanvasReady(true);
    
    if (isMobile) {
      toast.info("Use two fingers to pan and zoom. Tap and hold to select objects.", {
        duration: 5000,
        id: "mobile-canvas-tips"
      });
    }
  };
  
  const handleCanvasError = (error: Error) => {
    console.error("Canvas error:", error);
    toast.error("Failed to initialize drawing canvas");
  };
  
  const handleToolChange = (newTool: DrawingMode) => {
    if (onToolChange) {
      onToolChange(newTool);
    }
  };
  
  const handleZoomIn = () => {
    if (canvasInstance) {
      const currentZoom = canvasInstance.getZoom();
      canvasInstance.setZoom(Math.min(currentZoom * 1.2, 5.0));
      canvasInstance.renderAll();
    }
  };
  
  const handleZoomOut = () => {
    if (canvasInstance) {
      const currentZoom = canvasInstance.getZoom();
      canvasInstance.setZoom(Math.max(currentZoom / 1.2, 0.5));
      canvasInstance.renderAll();
    }
  };
  
  return (
    <div className="flex-1 overflow-hidden relative">
      <div className="w-full h-full relative flex items-center justify-center bg-background">
        <div 
          className="relative w-full h-full"
          style={{ 
            maxWidth: isMobile ? '100%' : '800px',
            maxHeight: isMobile ? '100%' : '600px'
          }}
        >
          <OptimizedCanvasController
            key={`canvas-${forceRefreshKey}`}
            width={dimensions.width}
            height={dimensions.height}
            tool={tool}
            lineColor={lineColor}
            lineThickness={lineThickness}
            showGrid={showGridDebug}
            onCanvasReady={handleCanvasReady}
            onError={handleCanvasError}
          />
          
          {isMobile && (
            <MobileToolbar
              activeTool={tool}
              onToolChange={handleToolChange}
              onUndo={onUndo || (() => {})}
              onRedo={onRedo || (() => {})}
              onClear={onClear || (() => {})}
              onSave={onSave || (() => {})}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />
          )}
        </div>
      </div>
    </div>
  );
};
