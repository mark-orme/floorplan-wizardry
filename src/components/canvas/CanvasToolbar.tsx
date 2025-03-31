
import React from "react";
import { DrawingToolbar } from "@/components/DrawingToolbar";
import { DrawingMode } from "@/constants/drawingModes";

interface CanvasToolbarProps {
  tool: DrawingMode;
  onToolChange: (tool: DrawingMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onZoom: (direction: "in" | "out") => void;
  onClear: () => void;
  onSave: () => void;
  onDelete: () => void;
  gia: number;
  lineThickness: number;
  lineColor: string;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
  showGrid?: boolean;
  onToggleGrid?: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  tool,
  onToolChange,
  onUndo,
  onRedo,
  onZoom,
  onClear,
  onSave,
  onDelete,
  gia,
  lineThickness,
  lineColor,
  onLineThicknessChange,
  onLineColorChange,
  showGrid,
  onToggleGrid
}) => {
  return (
    <div className="p-2 border-b">
      <DrawingToolbar
        tool={tool}
        onToolChange={onToolChange}
        onUndo={onUndo}
        onRedo={onRedo}
        onZoom={onZoom}
        onClear={onClear}
        onSave={onSave}
        onDelete={onDelete}
        gia={gia}
        lineThickness={lineThickness}
        lineColor={lineColor}
        onLineThicknessChange={onLineThicknessChange}
        onLineColorChange={onLineColorChange}
        showGrid={showGrid}
        onToggleGrid={onToggleGrid}
      />
    </div>
  );
};
