
import React, { useState, useEffect } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { Button } from "@/components/ui/button";
import { Loader2, Bug, RefreshCw } from "lucide-react";
import { createBasicEmergencyGrid, verifyGridExists } from '@/utils/gridCreationUtils';
import { toast } from 'sonner';

interface GridDebugPanelProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  visible?: boolean;
}

export const GridDebugPanel: React.FC<GridDebugPanelProps> = ({
  fabricCanvasRef,
  gridLayerRef,
  visible = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [gridStatus, setGridStatus] = useState({
    exists: false,
    count: 0,
    onCanvas: 0,
    canvasValid: false
  });
  
  // Update grid status periodically
  useEffect(() => {
    if (!visible) return;
    
    const checkGridStatus = () => {
      try {
        const canvas = fabricCanvasRef.current;
        const isCanvasValid = !!canvas && 
          (canvas.width > 0) && 
          (canvas.height > 0) && 
          typeof canvas.add === 'function';
        
        const gridExists = gridLayerRef.current?.length > 0;
        const gridObjectsOnCanvas = canvas ? 
          gridLayerRef.current.filter(obj => canvas.contains(obj)).length : 0;
        
        setGridStatus({
          exists: gridExists,
          count: gridLayerRef.current?.length || 0,
          onCanvas: gridObjectsOnCanvas,
          canvasValid: isCanvasValid
        });
      } catch (error) {
        console.error("Error checking grid status:", error);
      }
    };
    
    // Check immediately
    checkGridStatus();
    
    // Then check every second
    const interval = setInterval(checkGridStatus, 1000);
    
    return () => clearInterval(interval);
  }, [fabricCanvasRef, gridLayerRef, visible]);
  
  // Force create grid
  const handleForceCreateGrid = async () => {
    setIsLoading(true);
    
    try {
      const canvas = fabricCanvasRef.current;
      
      if (!canvas) {
        toast.error("Canvas is not available");
        return;
      }
      
      // Clear existing grid objects
      if (gridLayerRef.current?.length > 0) {
        gridLayerRef.current.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
        gridLayerRef.current = [];
      }
      
      console.log("Creating emergency grid from debug panel");
      const gridObjects = createBasicEmergencyGrid(canvas, gridLayerRef);
      
      if (gridObjects.length > 0) {
        toast.success(`Created ${gridObjects.length} grid objects`);
        canvas.renderAll();
      } else {
        toast.error("Failed to create grid objects");
      }
    } catch (error) {
      console.error("Error creating grid:", error);
      toast.error("Error creating grid");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check if grid exists
  const handleVerifyGrid = () => {
    setIsLoading(true);
    
    try {
      const exists = verifyGridExists(fabricCanvasRef.current, gridLayerRef);
      
      if (exists) {
        toast.success("Grid exists and is attached to canvas");
      } else {
        toast.error("Grid is missing or not attached to canvas");
      }
    } catch (error) {
      console.error("Error verifying grid:", error);
      toast.error("Error checking grid");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!visible) return null;
  
  return (
    <div className="absolute right-4 bottom-4 z-50 bg-white/90 dark:bg-gray-800/90 p-3 rounded-md shadow-md border border-gray-200 dark:border-gray-700 text-xs">
      <div className="mb-2 flex items-center space-x-1">
        <Bug className="h-3 w-3" />
        <span className="font-semibold">Grid Debug</span>
      </div>
      
      <div className="space-y-1 mb-2">
        <div className="flex justify-between">
          <span>Canvas:</span>
          <span className={gridStatus.canvasValid ? "text-green-500" : "text-red-500"}>
            {gridStatus.canvasValid ? "Valid" : "Invalid"}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Grid objects:</span>
          <span>{gridStatus.count}</span>
        </div>
        
        <div className="flex justify-between">
          <span>On canvas:</span>
          <span>{gridStatus.onCanvas}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-6 text-xs px-2"
          onClick={handleForceCreateGrid}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-3 w-3 mr-1" />
          )}
          Create Grid
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="h-6 text-xs px-2"
          onClick={handleVerifyGrid}
          disabled={isLoading}
        >
          Verify
        </Button>
      </div>
    </div>
  );
};
