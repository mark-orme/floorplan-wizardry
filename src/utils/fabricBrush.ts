/**
 * Utilities for Fabric.js brushes and drawing tools
 * Provides brush initialization and configuration functions
 * @module fabricBrush
 */
import { Canvas, PencilBrush } from "fabric";

/**
 * Brush configuration constants
 */
const BRUSH_CONFIG = {
  /**
   * Default brush color
   * @constant {string}
   */
  DEFAULT_COLOR: "#000000",
  
  /**
   * Default brush width in pixels
   * @constant {number}
   */
  DEFAULT_WIDTH: 2,
  
  /**
   * Decimate factor for performance optimization
   * Reduces the number of points in the path
   * @constant {number}
   */
  DECIMATE_FACTOR: 2,
  
  /**
   * Minimum pressure value for stylus input
   * @constant {number}
   */
  MIN_PRESSURE: 0.2,
  
  /**
   * Maximum pressure value for stylus input
   * @constant {number}
   */
  MAX_PRESSURE: 1
};

/**
 * Initialize a drawing brush for a Fabric canvas
 * Creates and configures a PencilBrush with optimized settings
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @returns {PencilBrush|null} The initialized brush or null if initialization fails
 */
export const initializeDrawingBrush = (canvas: Canvas): PencilBrush | null => {
  if (!canvas) {
    console.error("Cannot initialize brush: canvas is null");
    return null;
  }
  
  try {
    const brush = new PencilBrush(canvas);
    brush.color = BRUSH_CONFIG.DEFAULT_COLOR;
    brush.width = BRUSH_CONFIG.DEFAULT_WIDTH;
    
    // Improve brush performance and smoothness
    if ('decimate' in brush) {
      (brush as any).decimate = BRUSH_CONFIG.DECIMATE_FACTOR;
    }
    
    console.log("Drawing brush initialized successfully");
    return brush;
  } catch (error) {
    console.error("Failed to initialize drawing brush:", error);
    return null;
  }
};

/**
 * Add Pressure sensitivity for Apple Pencil and other stylus devices
 * Configures brush width to respond to pressure input
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 */
export const addPressureSensitivity = (canvas: Canvas): void => {
  if (!canvas) {
    console.error("Cannot add pressure sensitivity: canvas is null");
    return;
  }
  
  try {
    // Check if stylus is supported in the browser
    const hasStylus = 'maxTouchPoints' in navigator && navigator.maxTouchPoints > 0 && 
                     ('ontouchstart' in window || (window as any).DocumentTouch);
    
    // Normalize pressure values between stylus and mouse
    canvas.on('mouse:down', (e: any) => {
      if (!canvas.freeDrawingBrush) return;
      
      let pressure = BRUSH_CONFIG.MAX_PRESSURE; // Default pressure for mouse
      
      // Handle touch events with pressure (Apple Pencil, etc.)
      if (e.e instanceof TouchEvent && e.e.touches[0] && 'force' in e.e.touches[0]) {
        // Normalize Apple Pencil pressure (ranges from 0 to ~1)
        pressure = Math.max(BRUSH_CONFIG.MIN_PRESSURE, Math.min(BRUSH_CONFIG.MAX_PRESSURE, e.e.touches[0].force || BRUSH_CONFIG.MAX_PRESSURE));
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Stylus pressure detected: ${pressure}`);
        }
      }
      
      // Apply consistent line behavior for both stylus and mouse
      const baseWidth = canvas.freeDrawingBrush.width || BRUSH_CONFIG.DEFAULT_WIDTH;
      
      // For stylus, adjust width based on pressure
      if (pressure !== BRUSH_CONFIG.MAX_PRESSURE) {
        // Scale pressure to reasonable brush width (keeping original line width as reference)
        canvas.freeDrawingBrush.width = baseWidth * pressure;
      }
    });
    
    // Reset width on mouse up to ensure consistency
    canvas.on('mouse:up', () => {
      if (canvas.freeDrawingBrush) {
        // Restore original brush width after drawing is complete
        const lineThickness = (canvas as any)._lineThickness || BRUSH_CONFIG.DEFAULT_WIDTH;
        canvas.freeDrawingBrush.width = lineThickness;
      }
    });
    
    if (hasStylus) {
      console.log("Stylus support detected and enabled");
    }
    console.log("Pressure sensitivity support added");
  } catch (error) {
    console.error("Error adding pressure sensitivity:", error);
  }
};

/**
 * Track baseline line thickness for consistent reset after pressure changes
 * Stores the default line thickness in a custom canvas property
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {number} thickness - The baseline thickness to track
 */
export const trackLineThickness = (canvas: Canvas, thickness: number): void => {
  if (!canvas) return;
  
  try {
    // Store the base line thickness in a custom property for reference
    (canvas as any)._lineThickness = thickness;
  } catch (error) {
    console.error("Error tracking line thickness:", error);
  }
};
