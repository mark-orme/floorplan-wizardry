
import React, { useEffect, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { CanvasControllerEnhanced } from "./controller/CanvasControllerEnhanced";
import { ConnectedDrawingCanvas } from "./ConnectedDrawingCanvas";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { resetGridProgress } from "@/utils/gridManager";
import { DrawingToolbar } from "@/components/DrawingToolbar";
import { DrawingMode } from "@/constants/drawingModes";
import { useDrawingContext } from "@/contexts/DrawingContext";
import { toast } from "sonner";

interface CanvasAppProps {
  setCanvas?: (canvas: FabricCanvas | null) => void;
}

export const CanvasApp: React.FC<CanvasAppProps> = ({ setCanvas }) => {
  // State for GIA (Gross Internal Area)
  const [gia, setGia] = useState<number>(0);
  const { 
    tool, 
    setTool, 
    lineColor, 
    lineThickness, 
    setLineColor, 
    setLineThickness,
    canUndo,
    canRedo,
    setCanUndo,
    setCanRedo
  } = useDrawingContext();
  
  // Reset initialization state when component mounts
  useEffect(() => {
    resetInitializationState();
    resetGridProgress();
    
    return () => {
      // Clean up when component unmounts
      if (setCanvas) {
        setCanvas(null);
      }
    };
  }, [setCanvas]);
  
  // Toolbar action handlers
  const handleToolChange = (newTool: DrawingMode) => {
    setTool(newTool);
    toast.success(`Changed to ${newTool} tool`);
  };
  
  const handleUndo = () => {
    console.log("Undo action");
    toast.info("Undo action");
    // Will implement actual undo functionality later
  };
  
  const handleRedo = () => {
    console.log("Redo action");
    toast.info("Redo action");
    // Will implement actual redo functionality later
  };
  
  const handleZoom = (direction: "in" | "out") => {
    console.log(`Zoom ${direction}`);
    toast.info(`Zoom ${direction}`);
    // Will implement actual zoom functionality later
  };
  
  const handleClear = () => {
    console.log("Clear canvas");
    toast.info("Clear canvas");
    // Will implement actual clear functionality later
  };
  
  const handleSave = () => {
    console.log("Save canvas");
    toast.success("Canvas saved");
    // Will implement actual save functionality later
  };
  
  const handleDelete = () => {
    console.log("Delete selected objects");
    toast.info("Objects deleted");
    // Will implement actual delete functionality later
  };
  
  const handleLineThicknessChange = (thickness: number) => {
    setLineThickness(thickness);
    toast.info(`Line thickness set to ${thickness}`);
  };
  
  const handleLineColorChange = (color: string) => {
    setLineColor(color);
    toast.info(`Line color set to ${color}`);
  };
  
  return (
    <CanvasControllerEnhanced>
      <div className="w-full h-full flex flex-col">
        <div className="p-2 border-b">
          <DrawingToolbar
            tool={tool}
            onToolChange={handleToolChange}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onZoom={handleZoom}
            onClear={handleClear}
            onSave={handleSave}
            onDelete={handleDelete}
            gia={gia}
            lineThickness={lineThickness}
            lineColor={lineColor}
            onLineThicknessChange={handleLineThicknessChange}
            onLineColorChange={handleLineColorChange}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <ConnectedDrawingCanvas 
            width={window.innerWidth - 48}
            height={window.innerHeight - 180} // Adjusted for toolbar height
          />
        </div>
      </div>
    </CanvasControllerEnhanced>
  );
};
