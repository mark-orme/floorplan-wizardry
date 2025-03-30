
import React, { useEffect, useRef } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createSimpleGrid, ensureGridVisible } from "@/utils/simpleGridCreator";
import { toast } from "sonner";

interface BasicGridProps {
  fabricCanvas: FabricCanvas | null;
}

export const BasicGrid: React.FC<BasicGridProps> = ({ fabricCanvas }) => {
  const gridObjectsRef = useRef<FabricObject[]>([]);
  const initializationAttemptRef = useRef<number>(0);
  const checkIntervalRef = useRef<number | null>(null);
  
  // Create grid when canvas becomes available
  useEffect(() => {
    if (!fabricCanvas) return;
    
    console.log("BasicGrid: Canvas available, creating grid");
    
    // Clear any existing check interval
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    
    // Function to create the grid
    const createGridOnCanvas = () => {
      try {
        console.log(`Attempting to create grid (attempt ${initializationAttemptRef.current + 1})`);
        initializationAttemptRef.current += 1;
        
        // Get current dimensions
        const width = fabricCanvas.width;
        const height = fabricCanvas.height;
        console.log(`Canvas dimensions: ${width}x${height}`);
        
        if (!width || !height || width < 10 || height < 10) {
          console.error("Canvas has invalid dimensions, delaying grid creation");
          return false; // Failed to create grid
        }
        
        // Create the grid
        const objects = createSimpleGrid(fabricCanvas, gridObjectsRef.current);
        gridObjectsRef.current = objects;
        
        if (objects.length > 0) {
          console.log(`Grid created with ${objects.length} objects`);
          toast.success("Grid created successfully");
          return true; // Grid created successfully
        } else {
          console.error("Grid creation returned 0 objects");
          toast.error("Failed to create grid");
          return false; // Failed to create grid
        }
      } catch (error) {
        console.error("Error creating grid in BasicGrid component:", error);
        toast.error("Error creating grid");
        return false; // Failed to create grid
      }
    };
    
    // Try to create grid initially with a short delay
    const initialTimeout = setTimeout(() => {
      const success = createGridOnCanvas();
      
      // If initial creation failed, set up periodic checks
      if (!success && initializationAttemptRef.current < 5) {
        checkIntervalRef.current = window.setInterval(() => {
          const success = createGridOnCanvas();
          
          // Stop trying after success or too many attempts
          if (success || initializationAttemptRef.current >= 5) {
            if (checkIntervalRef.current) {
              clearInterval(checkIntervalRef.current);
              checkIntervalRef.current = null;
            }
          }
        }, 1000);
      }
    }, 300);
    
    // Periodic check to ensure grid is visible
    const visibilityInterval = setInterval(() => {
      if (gridObjectsRef.current.length > 0) {
        const fixed = ensureGridVisible(fabricCanvas, gridObjectsRef.current);
        if (fixed) {
          console.log("Fixed grid visibility");
        }
      }
    }, 3000);
    
    return () => {
      clearTimeout(initialTimeout);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      clearInterval(visibilityInterval);
    };
  }, [fabricCanvas]);

  // This is a non-visual component that manages grid
  return null;
};
