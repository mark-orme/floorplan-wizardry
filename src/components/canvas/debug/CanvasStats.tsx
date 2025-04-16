
/**
 * Canvas stats component
 * @module components/canvas/debug/CanvasStats
 */
import React from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DebugValue } from './DebugValue';

export interface CanvasStatsProps {
  /** Fabric canvas instance */
  canvas: FabricCanvas | null;
  /** Current zoom level */
  zoomLevel: number;
}

/**
 * Canvas stats component
 * @param props Component props
 * @returns Rendered component
 */
export const CanvasStats: React.FC<CanvasStatsProps> = ({
  canvas,
  zoomLevel
}) => {
  if (!canvas) {
    return (
      <div className="text-sm text-gray-500">
        Canvas not available
      </div>
    );
  }
  
  const objectCount = canvas.getObjects().length;
  const activeObject = canvas.getActiveObject();
  const selectionExists = !!activeObject;
  const isDrawingMode = canvas.isDrawingMode;
  
  return (
    <div className="space-y-1">
      <DebugValue
        label="Canvas Width"
        value={canvas.width ?? 0}
      />
      <DebugValue
        label="Canvas Height"
        value={canvas.height ?? 0}
      />
      <DebugValue
        label="Zoom Level"
        value={zoomLevel.toFixed(2)}
      />
      <DebugValue
        label="Object Count"
        value={objectCount}
      />
      <DebugValue
        label="Has Selection"
        value={selectionExists}
      />
      <DebugValue
        label="Drawing Mode"
        value={isDrawingMode}
      />
      {selectionExists && (
        <>
          <DebugValue
            label="Selected Type"
            value={activeObject.type}
          />
          <DebugValue
            label="Selected Left"
            value={Math.round(activeObject.left ?? 0)}
          />
          <DebugValue
            label="Selected Top"
            value={Math.round(activeObject.top ?? 0)}
          />
        </>
      )}
    </div>
  );
};
