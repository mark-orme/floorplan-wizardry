
/**
 * Grid renderer type definitions
 * @module gridRenderer
 */
import { Canvas, Object as FabricObject, Line } from "fabric";

/**
 * Result of rendering grid components
 */
export interface GridRenderResult {
  /** All grid objects */
  gridObjects: FabricObject[];
  /** Small grid lines */
  smallGridLines: Line[];
  /** Large grid lines */
  largeGridLines: Line[];
  /** Grid markers (labels) */
  markers: FabricObject[];
}

/**
 * Renders all grid components on canvas
 * @param canvas - Fabric.js canvas instance
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Grid render result containing all created objects
 */
export function renderGridComponents(
  canvas: Canvas,
  width: number,
  height: number
): GridRenderResult;

/**
 * Arranges grid objects in the correct z-order
 * @param canvas - Fabric.js canvas instance
 * @param smallGridLines - Small grid lines
 * @param largeGridLines - Large grid lines
 * @param markers - Grid markers
 */
export function arrangeGridObjects(
  canvas: Canvas,
  smallGridLines: Line[],
  largeGridLines: Line[],
  markers: FabricObject[]
): void;
