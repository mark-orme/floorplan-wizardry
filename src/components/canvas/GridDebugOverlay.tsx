
import React from "react";
import { Canvas as FabricCanvas } from "fabric";
import { dumpGridState } from "@/utils/grid/gridDebugUtils";

interface GridDebugOverlayProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  visible: boolean;
}

export const GridDebugOverlay: React.FC<GridDebugOverlayProps> = ({
  fabricCanvasRef,
  visible
}) => {
  if (!visible) return null;

  const canvas = fabricCanvasRef.current;
  if (!canvas) return null;

  const debugInfo = {
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    objectCount: canvas.getObjects().length,
    renderedAt: new Date().toISOString()
  };

  // Function to dump grid state 
  const handleDumpGridState = () => {
    if (canvas) {
      dumpGridState(canvas); // Fixed: removed the second argument
      console.log("Grid state dumped to console");
    }
  };

  return (
    <div className="absolute top-2 right-2 bg-white/90 p-2 rounded shadow z-50 text-xs">
      <h4 className="font-bold mb-1">Grid Debug</h4>
      <div>Canvas: {debugInfo.canvasWidth}×{debugInfo.canvasHeight}</div>
      <div>Objects: {debugInfo.objectCount}</div>
      <div>Rendered: {new Date().toLocaleTimeString()}</div>
      <button 
        onClick={handleDumpGridState} 
        className="mt-1 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs"
      >
        Dump State
      </button>
    </div>
  );
};
