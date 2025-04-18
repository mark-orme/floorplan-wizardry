
import React, { useEffect, useState } from 'react';
import { OptimizedCanvasController } from '@/components/OptimizedCanvasController';
import { Canvas as FabricCanvas } from 'fabric';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingToolbar } from '@/components/canvas/DrawingToolbar';
import { useDrawingContext } from '@/contexts/DrawingContext';

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
  const { canUndo, canRedo } = useDrawingContext();
  
  const handleCanvasReady = (canvas: FabricCanvas) => {
    setCanvas(canvas);
    setCanvasInstance(canvas);
    setCanvasReady(true);
    
    if (isMobile) {
      toast.info("Use pinch gestures to zoom, two fingers to pan", {
        duration: 5000,
        id: "mobile-canvas-tips"
      });
    }
  };
  
  const handleCanvasError = (error: Error) => {
    console.error("Canvas error:", error);
    toast.error("Failed to initialize drawing canvas");
  };

  // Ensure grid is displayed by using showGridDebug
  useEffect(() => {
    if (canvasInstance) {
      console.log("Canvas ready, showing grid:", showGridDebug);
    }
  }, [canvasInstance, showGridDebug]);

  return (
    <div className="flex flex-col h-full">
      {/* Drawing toolbar - now visible on both mobile and desktop */}
      <DrawingToolbar
        onSave={onSave}
        onClear={onClear}
        onUndo={onUndo}
        onRedo={onRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      
      <div className="flex-1 overflow-hidden relative">
        <div className="w-full h-full relative flex items-center justify-center bg-background">
          <div className="relative w-full h-full">
            <OptimizedCanvasController
              key={`canvas-${forceRefreshKey}`}
              width={800}
              height={600}
              tool={tool}
              lineColor={lineColor}
              lineThickness={lineThickness}
              showGrid={showGridDebug}
              onCanvasReady={handleCanvasReady}
              onError={handleCanvasError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
