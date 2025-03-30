
import React, { useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { CanvasControllerEnhanced } from "./controller/CanvasControllerEnhanced";
import { ConnectedDrawingCanvas } from "./ConnectedDrawingCanvas";
import { resetInitializationState } from "@/utils/canvas/safeCanvasInitialization";
import { resetGridProgress } from "@/utils/gridManager";

interface CanvasAppProps {
  setCanvas?: (canvas: FabricCanvas | null) => void;
}

export const CanvasApp: React.FC<CanvasAppProps> = ({ setCanvas }) => {
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
  
  return (
    <CanvasControllerEnhanced>
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ConnectedDrawingCanvas 
            width={window.innerWidth - 48}
            height={window.innerHeight - 120}
          />
        </div>
      </div>
    </CanvasControllerEnhanced>
  );
};
