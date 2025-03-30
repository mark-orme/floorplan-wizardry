
import { useState, useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { CanvasApp } from "@/components/canvas/CanvasApp";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { GridMonitor } from "@/components/canvas/GridMonitor";
import { SimpleGrid } from "@/components/canvas/grid/SimpleGrid";
import { toast } from "sonner";

/**
 * Main Index page component
 * Provides the layout and navigation for the floor plan editor
 * @returns {JSX.Element} Rendered component
 */
const Index = () => {
  const navigate = useNavigate();
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
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
  
  const setCanvasInstance = (canvas: FabricCanvas | null) => {
    fabricCanvasRef.current = canvas;
    
    // Create grid immediately when canvas is available
    if (canvas) {
      setTimeout(() => {
        const component = document.getElementById('canvas-grid-component');
        if (!component && canvas) {
          // Manually mount a SimpleGrid if not already present
          const gridInstance = new SimpleGrid({
            canvas,
            showControls: false,
            defaultVisible: true,
            onGridCreated: (objects) => {
              gridLayerRef.current = objects;
            }
          });
          
          // Store reference to grid objects
          if (gridInstance && typeof gridInstance === 'object') {
            const gridObjects = gridLayerRef.current;
            console.log(`Grid initialized with ${gridObjects.length} objects`);
          }
        }
      }, 200);
    }
  };
  
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
          <CanvasApp setCanvas={setCanvasInstance} />
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
