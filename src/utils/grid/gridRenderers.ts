
import { Canvas, Object as FabricObject } from 'fabric';

/**
 * Validates a grid against constraints
 * @param grid The grid objects to validate
 */
export function validateGrid(grid: FabricObject[]): boolean {
  if (!grid || !Array.isArray(grid) || grid.length === 0) {
    return false;
  }

  return grid.every(obj => obj && typeof obj === 'object');
}

/**
 * Ensures grid lines are visible
 */
export function ensureGridVisibility(grid: FabricObject[], visible: boolean): void {
  if (!grid || !Array.isArray(grid)) return;
  
  grid.forEach(obj => {
    if (obj && obj.set) {
      obj.set({ visible });
    }
  });
}
