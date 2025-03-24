
/**
 * Custom hook for managing canvas tools and interactions
 * @module useCanvasTools
 */
import { useCallback, useEffect } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { toast } from "sonner";
import { clearCanvasObjects } from "@/utils/fabricHelpers";
import { enablePanning } from "@/utils/fabric";
import { DrawingTool } from "./useCanvasState";

interface UseCanvasToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  tool: DrawingTool;
  zoomLevel: number;
  lineThickness: number;
  lineColor: string;
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  createGrid: (canvas: FabricCanvas) => any[];
}

/**
 * Hook for managing canvas tools and interactions
 * @param {UseCanvasToolsProps} props - Hook properties
 * @returns {Object} Canvas tool operations
 */
export const useCanvasTools = ({
  fabricCanvasRef,
  gridLayerRef,
  tool,
  zoomLevel,
  lineThickness,
  lineColor,
  setTool,
  setZoomLevel,
  createGrid
}: UseCanvasToolsProps) => {
  /**
   * Clear all drawings from the canvas while preserving the grid
   */
  const clearDrawings = useCallback(() => {
    if (!fabricCanvasRef.current) {
      console.error("Cannot clear drawings: fabric canvas is null");
      return;
    }
    
    const gridObjects = [...gridLayerRef.current];
    
    clearCanvasObjects(fabricCanvasRef.current, gridObjects);
    
    if (gridObjects.length === 0 || !fabricCanvasRef.current.contains(gridObjects[0])) {
      console.log("Recreating grid during clearDrawings...");
      createGrid(fabricCanvasRef.current);
    }
    
    fabricCanvasRef.current.renderAll();
  }, [fabricCanvasRef, gridLayerRef, createGrid]);
  
  /**
   * Change the current drawing tool
   * @param {DrawingTool} newTool - The tool to switch to
   */
  const handleToolChange = useCallback((newTool: DrawingTool) => {
    setTool(newTool);
    if (fabricCanvasRef.current) {
      // Set drawing mode based on the tool selected
      const isDrawingTool = newTool !== "hand";
      fabricCanvasRef.current.isDrawingMode = isDrawingTool;
      
      // Configure the hand tool for panning when selected
      enablePanning(fabricCanvasRef.current, newTool === "hand");
      
      // Set appropriate brush for drawing tools
      if (isDrawingTool) {
        fabricCanvasRef.current.freeDrawingBrush = new PencilBrush(fabricCanvasRef.current);
        fabricCanvasRef.current.freeDrawingBrush.color = lineColor;
        fabricCanvasRef.current.freeDrawingBrush.width = lineThickness;
        
        // Adjust the smoothness and precision of the drawing
        if (fabricCanvasRef.current.freeDrawingBrush instanceof PencilBrush) {
          // Slightly lower the decimate parameter for more points (better auto-straightening)
          fabricCanvasRef.current.freeDrawingBrush.decimate = 2;
        }
      }
      
      // Ensure grid elements are in the correct z-order
      const gridElements = gridLayerRef.current;
      const allObjects = fabricCanvasRef.current.getObjects();
      
      // Find grid markers (scale indicators)
      const gridMarkers = gridElements.filter(obj => 
        obj.type === 'line' && obj.strokeWidth === 2 || 
        obj.type === 'text');
      
      // Find grid lines
      const gridLines = gridElements.filter(obj => 
        obj.type === 'line' && obj.strokeWidth !== 2);
      
      // First send all grid lines to the back
      gridLines.forEach(line => {
        fabricCanvasRef.current!.sendObjectToBack(line);
      });
      
      // Then bring markers above grid lines but below drawings
      const drawingObjects = allObjects.filter(obj => 
        obj.type === 'polyline' || obj.type === 'path');
        
      if (drawingObjects.length > 0) {
        // Place markers below the lowest drawing object
        gridMarkers.forEach(marker => {
          fabricCanvasRef.current!.moveTo(marker, 
            fabricCanvasRef.current!.getObjects().indexOf(drawingObjects[0]));
        });
      } else {
        // If no drawings, bring markers to front
        gridMarkers.forEach(marker => {
          fabricCanvasRef.current!.bringObjectToFront(marker);
        });
      }
      
      fabricCanvasRef.current.renderAll();
      
      // Provide user feedback
      const toolNames = {
        "draw": "Freehand (with auto-straightening)",
        "room": "Room",
        "straightLine": "Wall",
        "hand": "Hand (Pan)"
      };
      toast.success(`${toolNames[newTool]} tool selected`);
    }
  }, [fabricCanvasRef, gridLayerRef, setTool, lineThickness, lineColor]);

  /**
   * Zoom the canvas in or out
   * @param {string} direction - The zoom direction ("in" or "out")
   */
  const handleZoom = useCallback((direction: "in" | "out") => {
    if (!fabricCanvasRef.current) return;
    const factor = direction === "in" ? 1.1 : 0.9;
    const newZoom = zoomLevel * factor;
    
    // Limit zoom range for usability
    if (newZoom >= 0.5 && newZoom <= 3) {
      fabricCanvasRef.current.setZoom(newZoom);
      setZoomLevel(newZoom);
      toast(`Zoom: ${Math.round(newZoom * 100)}%`);
    } else {
      toast("Zoom limit reached");
    }
  }, [fabricCanvasRef, zoomLevel, setZoomLevel]);

  // Set up panning when hand tool is selected
  useEffect(() => {
    if (fabricCanvasRef.current) {
      enablePanning(fabricCanvasRef.current, tool === "hand");
      
      // Ensure grid elements are in the correct z-order when tool changes
      setTimeout(() => {
        if (fabricCanvasRef.current) {
          // Ensure all grid elements are in the right order
          const gridElements = gridLayerRef.current;
          
          // Find markers (scale indicators)
          const gridMarkers = gridElements.filter(obj => 
            obj.type === 'line' && obj.strokeWidth === 2 || 
            obj.type === 'text');
            
          // Find grid lines
          const gridLines = gridElements.filter(obj => 
            obj.type === 'line' && obj.strokeWidth !== 2);
          
          // First send all grid lines to the back
          gridLines.forEach(line => {
            if (fabricCanvasRef.current?.contains(line)) {
              fabricCanvasRef.current.sendObjectToBack(line);
            }
          });
          
          // Then bring markers to the front
          gridMarkers.forEach(marker => {
            if (fabricCanvasRef.current?.contains(marker)) {
              fabricCanvasRef.current.bringObjectToFront(marker);
            }
          });
          
          fabricCanvasRef.current.renderAll();
        }
      }, 100);
    }
  }, [fabricCanvasRef, gridLayerRef, tool]);

  return {
    clearDrawings,
    handleToolChange,
    handleZoom
  };
};
