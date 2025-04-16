
/**
 * Updated FloorPlans page component
 * Uses the enhanced canvas with improved grid and drawing integration
 */
import React, { useEffect, useState } from "react";
import { CanvasApp } from "@/components/canvas/CanvasApp";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { resetGridProgress } from "@/utils/gridManager";
import { toast } from "sonner";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { DrawingMode } from "@/constants/drawingModes";

/**
 * FloorPlans page component
 * Provides the floor plan editor with proper context providers
 * @returns {JSX.Element} Rendered component
 */
const FloorPlans = () => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [enableSync, setEnableSync] = useState<boolean>(true);

  // Reset canvas initialization state when the page loads
  useEffect(() => {
    resetInitializationState();
    resetGridProgress();
    
    // Log a welcome message
    toast.success("Floor Plan Editor loaded with enhanced drawing tools", {
      duration: 3000,
      id: "floor-plan-welcome"
    });
    
    // Enable realtime sync by default
    if (!enableSync) {
      setEnableSync(true);
    }
  }, [enableSync]);
  
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <div className="flex items-center justify-between p-2 bg-muted/30 border-b">
        <h1 className="text-xl font-bold">Floor Plan Editor</h1>
        
        {/* Realtime collaboration toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Realtime Collaboration
          </span>
          <button 
            className={`px-3 py-1 rounded-md text-sm ${enableSync ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setEnableSync(!enableSync)}
          >
            {enableSync ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <DrawingProvider>
          <CanvasProvider>
            <CanvasControllerProvider>
              <CanvasApp 
                setCanvas={setCanvas}
                tool={DrawingMode.SELECT}
                enableSync={enableSync}
              />
            </CanvasControllerProvider>
          </CanvasProvider>
        </DrawingProvider>
      </div>
    </main>
  );
};

export default FloorPlans;
