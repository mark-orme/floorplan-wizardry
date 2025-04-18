
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsIOS } from '@/hooks/use-ios';
import { MobileGridLayer } from './canvas/grid/MobileGridLayer';
import { forceGridVisibility } from '@/utils/grid/gridVisibilityManager';
import { toast } from 'sonner';

interface OptimizedCanvasProps {
  width: number;
  height: number;
  onCanvasReady: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  tool?: DrawingMode;
  lineColor?: string;
  lineThickness?: number;
  showGrid?: boolean;
}

export const OptimizedCanvas: React.FC<OptimizedCanvasProps> = ({
  width,
  height,
  onCanvasReady,
  onError,
  tool = DrawingMode.SELECT,
  lineColor = "#000000",
  lineThickness = 2,
  showGrid = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [initialized, setInitialized] = useState(false);
  const isMobile = useIsMobile();
  const isIOS = useIsIOS();
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || initialized) return;
    
    try {
      console.log("Initializing canvas with dimensions:", width, "x", height);
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        selection: tool === DrawingMode.SELECT,
        backgroundColor: "#ffffff"
      });
      
      // Set drawing settings
      fabricCanvas.freeDrawingBrush.color = lineColor;
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      
      // Add iOS-specific class if needed
      if (isIOS && fabricCanvas.wrapperEl) {
        fabricCanvas.wrapperEl.classList.add('ios-canvas');
        fabricCanvas.wrapperEl.classList.add('enhanced-grid-ios');
      }
      
      // Add mobile-specific class if needed
      if (isMobile && fabricCanvas.wrapperEl) {
        fabricCanvas.wrapperEl.classList.add('touch-optimized-canvas');
      }
      
      setCanvas(fabricCanvas);
      setInitialized(true);
      
      // Notify parent
      onCanvasReady(fabricCanvas);
      
      // Force a grid render after a short delay on iOS
      if (isIOS) {
        setTimeout(() => {
          forceGridVisibility(fabricCanvas);
          fabricCanvas.requestRenderAll();
        }, 300);
      }
    } catch (error) {
      console.error("Error initializing canvas:", error);
      if (onError && error instanceof Error) {
        onError(error);
      }
      toast.error("Canvas initialization failed");
    }
  }, [canvasRef, width, height, tool, lineColor, lineThickness, onCanvasReady, onError, initialized, isMobile, isIOS]);
  
  // Update canvas properties when tool, color, or thickness changes
  useEffect(() => {
    if (!canvas) return;
    
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;
    
    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    canvas.renderAll();
  }, [canvas, tool, lineColor, lineThickness]);
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas 
        ref={canvasRef}
        className={`${isMobile ? 'touch-optimized-canvas' : ''} ${isIOS ? 'enhanced-grid-ios' : ''}`}
        data-testid="optimized-canvas"
      />
      
      {/* Use specialized mobile grid layer on mobile devices */}
      {isMobile && canvas && (
        <MobileGridLayer 
          canvas={canvas} 
          visible={showGrid}
          onGridCreated={(gridObjects) => {
            console.log(`Created ${gridObjects.length} mobile grid objects`);
          }}
        />
      )}
    </div>
  );
};

export default OptimizedCanvas;
