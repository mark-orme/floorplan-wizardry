
import React, { useCallback } from "react";
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
  canUndo: boolean;
  canRedo: boolean;
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
  canUndo,
  canRedo,
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
    <div className="flex flex-col w-full">
      <CanvasToolbar 
        tool={tool}
        onToolChange={setTool}
        onUndo={onUndo}
        onRedo={onRedo}
        onZoom={onZoom}
        onClear={onClear}
        onSave={() => {}}
        onDelete={onDelete}
        lineThickness={lineThickness}
        onLineThicknessChange={onLineThicknessChange}
        lineColor={lineColor}
        onLineColorChange={onLineColorChange}
        gia={gia}
        showGrid={showGrid}
        onToggleGrid={onToggleGrid}
        canUndo={canUndo}
        canRedo={canRedo}
      />
    </div>
  );
};
