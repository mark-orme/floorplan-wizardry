
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

/**
 * FloorPlans page component
 * Provides the floor plan editor with proper context providers
 * @returns {JSX.Element} Rendered component
 */
const FloorPlans = () => {
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);

  // Reset canvas initialization state when the page loads
  useEffect(() => {
    resetInitializationState();
    resetGridProgress();
    
    // Log a welcome message
    toast.success("Floor Plan Editor loaded with enhanced drawing tools", {
      duration: 3000,
      id: "floor-plan-welcome"
    });
  }, []);
  
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <div className="flex items-center p-2 bg-muted/30 border-b">
        <h1 className="text-xl font-bold">Floor Plan Editor</h1>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <DrawingProvider>
          <CanvasProvider>
            <CanvasControllerProvider>
              <CanvasApp 
                setCanvas={setCanvas} 
              />
            </CanvasControllerProvider>
          </CanvasProvider>
        </DrawingProvider>
      </div>
    </main>
  );
};

export default FloorPlans;
