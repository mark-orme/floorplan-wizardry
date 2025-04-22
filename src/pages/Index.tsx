
import React, { useState, useEffect, useRef } from "react";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { FloorPlanEditor } from "@/components/FloorPlanEditor";
import { AuthSection } from "@/components/auth/AuthSection";
import { CollaborationToggle } from "@/components/collaboration/CollaborationToggle";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { trackComponentLoad, markPerformance } from "@/utils/healthMonitoring";
import { Canvas as FabricCanvas } from "fabric";

export const Index = () => {
  const [enableSync, setEnableSync] = useState(true);
  const { isMobile, isTablet } = useWindowDimensions();
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  
  useEffect(() => {
    trackComponentLoad('IndexPage');
    markPerformance('index-page-mounted');
    
    return () => {
      markPerformance('index-page-unmounted');
    };
  }, []);

  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <CanvasProvider>
        <DrawingProvider canvas={fabricCanvas}>
          <CanvasControllerProvider>
            <AuthSection />
            
            <div className={`px-4 py-2 flex ${isMobile ? 'flex-col space-y-2' : 'items-center justify-end'}`}>
              <CollaborationToggle 
                enabled={enableSync}
                onToggle={setEnableSync}
                isMobile={isMobile}
              />
            </div>
            
            <div className="flex-1 overflow-auto">
              <FloorPlanEditor onCanvasReady={setFabricCanvas} />
            </div>
          </CanvasControllerProvider>
        </DrawingProvider>
      </CanvasProvider>
    </main>
  );
};

export default Index;
