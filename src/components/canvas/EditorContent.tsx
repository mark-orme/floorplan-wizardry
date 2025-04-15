
import React from 'react';
import { CanvasApp } from "@/components/canvas/CanvasApp";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";

interface EditorContentProps {
  forceRefreshKey: number;
  setCanvas: (canvas: FabricCanvas) => void;
  showGridDebug: boolean;
  tool: DrawingMode;
  lineThickness: number;
  lineColor: string;
}

export const EditorContent: React.FC<EditorContentProps> = ({
  forceRefreshKey,
  setCanvas,
  showGridDebug,
  tool,
  lineThickness,
  lineColor
}) => {
  return (
    <div className="flex-1 overflow-hidden relative">
      <CanvasApp 
        key={`canvas-app-${forceRefreshKey}`}
        setCanvas={setCanvas}
        tool={tool}
        lineThickness={lineThickness}
        lineColor={lineColor}
      />
      
      {/* Grid Debug Panel - only shown when showGridDebug is true */}
      {showGridDebug && (
        <div className="absolute top-0 right-0 bg-white/90 p-2 text-xs">
          Grid Debug Active
        </div>
      )}
    </div>
  );
};
