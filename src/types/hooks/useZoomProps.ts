/**
 * Zoom Props Interface
 * @module types/hooks/useZoomProps
 */
import { FabricCanvas } from "@/types/fabric";
import { DrawingTool } from '@/types/core/DrawingTool';
import { MutableRefObject } from 'react';

/**
 * Props for useZoomTracking hook
 */
export interface UseZoomTrackingProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: MutableRefObject<FabricCanvas | null>;
  /** Current drawing tool */
  tool: DrawingTool;
  /** Update zoom level function */
  updateZoomLevel: (zoom: number) => void;
}

/**
 * Result of useZoomTracking hook
 */
export interface UseZoomTrackingResult {
  /** Register zoom tracking function */
  register: () => void;
  /** Unregister zoom tracking function */
  unregister: () => void;
  /** Cleanup zoom tracking function */
  cleanup: () => void;
  /** Current zoom level */
  zoomLevel: number;
}

/**
 * Props for useZoom hook
 */
export interface UseZoomProps {
  /** Reference to fabric canvas */
  canvasRef: MutableRefObject<FabricCanvas | null>;
  /** Initial zoom level */
  initialZoom?: number;
}
