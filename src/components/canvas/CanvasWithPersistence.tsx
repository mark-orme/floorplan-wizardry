
import React, { useState, useRef, useEffect } from 'react';
import { ExtendedFabricCanvas } from '@/types/ExtendedFabricCanvas';
import { Canvas } from '@/components/Canvas';
import { toast } from 'sonner';

interface CanvasWithPersistenceProps {
  width?: number;
  height?: number;
  storageKey?: string;
}

export const CanvasWithPersistence: React.FC<CanvasWithPersistenceProps> = ({
  width = 800,
  height = 600,
  storageKey = 'canvas_data'
}) => {
  const [canvas, setCanvas] = useState<ExtendedFabricCanvas | null>(null);

  // Handle canvas initialization
  const handleCanvasReady = (fabricCanvas: ExtendedFabricCanvas) => {
    setCanvas(fabricCanvas);
    
    // Try to load saved data
    const savedData = localStorage.getItem(storageKey);
    if (savedData && fabricCanvas.loadFromJSON) {
      try {
        fabricCanvas.loadFromJSON(savedData, () => {
          fabricCanvas.renderAll();
          toast.success('Loaded saved canvas');
        });
      } catch (error) {
        console.error('Failed to load canvas data:', error);
        toast.error('Failed to load saved canvas');
      }
    }
  };

  // Save canvas data on changes
  useEffect(() => {
    if (!canvas) return;
    
    const handleCanvasChange = (e: {target?: any}) => {
      const json = canvas.toJSON();
      localStorage.setItem(storageKey, JSON.stringify(json));
    };
    
    canvas.on('object:added', handleCanvasChange);
    canvas.on('object:modified', handleCanvasChange);
    canvas.on('object:removed', handleCanvasChange);
    
    return () => {
      canvas.off('object:added', handleCanvasChange);
      canvas.off('object:modified', handleCanvasChange);
      canvas.off('object:removed', handleCanvasChange);
    };
  }, [canvas, storageKey]);

  return (
    <Canvas
      width={width}
      height={height}
      onCanvasReady={handleCanvasReady}
    />
  );
};
