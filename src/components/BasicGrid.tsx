
import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createSimpleGrid, ensureGridVisible } from "@/utils/simpleGridCreator";
import { toast } from "sonner";

interface BasicGridProps {
  fabricCanvas: FabricCanvas | null;
}

export const BasicGrid: React.FC<BasicGridProps> = ({ fabricCanvas }) => {
  const gridObjectsRef = useRef<FabricObject[]>([]);
  
  // Create grid when canvas becomes available
  useEffect(() => {
    if (!fabricCanvas) return;
    
    console.log("BasicGrid: Canvas available, creating grid");
    
    // Short delay to ensure canvas is fully initialized
    const timeout = setTimeout(() => {
      try {
        const objects = createSimpleGrid(fabricCanvas, gridObjectsRef.current);
        gridObjectsRef.current = objects;
        
        if (objects.length > 0) {
          console.log(`Grid created with ${objects.length} objects`);
          toast.success("Grid created successfully");
        } else {
          console.error("Grid creation returned 0 objects");
          toast.error("Failed to create grid");
        }
      } catch (error) {
        console.error("Error creating grid in BasicGrid component:", error);
        toast.error("Error creating grid");
      }
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [fabricCanvas]);
  
  // Periodic check to ensure grid is visible
  useEffect(() => {
    if (!fabricCanvas) return;
    
    const interval = setInterval(() => {
      if (gridObjectsRef.current.length > 0) {
        ensureGridVisible(fabricCanvas, gridObjectsRef.current);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [fabricCanvas]);

  // This is a non-visual component that manages grid
  return null;
};
