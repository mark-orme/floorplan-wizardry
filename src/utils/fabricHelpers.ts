
import { Canvas, PencilBrush } from "fabric";

/**
 * Initialize a drawing brush for a Fabric canvas
 * @param canvas The Fabric canvas instance
 * @returns The initialized brush
 */
export const initializeDrawingBrush = (canvas: Canvas) => {
  if (!canvas) return null;
  
  try {
    const brush = new PencilBrush(canvas);
    brush.color = "#000000";
    brush.width = 2;
    return brush;
  } catch (error) {
    console.error("Failed to initialize drawing brush:", error);
    return null;
  }
};

/**
 * Safely sets canvas dimensions and refreshes the canvas
 * @param canvas The Fabric canvas instance
 * @param width Width to set
 * @param height Height to set
 */
export const setCanvasDimensions = (canvas: Canvas, width: number, height: number) => {
  if (!canvas) return;
  
  try {
    canvas.setDimensions({ width, height });
    canvas.renderAll();
  } catch (error) {
    console.error("Failed to set canvas dimensions:", error);
  }
};
