
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createSimpleGrid } from "@/utils/simpleGridCreator";

/**
 * Create a floor plan grid on the canvas
 * @param canvas - The Fabric canvas to create the grid on
 * @param existingGrid - Any existing grid objects
 * @returns Array of created grid objects
 */
export function createFloorPlanGrid(
  canvas: FabricCanvas,
  existingGrid: FabricObject[] = []
): FabricObject[] {
  try {
    console.log("Creating floor plan grid");
    return createSimpleGrid(canvas, existingGrid);
  } catch (error) {
    console.error("Error creating floor plan grid:", error);
    return [];
  }
}
