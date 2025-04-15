
import React from 'react';
import { CanvasApp } from './CanvasApp';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

interface EditorContentProps {
  forceRefreshKey?: number;
  setCanvas: (canvas: FabricCanvas) => void;
  showGridDebug?: boolean;
  tool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  enableSync?: boolean; // Added enableSync prop
}

export const EditorContent: React.FC<EditorContentProps> = ({
  forceRefreshKey,
  setCanvas,
  showGridDebug,
  tool,
  lineThickness,
  lineColor,
  enableSync = true // Default to true
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      <div className="w-full h-full">
        <CanvasApp
          key={forceRefreshKey}
          setCanvas={setCanvas}
          tool={tool}
          lineThickness={lineThickness}
          lineColor={lineColor}
          enableSync={enableSync}
        />
      </div>
    </div>
  );
};
