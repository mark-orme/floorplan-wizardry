
import { DrawingMode } from "@/constants/drawingModes";
import { Canvas } from "fabric";
import { Point } from "@/types/core/Geometry";

export interface UseStraightLineToolProps {
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

export interface UseStraightLineToolResult {
  isToolInitialized: boolean;
  isDrawing: boolean;
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  endDrawing: (point: Point) => void;
  cancelDrawing: () => void;
}
