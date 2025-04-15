import { GridCell } from '@/types/grid';
// Import from our new createPoint utility
import { Point, createPoint } from '@/types/core/Point';

/**
 * Generates a basic grid for testing purposes.
 * @param rows Number of rows in the grid.
 * @param cols Number of columns in the grid.
 * @param cellWidth Width of each grid cell.
 * @param cellHeight Height of each grid cell.
 * @returns A 2D array representing the grid.
 */
export const generateTestGrid = (
  rows: number,
  cols: number,
  cellWidth: number,
  cellHeight: number
): GridCell[][] => {
  const grid: GridCell[][] = [];
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = {
        id: `cell-${i}-${j}`,
        row: i,
        col: j,
        x: j * cellWidth,
        y: i * cellHeight,
        width: cellWidth,
        height: cellHeight,
        center: createPoint(j * cellWidth + cellWidth / 2, i * cellHeight + cellHeight / 2),
        edges: {
          north: { start: createPoint(j * cellWidth, i * cellHeight), end: createPoint((j + 1) * cellWidth, i * cellHeight) },
          east: { start: createPoint((j + 1) * cellWidth, i * cellHeight), end: createPoint((j + 1) * cellWidth, (i + 1) * cellHeight) },
          south: { start: createPoint((j + 1) * cellWidth, (i + 1) * cellHeight), end: createPoint(j * cellWidth, (i + 1) * cellHeight) },
          west: { start: createPoint(j * cellWidth, (i + 1) * cellHeight), end: createPoint(j * cellWidth, i * cellHeight) },
        },
        isIntersection: false,
      };
    }
  }
  return grid;
};
