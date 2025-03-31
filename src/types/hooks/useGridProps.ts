
/**
 * Type definitions for Grid hook props
 * Defines interfaces for grid-related hooks
 * @module types/hooks/useGridProps
 */
import { FabricCanvas } from '@/types/fabric';
import { GridCreationState } from '@/types/core/GridTypes';
import { CanvasDimensions } from '@/types/core/Geometry';
import { MutableRefObject } from 'react';
import { DebugInfoState } from '@/types/core/DebugInfo';

/**
 * Props for useGridManagement hook
 */
export interface UseGridManagementProps {
  /** Fabric canvas instance */
  canvas: FabricCanvas | null;
  /** Reference to grid layer objects */
  gridLayerRef: MutableRefObject<any[]>;
  /** Canvas dimensions */
  dimensions: CanvasDimensions | null;
  /** Debug info state setter */
  setDebugInfo: (info: DebugInfoState | ((prev: DebugInfoState) => DebugInfoState)) => void;
}

/**
 * Result of useGridManagement hook
 */
export interface UseGridManagementResult {
  /** Create grid function */
  createGrid: () => void;
  /** Reset grid function */
  resetGrid: () => void;
  /** Current grid state */
  gridState: GridCreationState;
  /** Toggle grid visibility function */
  toggleGridVisibility: (visible: boolean) => void;
  /** Update grid on dimension change function */
  updateGridOnDimensionChange: (newDimensions: CanvasDimensions) => void;
}

/**
 * Props for useGridCreation hook
 */
export interface UseGridCreationProps {
  /** Fabric canvas instance */
  canvas: FabricCanvas | null;
  /** Reference to grid layer objects */
  gridLayerRef: MutableRefObject<any[]>;
  /** Whether grid should be visible */
  showGrid: boolean;
}
