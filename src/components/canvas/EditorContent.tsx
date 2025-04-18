
import React, { useEffect, useState } from 'react';
import { OptimizedCanvasController } from '@/components/OptimizedCanvasController';
import { ToolSelector } from '@/components/canvas/ToolSelector';
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
}

export const EditorContent: React.FC<EditorContentProps> = ({
  forceRefreshKey,
  setCanvas,
  showGridDebug,
  tool,
  lineThickness,
  lineColor,
  enableSync = true
}) => {
  const isMobile = useIsMobile();
  const [canvasReady, setCanvasReady] = useState(false);
  
  // Default canvas dimensions - adjust for mobile
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 600
  });
  
  // Adjust dimensions based on device
  useEffect(() => {
    if (isMobile) {
      // Get dimensions that fit the mobile viewport
      const mobileWidth = Math.min(window.innerWidth - 32, 800);
      const mobileHeight = Math.min(window.innerHeight - 120, 600);
      
      setDimensions({
        width: mobileWidth,
        height: mobileHeight
      });
    } else {
      // Use default dimensions for desktop
      setDimensions({
        width: 800,
        height: 600
      });
    }
  }, [isMobile]);
  
  // Handle canvas ready
  const handleCanvasReady = (canvas: FabricCanvas) => {
    setCanvas(canvas);
    setCanvasReady(true);
    
    // Show mobile-specific toast message
    if (isMobile) {
      toast.info("Use two fingers to pan and zoom. Tap and hold to select objects.", {
        duration: 5000,
        id: "mobile-canvas-tips"
      });
    }
  };
  
  // Handle canvas error
  const handleCanvasError = (error: Error) => {
    console.error("Canvas error:", error);
    toast.error("Failed to initialize drawing canvas");
  };
  
  return (
    <div className="flex-1 overflow-hidden relative">
      <div className="w-full h-full relative flex items-center justify-center bg-background">
        <div 
          className={`relative ${isMobile ? 'w-full h-full p-2' : 'w-[800px] h-[600px]'}`}
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
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <ToolSelector 
                activeTool={tool} 
                onToolChange={() => {}} // We'll handle changes via parent
                orientation="horizontal"
                compact={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
