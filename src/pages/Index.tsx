
import { useState, useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { CanvasControllerProvider } from "@/components/canvas/controller/CanvasController";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Grid, EyeOff, RefreshCw } from "lucide-react";
import { CanvasApp } from "@/components/canvas/CanvasApp";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { toast } from "sonner";
import { CanvasProvider } from "@/contexts/CanvasContext";
import { DrawingProvider } from "@/contexts/DrawingContext";
import { 
  ensureGridVisibility, 
  setGridVisibility,
  forceGridCreationAndVisibility 
} from "@/utils/grid/gridVisibility";
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
  const [forceRefreshKey, setForceRefreshKey] = useState<number>(0);
  const gridInitializedRef = useRef<boolean>(false);
  const retryCountRef = useRef<number>(0);
  const maxRetries = 3;
  const canvasStableRef = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(true);
  
  // Reset canvas initialization state when the page loads
  useEffect(() => {
    console.log("Index page mounted - resetting initialization state");
    resetInitializationState();
    gridInitializedRef.current = false;
    canvasStableRef.current = false;
    retryCountRef.current = 0;
    mountedRef.current = true;
    
    // Log a welcome message
    toast.success("Floor Plan Editor loaded with enhanced grid system", {
      duration: 3000,
      id: "floor-plan-welcome"
    });
    
    return () => {
      console.log("Index page unmounting - cleanup");
      mountedRef.current = false;
    };
  }, [forceRefreshKey]);
  
  // Ensure canvas is properly tracked and stable before grid creation
  useEffect(() => {
    if (!canvas) {
      console.log("Canvas not available yet");
      return;
    }

    console.log("Canvas reference received:", !!canvas);
    
    // Wait to confirm canvas is stable before attempting grid creation
    const stabilityTimer = setTimeout(() => {
      if (mountedRef.current) {
        canvasStableRef.current = true;
        console.log("Canvas marked as stable after delay");
      }
    }, 1000);
    
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
        let gridSuccess = false;
        
        // Try normal grid creation first
        const gridObjects = createCompleteGrid(canvas);
        
        if (gridObjects && gridObjects.length > 0) {
          gridInitializedRef.current = true;
          console.log(`Grid created successfully with ${gridObjects.length} objects`);
          
          // Force grid objects to be visible
          gridObjects.forEach(obj => {
            obj.set('visible', true);
          });
          
          // Re-render the canvas after setting visibility
          canvas.renderAll();
          canvas.requestRenderAll();
          
          toast.success(`Grid created with ${gridObjects.length} objects`);
          gridSuccess = true;
        } 
        
        // If normal grid creation failed, try forced approach
        if (!gridSuccess) {
          console.log("Standard grid creation failed, trying forced approach");
          if (forceGridCreationAndVisibility(canvas)) {
            gridInitializedRef.current = true;
            toast.success("Grid created with emergency approach");
            gridSuccess = true;
          } else {
            throw new Error("Both standard and emergency grid creation failed");
          }
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
    
    // Start grid creation with delay to ensure canvas is ready
    const timer = setTimeout(createGridWithRetry, 1000);
    
    return () => clearTimeout(timer);
  }, [canvas, canvasStableRef.current]);
  
  // Check grid visibility periodically
  useEffect(() => {
    if (!canvas) return;
    
    // Initial check with delay
    const initialCheck = setTimeout(() => {
      if (canvas) {
        console.log("Performing initial grid visibility check");
        ensureGridVisibility(canvas);
      }
    }, 2000);
    
    // Periodic check every 5 seconds
    const intervalCheck = setInterval(() => {
      if (canvas && mountedRef.current) {
        ensureGridVisibility(canvas);
      }
    }, 5000);
    
    return () => {
      clearTimeout(initialCheck);
      clearInterval(intervalCheck);
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
  
  // Force refresh the canvas and grid
  const handleForceRefresh = () => {
    if (canvas) {
      toast.info("Forcing grid recreation...");
      forceGridCreationAndVisibility(canvas);
    } else {
      // If no canvas, force complete component refresh
      toast.info("Forcing complete refresh...");
      setForceRefreshKey(prev => prev + 1);
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
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleForceRefresh}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Force Refresh
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <DrawingProvider>
          <CanvasProvider>
            <CanvasControllerProvider>
              <CanvasApp 
                key={`canvas-app-${forceRefreshKey}`}
                setCanvas={setCanvas} 
                showGridDebug={showGridDebug} 
              />
            </CanvasControllerProvider>
          </CanvasProvider>
        </DrawingProvider>
      </div>
    </main>
  );
};

export default Index;
