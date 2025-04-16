
/**
 * Grid stats component
 * @module components/canvas/debug/GridStats
 */
import React from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DebugValue } from './DebugValue';

export interface GridStatsProps {
  /** Fabric canvas instance */
  canvas: FabricCanvas | null;
  /** Whether grid is created */
  gridCreated: boolean;
  /** Grid cell size */
  gridSize: number;
  /** Grid line color */
  gridColor: string;
  /** Grid line thickness */
  gridLineThickness: number;
  /** Number of grid objects */
  gridObjectCount: number;
}

/**
 * Grid stats component
 * @param props Component props
 * @returns Rendered component
 */
export const GridStats: React.FC<GridStatsProps> = ({
  canvas,
  gridCreated,
  gridSize,
  gridColor,
  gridLineThickness,
  gridObjectCount
}) => {
  // Get canvas dimensions
  const canvasWidth = canvas?.width ?? 0;
  const canvasHeight = canvas?.height ?? 0;
  
  // Calculate estimated grid cells
  const estimatedCellsX = Math.floor(canvasWidth / gridSize);
  const estimatedCellsY = Math.floor(canvasHeight / gridSize);
  const estimatedCellCount = estimatedCellsX * estimatedCellsY;
  
  return (
    <div className="space-y-1">
      <DebugValue
        label="Grid Created"
        value={gridCreated}
        important
      />
      <DebugValue
        label="Grid Size"
        value={gridSize}
      />
      <DebugValue
        label="Grid Objects"
        value={gridObjectCount}
      />
      <DebugValue
        label="Grid Color"
        value={gridColor}
      />
      <DebugValue
        label="Line Thickness"
        value={gridLineThickness}
      />
      <DebugValue
        label="Est. Cells X"
        value={estimatedCellsX}
      />
      <DebugValue
        label="Est. Cells Y"
        value={estimatedCellsY}
      />
      <DebugValue
        label="Est. Total Cells"
        value={estimatedCellCount}
      />
    </div>
  );
};
