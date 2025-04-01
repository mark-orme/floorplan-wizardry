
import React, { useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Grid, RefreshCw, Eye, EyeOff } from "lucide-react";

interface GridMonitorProps {
  canvas: FabricCanvas;
  gridObjects: FabricObject[];
  createGrid: () => void;
  visible?: boolean;
}

export const GridMonitor: React.FC<GridMonitorProps> = ({
  canvas,
  gridObjects,
  createGrid,
  visible = false
}) => {
  const [gridVisible, setGridVisible] = useState(true);
  
  if (!visible) return null;
  
  // Toggle grid visibility
  const toggleGridVisibility = () => {
    if (!canvas) return;
    
    const newVisibility = !gridVisible;
    setGridVisible(newVisibility);
    
    // Update all grid objects visibility
    gridObjects.forEach(obj => {
      obj.set('visible', newVisibility);
    });
    
    canvas.requestRenderAll();
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white rounded-md shadow-md p-3 text-xs">
      <div className="flex items-center mb-2 font-semibold">
        <Grid className="w-4 h-4 mr-1" />
        Grid Monitor
        <Badge variant="outline" className="ml-2">
          {gridObjects.length} objects
        </Badge>
      </div>
      
      <Separator className="my-2" />
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs"
          onClick={createGrid}
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Recreate
        </Button>
        
        <Button 
          size="sm" 
          variant={gridVisible ? "default" : "outline"} 
          className="text-xs"
          onClick={toggleGridVisibility}
        >
          {gridVisible ? (
            <>
              <EyeOff className="w-3 h-3 mr-1" />
              Hide
            </>
          ) : (
            <>
              <Eye className="w-3 h-3 mr-1" />
              Show
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
