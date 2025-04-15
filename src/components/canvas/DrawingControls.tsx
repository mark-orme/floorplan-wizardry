
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
  return (
    <ToolbarContainer 
      tool={tool}
      setTool={setTool}
      onUndo={onUndo}
      onRedo={onRedo}
      onZoom={onZoom}
      onClear={onClear}
      onDelete={onDelete}
      gia={gia}
      lineThickness={lineThickness}
      lineColor={lineColor}
      showGrid={showGrid}
      onToggleGrid={onToggleGrid}
      onLineThicknessChange={onLineThicknessChange}
      onLineColorChange={onLineColorChange}
      canUndo={canUndo}
      canRedo={canRedo}
      isOffline={isOffline}
      lastSaved={lastSaved}
    />
  );
};
