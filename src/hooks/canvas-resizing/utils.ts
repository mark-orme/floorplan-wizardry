
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Calculate canvas dimensions based on container and content
 * @param containerWidth Container width
 * @param containerHeight Container height
 * @param contentWidth Content width
 * @param contentHeight Content height
 * @param maintainAspectRatio Whether to maintain aspect ratio
 */
export const calculateCanvasDimensions = (
  containerWidth: number,
  containerHeight: number,
  contentWidth: number = 800,
  contentHeight: number = 600,
  maintainAspectRatio: boolean = true
) => {
  if (!maintainAspectRatio) {
    return { width: containerWidth, height: containerHeight };
  }

  const containerRatio = containerWidth / containerHeight;
  const contentRatio = contentWidth / contentHeight;

  if (containerRatio > contentRatio) {
    // Container is wider than content
    const height = containerHeight;
    const width = height * contentRatio;
    return { width, height };
  } else {
    // Container is taller than content
    const width = containerWidth;
    const height = width / contentRatio;
    return { width, height };
  }
};

/**
 * Calculate canvas scale based on dimensions
 * @param canvasWidth Canvas width
 * @param canvasHeight Canvas height
 * @param containerWidth Container width
 * @param containerHeight Container height
 */
export const calculateCanvasScale = (
  canvasWidth: number,
  canvasHeight: number,
  containerWidth: number,
  containerHeight: number
) => {
  const scaleX = containerWidth / canvasWidth;
  const scaleY = containerHeight / canvasHeight;
  return Math.min(scaleX, scaleY);
};

/**
 * Apply resize to canvas
 * @param canvas Fabric canvas
 * @param width New width
 * @param height New height
 * @param scale Scale factor
 */
export const applyCanvasResize = (
  canvas: FabricCanvas,
  width: number,
  height: number,
  scale: number = 1
) => {
  if (!canvas) return;
  
  canvas.setWidth(width);
  canvas.setHeight(height);
  canvas.setZoom(scale);
  canvas.renderAll();
  
  return { width, height, scale };
};
