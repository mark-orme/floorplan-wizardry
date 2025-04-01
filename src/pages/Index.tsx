
import { useState, useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Grid, EyeOff } from "lucide-react";
import { CanvasApp } from "@/components/canvas/CanvasApp";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { toast } from "sonner";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { ensureGridVisibility, setGridVisibility } from "@/utils/grid/gridVisibility";
import { createCompleteGrid } from "@/utils/grid/gridRenderers";

/**
 * Main Index page component
 * Provides the layout and navigation for the floor plan editor
 * @returns {JSX.Element} Rendered component
 */
const Index = () => {
  const navigate = useNavigate();
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [showGridDebug, setShowGridDebug] = useState<boolean>(true);
  const gridInitializedRef = useRef<boolean>(false);
  
  // Reset canvas initialization state when the page loads
  useEffect(() => {
    resetInitializationState();
    
    // Log a welcome message
    toast.success("Floor Plan Editor loaded with enhanced drawing tools", {
      duration: 3000,
      id: "floor-plan-welcome"
    });
  }, []);
  
  // Force grid creation when canvas is available
  useEffect(() => {
    if (!canvas || gridInitializedRef.current) return;
    
    // Wait for canvas to be fully initialized
    const timer = setTimeout(() => {
      try {
        // Create grid with complete renderer
        const gridObjects = createCompleteGrid(canvas);
        
        if (gridObjects && gridObjects.length > 0) {
          gridInitializedRef.current = true;
          toast.success(`Grid created with ${gridObjects.length} objects`);
          
          // Make sure grid is visible
          setGridVisibility(canvas, true, gridObjects);
          canvas.requestRenderAll();
        }
      } catch (error) {
        toast.error("Failed to initialize grid");
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [canvas]);
  
  // Ensure grid visibility less frequently
  useEffect(() => {
    if (!canvas) return;
    
    // Check grid visibility once at initialization
    const initialCheck = setTimeout(() => {
      ensureGridVisibility(canvas);
    }, 2000);
    
    // Then check much less frequently to reduce console spam
    const intervalId = setInterval(() => {
      ensureGridVisibility(canvas);
    }, 30000); // Reduced from every 10 seconds to every 30 seconds
    
    return () => {
      clearTimeout(initialCheck);
      clearInterval(intervalId);
    };
  }, [canvas]);
  
  // Toggle grid debug overlay
  const toggleGridDebug = () => {
    setShowGridDebug(prev => !prev);
    toast.info(showGridDebug ? "Grid debug hidden" : "Grid debug visible");
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
        
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleGridDebug}
            className="flex items-center"
          >
            {showGridDebug ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide Debug
              </>
            ) : (
              <>
                <Grid className="h-4 w-4 mr-1" />
                Show Debug
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <DrawingProvider>
          <CanvasProvider>
            <CanvasControllerProvider>
              <CanvasApp setCanvas={setCanvas} showGridDebug={showGridDebug} />
            </CanvasControllerProvider>
          </CanvasProvider>
        </DrawingProvider>
      </div>
    </main>
  );
};

export default Index;
