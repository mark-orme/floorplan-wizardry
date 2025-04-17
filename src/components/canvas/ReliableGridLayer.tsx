
import React, { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useReliableGrid } from '@/hooks/useReliableGrid';

interface ReliableGridLayerProps {
  canvas: FabricCanvas | null;
  gridSpacing?: number;
  enabled?: boolean;
  showDebugInfo?: boolean;
  onGridCreated?: (isCreated: boolean) => void;
}

export const ReliableGridLayer: React.FC<ReliableGridLayerProps> = ({
  canvas,
  gridSpacing = 20,
  enabled = true,
  showDebugInfo = false,
  onGridCreated
}) => {
  // Use the reliable grid hook
  const { isGridCreated, gridObjects, reinitializeGrid } = useReliableGrid({
    canvas,
    gridSpacing,
    enabled
  });
  
  // Notify parent when grid is created
  useEffect(() => {
    if (onGridCreated) {
      onGridCreated(isGridCreated);
    }
  }, [isGridCreated, onGridCreated]);
  
  // Debug information
  if (showDebugInfo) {
    return (
      <div className="absolute bottom-2 left-2 bg-white/80 p-2 rounded text-xs z-10">
        <div>Grid Created: {isGridCreated ? 'Yes' : 'No'}</div>
        <div>Grid Objects: {gridObjects.length}</div>
        <button 
          onClick={reinitializeGrid}
          className="mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs"
        >
          Reinitialize Grid
        </button>
      </div>
    );
  }
  
  // No visible UI for this component
  return null;
};
