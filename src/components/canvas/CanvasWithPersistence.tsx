import React, { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvas } from '@/contexts/CanvasContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCanvasAutoSave } from '@/hooks/canvas/useCanvasAutoSave';

interface CanvasWithPersistenceProps {
  canvasId: string;
  autoSaveInterval?: number;
}

export const CanvasWithPersistence: React.FC<CanvasWithPersistenceProps> = ({
  canvasId,
  autoSaveInterval = 30000,
}) => {
  const { canvas: fabricCanvas } = useCanvas();
  const { user } = useAuth();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { saveCanvas, canSave } = useCanvasAutoSave({
    canvas: fabricCanvas,
    autoSaveInterval,
    canvasId
  });

  return (
    <div className="canvas-persistence-wrapper">
      {canSave ? (
        <button onClick={saveCanvas}>Save Canvas</button>
      ) : (
        <p>No canvas to save</p>
      )}
      
      <AutoSaveCanvas 
        canvas={fabricCanvas} 
        autoSaveInterval={autoSaveInterval}
        canvasId={canvasId}
        // Remove the customFetch prop that doesn't exist in the interface
      />
      
      {lastSaved && (
        <p>Last saved: {lastSaved.toLocaleTimeString()}</p>
      )}
    </div>
  );
};

interface UseAutoSaveCanvasProps {
  canvas: FabricCanvas | null;
  autoSaveInterval?: number;
  canvasId?: string;
}

function AutoSaveCanvas({ canvas, autoSaveInterval = 30000, canvasId = 'default-canvas' }: UseAutoSaveCanvasProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (!canvas) return;

    const saveToLocalStorage = () => {
      try {
        const canvasJSON = canvas.toJSON(['id', 'name']);
        localStorage.setItem(`canvas_${canvasId}`, JSON.stringify(canvasJSON));
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error saving canvas to local storage:', error);
      }
    };

    const intervalId = setInterval(() => {
      saveToLocalStorage();
      console.log(`Auto-saved canvas at ${new Date().toLocaleTimeString()}`);
    }, autoSaveInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [canvas, autoSaveInterval, canvasId]);

  return null;
}
