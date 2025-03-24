
/**
 * Utilities for Fabric.js brushes and drawing tools
 * @module fabricBrush
 */
import { Canvas, PencilBrush } from "fabric";

/**
 * Initialize a drawing brush for a Fabric canvas
 * @param {Canvas} canvas - The Fabric canvas instance
 * @returns {PencilBrush|null} The initialized brush or null if initialization fails
 */
export const initializeDrawingBrush = (canvas: Canvas) => {
  if (!canvas) {
    console.error("Cannot initialize brush: canvas is null");
    return null;
  }
  
  try {
    const brush = new PencilBrush(canvas);
    brush.color = "#000000";
    brush.width = 2;
    console.log("Drawing brush initialized successfully");
    return brush;
  } catch (error) {
    console.error("Failed to initialize drawing brush:", error);
    return null;
  }
};

/**
 * Add Pressure sensitivity for Apple Pencil
 * @param {Canvas} canvas - The Fabric canvas instance
 */
export const addPressureSensitivity = (canvas: Canvas) => {
  if (!canvas) {
    console.error("Cannot add pressure sensitivity: canvas is null");
    return;
  }
  
  try {
    canvas.on('mouse:down', (e: any) => {
      if (e.e instanceof TouchEvent && 'force' in e.e.touches[0]) {
        const force = e.e.touches[0].force || 1;
        if (canvas.freeDrawingBrush) {
          // Scale force to a reasonable brush width range (1-5)
          canvas.freeDrawingBrush.width = Math.max(1, Math.min(5, force * 5));
        }
      }
    });
    
    console.log("Apple Pencil pressure sensitivity added");
  } catch (error) {
    console.error("Error adding pressure sensitivity:", error);
  }
};
