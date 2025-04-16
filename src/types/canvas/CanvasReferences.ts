
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { MutableRefObject } from "react";

/**
 * Canvas reference type
 */
export type CanvasRef = MutableRefObject<FabricCanvas | null>;

/**
 * Grid layer reference type
 */
export type GridLayerRef = MutableRefObject<FabricObject[]>;

/**
 * Canvas history reference type
 */
export type HistoryRef = MutableRefObject<{
  past: FabricObject[][];
  future: FabricObject[][];
}>;

/**
 * Canvas references bundle
 * Common set of references used in canvas components and hooks
 */
export interface CanvasReferences {
  fabricCanvasRef: CanvasRef;
  gridLayerRef?: GridLayerRef;
  historyRef?: HistoryRef;
}
