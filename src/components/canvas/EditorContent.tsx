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
          
          {isMobile && canvasReady && (
            <MobileToolbar
              activeTool={tool}
              onToolChange={onToolChange}
              onUndo={onUndo}
              onRedo={onRedo}
              onClear={onClear}
              onSave={onSave}
            />
          )}
        </div>
      </div>
    </div>
  );
};
