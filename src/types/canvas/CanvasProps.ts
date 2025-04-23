
import type { DrawingMode } from '@/constants/drawingModes';
import type { DebugInfoState } from '@/types/core/DebugInfo';
import type { Canvas as FabricCanvas } from 'fabric';
import type { Dispatch, SetStateAction, CSSProperties } from 'react';

export interface CanvasProps {
  width: number;
  height: number;
  backgroundColor?: string;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  onError?: (error: Error) => void;
  tool?: DrawingMode;
  saveCurrentState?: () => void;
  setDebugInfo?: Dispatch<SetStateAction<DebugInfoState>>;
  style?: CSSProperties;
  showGridDebug?: boolean;
}
