
import React from "react";
import { CanvasToolbar } from "./CanvasToolbar";
import { DrawingMode } from "@/constants/drawingModes";
import { Object as FabricObject } from "fabric";

/**
 * Props for ToolbarContainer component
 */
interface ToolbarContainerProps {
  tool: DrawingMode;
  setTool: React.Dispatch<React.SetStateAction<DrawingMode>>;
  lineThickness: number;
  lineColor: string;
  gia: number;
  showGrid: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (direction: "in" | "out") => void;
  onClear: () => void;
  onDelete: () => void;
  onToggleGrid: () => void;
  onLineThicknessChange?: (thickness: number) => void;
  onLineColorChange?: (color: string) => void;
}

/**
 * Toolbar container component
 * Isolates toolbar-related functionality
 */
export const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  tool,
  setTool,
  lineThickness,
  lineColor,
  gia,
  showGrid,
  onUndo,
  onRedo,
  onZoom,
  onClear,
  onDelete,
  onToggleGrid,
  onLineThicknessChange = () => {},
  onLineColorChange = () => {}
}) => {
  return (
    <CanvasToolbar 
      tool={tool}
      onToolChange={setTool}
      onUndo={onUndo}
      onRedo={onRedo}
      onZoom={onZoom}
      onClear={onClear}
      onSave={() => {}}
      onDelete={onDelete}
      gia={gia}
      lineThickness={lineThickness}
      lineColor={lineColor}
      onLineThicknessChange={onLineThicknessChange}
      onLineColorChange={onLineColorChange}
      showGrid={showGrid}
      onToggleGrid={onToggleGrid}
    />
  );
};
