
import React from "react";
import { DrawingMode } from "@/constants/drawingModes";
import { ToolbarContainer } from "./ToolbarContainer";

interface DrawingControlsProps {
  tool: DrawingMode;
  setTool: (tool: DrawingMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (direction: "in" | "out") => void;
  onClear: () => void;
  onDelete: () => void;
  gia: number;
  lineThickness: number;
  lineColor: string;
  showGrid: boolean;
  onToggleGrid: () => void;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  isOffline: boolean;
  lastSaved: Date | null;
}

/**
 * Drawing controls component
 * Manages toolbar for drawing tools and options
 */
export const DrawingControls: React.FC<DrawingControlsProps> = ({
  tool,
  setTool,
  onUndo,
  onRedo,
  onZoom,
  onClear,
  onDelete,
  gia,
  lineThickness,
  lineColor,
  showGrid,
  onToggleGrid,
  onLineThicknessChange,
  onLineColorChange,
  canUndo,
  canRedo,
  isOffline,
  lastSaved
}) => {
  const handleZoomIn = () => onZoom("in");
  const handleZoomOut = () => onZoom("out");
  const handleToggleSync = () => {
    // This is just a placeholder since we don't have the actual sync toggle function
    console.log("Toggle sync");
  };

  return (
    <ToolbarContainer 
      onToolSelect={(toolName: string) => setTool(toolName as DrawingMode)}
      onUndo={onUndo}
      onRedo={onRedo}
      onClear={onClear}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onToggleGrid={onToggleGrid}
      onToggleSync={handleToggleSync}
      activeTool={tool}
      canUndo={canUndo}
      canRedo={canRedo}
      showGrid={showGrid}
      synced={!isOffline}
    />
  );
};
