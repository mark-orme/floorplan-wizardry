
import { useState, useEffect } from "react";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { CanvasApp } from "@/components/canvas/CanvasApp";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { GridMonitor } from "@/components/canvas/GridMonitor";
import { useCanvasRefs } from "@/hooks/useCanvasRefs"; // Updated import (extension change happens automatically)
import { toast } from "sonner";

/**
 * Main Index page component
 * Provides the layout and navigation for the floor plan editor
 * @returns {JSX.Element} Rendered component
 */
const Index = () => {
  const navigate = useNavigate();
  const { fabricCanvasRef, gridLayerRef } = useCanvasRefs();
  const [enableGridMonitoring, setEnableGridMonitoring] = useState(true);
  
  // Reset canvas initialization state when the page loads
  useEffect(() => {
    resetInitializationState();
    
    // Log a welcome message with enhanced grid stability
    toast.success("Floor Plan Editor loaded with enhanced grid stability", {
      duration: 3000,
      id: "floor-plan-welcome"
    });
  }, []);
  
  return (
    <main className="flex flex-col w-full min-h-screen bg-background">
      <div className="flex items-center p-2 bg-muted/30 border-b">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/properties')}
          className="mr-2"
        >
          <Home className="h-4 w-4 mr-1" />
          Back to Properties
        </Button>
        <h1 className="text-xl font-bold">Floor Plan Editor</h1>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <CanvasControllerProvider>
          <CanvasApp />
          {/* Add the GridMonitor component for background grid monitoring */}
          <GridMonitor 
            fabricCanvasRef={fabricCanvasRef}
            gridLayerRef={gridLayerRef}
            active={enableGridMonitoring}
          />
        </CanvasControllerProvider>
      </div>
    </main>
  );
};

export default Index;
