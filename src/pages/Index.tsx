
import React, { useState, useEffect } from "react";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { EditorHeader } from "@/components/canvas/EditorHeader";
import { EditorContent } from "@/components/canvas/EditorContent";
import { AuthSection } from "@/components/auth/AuthSection";
import { CollaborationToggle } from "@/components/collaboration/CollaborationToggle";
import { useWindowDimensions } from "@/hooks/useWindowDimensions";
import { trackComponentLoad, markPerformance } from "@/utils/healthMonitoring";

export const Index = () => {
  const [enableSync, setEnableSync] = useState(true);
  const { isMobile, isTablet } = useWindowDimensions();

  // Track page load in health monitoring
  useEffect(() => {
    trackComponentLoad('IndexPage');
    markPerformance('index-page-mounted');
    
    return () => {
      markPerformance('index-page-unmounted');
    };
  }, []);
  
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <DrawingProvider>
        <CanvasProvider>
          <CanvasControllerProvider>
            <AuthSection />
            
            <div className={`px-4 py-2 flex ${isMobile ? 'flex-col space-y-2' : 'items-center justify-end'}`}>
              <CollaborationToggle 
                enabled={enableSync}
                onToggle={setEnableSync}
                isMobile={isMobile}
              />
            </div>

            <EditorHeader 
              isMobile={isMobile}
              isTablet={isTablet}
            />
            
            <EditorContent enableSync={enableSync} />
          </CanvasControllerProvider>
        </CanvasProvider>
      </DrawingProvider>
    </main>
  );
};

export default Index;
