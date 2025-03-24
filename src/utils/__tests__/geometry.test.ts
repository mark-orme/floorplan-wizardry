
import { snapToGrid } from "@/utils/geometry";
import type { Point } from "@/types/drawingTypes";

const GRID_SIZE = 0.1;

/**
 * Check if a point is exactly aligned to the grid
 */
function isGridAligned(point: Point, gridSize = GRID_SIZE): boolean {
  const epsilon = 1e-9;
  const isXAligned = Math.abs((point.x / gridSize) - Math.round(point.x / gridSize)) < epsilon;
  const isYAligned = Math.abs((point.y / gridSize) - Math.round(point.y / gridSize)) < epsilon;
  return isXAligned && isYAligned;
}

describe("Wall endpoint snapping", () => {
  const testPoints: Point[] = [
    { x: 1.15, y: 2.23 },
    { x: 0.03, y: 0.06 },
    { x: 2.49, y: 2.48 },
    { x: 5.57, y: 1.01 },
    { x: 0.94, y: 0.91 },
    { x: 3.1, y: 1.2 }
  ];

  it("should snap all points to 0.1m grid", () => {
    testPoints.forEach((pt) => {
      const snapped = snapToGrid(pt, GRID_SIZE);
      expect(isGridAligned(snapped)).toBe(true);
    });
  });
});
