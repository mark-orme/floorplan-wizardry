
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
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;
  const canvasStableRef = useRef<boolean>(false);
  
  // Reset canvas initialization state when the page loads
  useEffect(() => {
    console.log("Index page mounted - resetting initialization state");
    resetInitializationState();
    gridInitializedRef.current = false;
    canvasStableRef.current = false;
    retryCountRef.current = 0;
    
    // Log a welcome message
    toast.success("Floor Plan Editor loaded with enhanced drawing tools", {
      duration: 3000,
      id: "floor-plan-welcome"
    });
    
    return () => {
      console.log("Index page unmounting - cleanup");
      // Any additional cleanup
    };
  }, []);
  
  // Ensure canvas is properly tracked and stable before grid creation
  useEffect(() => {
    if (!canvas) {
      console.log("Canvas not available yet");
      return;
    }

    console.log("Canvas reference received:", !!canvas);
    
    // Wait to confirm canvas is stable before attempting grid creation
    const stabilityTimer = setTimeout(() => {
      canvasStableRef.current = true;
      console.log("Canvas marked as stable after delay");
    }, 500);
    
    return () => {
      clearTimeout(stabilityTimer);
    };
  }, [canvas]);
  
  // Separate effect for grid creation to ensure it only runs after canvas is stable
  useEffect(() => {
    if (!canvas || !canvasStableRef.current || gridInitializedRef.current) {
      return;
    }
    
    console.log("Attempting grid creation on stable canvas");
    
    const createGridWithRetry = () => {
      try {
        // Validate canvas dimensions
        if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
          throw new Error("Invalid canvas dimensions for grid creation");
        }

        console.log("Creating grid with dimensions:", canvas.width, "x", canvas.height);
        
        // Create grid with complete renderer
        const gridObjects = createCompleteGrid(canvas);
        
        if (gridObjects && gridObjects.length > 0) {
          gridInitializedRef.current = true;
          console.log(`Grid created successfully with ${gridObjects.length} objects`);
          
          // Force grid objects to be visible and bring to back
          gridObjects.forEach(obj => {
            obj.set('visible', true);
          });
          
          // Re-render the canvas after setting visibility
          canvas.requestRenderAll();
          
          toast.success(`Grid created with ${gridObjects.length} objects`);
        } else {
          throw new Error("Grid creation returned no objects");
        }
      } catch (error) {
        console.error("Grid creation error:", error);
        
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          console.log(`Retrying grid creation (attempt ${retryCountRef.current}/${maxRetries})`);
          
          // Retry after a delay
          setTimeout(createGridWithRetry, 1000);
        } else {
          toast.error("Failed to initialize grid after multiple attempts");
        }
      }
    };
    
    // Start grid creation with 500ms delay to ensure canvas is ready
    const timer = setTimeout(createGridWithRetry, 500);
    
    return () => clearTimeout(timer);
  }, [canvas, canvasStableRef.current]);
  
  // Infrequent grid visibility check
  useEffect(() => {
    if (!canvas) return;
    
    // Check grid visibility once at initialization with a delay
    const initialCheck = setTimeout(() => {
      if (canvas && gridInitializedRef.current) {
        console.log("Performing initial grid visibility check");
        ensureGridVisibility(canvas);
      }
    }, 2000);
    
    return () => {
      clearTimeout(initialCheck);
    };
  }, [canvas]);
  
  // Toggle grid debug overlay
  const toggleGridDebug = () => {
    setShowGridDebug(prev => !prev);
    
    if (canvas) {
      // Toggle grid visibility based on showGridDebug state
      setGridVisibility(canvas, !showGridDebug);
      toast.info(showGridDebug ? "Grid debug hidden" : "Grid debug visible");
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
