
import React, { useEffect, useState } from "react";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { CanvasApp } from "@/components/canvas/CanvasApp";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { toast } from "sonner";
import { Canvas as FabricCanvas } from "fabric";
import { SimpleGrid } from "@/components/canvas/grid/SimpleGrid";

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
    
    // Log a welcome message
    toast.success("Floor Plan Editor loaded", {
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
        <CanvasControllerProvider>
          <CanvasApp setCanvas={setCanvas} />
          
          {/* Add SimpleGrid component if canvas is available */}
          {canvas && (
            <SimpleGrid
              canvas={canvas}
              showControls={true}
              defaultVisible={true}
            />
          )}
        </CanvasControllerProvider>
      </div>
    </main>
  );
};

export default FloorPlans;
