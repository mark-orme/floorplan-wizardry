
import React, { useRef, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvasAutosave } from '@/hooks/useCanvasAutosave';
import { useOfflineSupport } from '@/hooks/useOfflineSupport';
import { toast } from 'sonner';

interface CanvasWithPersistenceProps {
  width: number;
  height: number;
  canvasId: string;
  onCanvasReady?: (canvas: FabricCanvas) => void;
}

/**
 * Canvas component with automatic persistence and offline support
 */
export const CanvasWithPersistence: React.FC<CanvasWithPersistenceProps> = ({
  width,
  height,
  canvasId,
  onCanvasReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize the canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;
    
    try {
      const fabricCanvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff'
      });
      
      fabricCanvasRef.current = fabricCanvas;
      setIsInitialized(true);
      
      if (onCanvasReady) {
        onCanvasReady(fabricCanvas);
      }
    } catch (error) {
      console.error('Error initializing canvas:', error);
      toast.error('Failed to initialize canvas');
    }
    
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [width, height, onCanvasReady]);
  
  // Set up auto-save
  const { saveCanvas, loadCanvas } = useCanvasAutosave({
    canvas: fabricCanvasRef.current,
    canvasId,
    onSave: (success) => {
      if (!success) {
        toast.error('Failed to save canvas');
      }
    },
    onLoad: (success) => {
      if (success) {
        toast.success('Canvas restored from local storage');
      }
    }
  });
  
  // Set up offline support with reconnect handler
  const { isOnline } = useOfflineSupport({
    onReconnect: async () => {
      toast.info('Reconnected! Syncing your changes...');
      // Here you would implement server sync logic
      console.log('Syncing to server would happen here');
    }
  });
  
  // Example of manual save button handler
  const handleSave = () => {
    saveCanvas();
    toast.success('Canvas saved manually');
  };
  
  // Example of manual load button handler
  const handleLoad = () => {
    loadCanvas();
  };
  
  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="border border-gray-300 rounded shadow-sm"
      />
      
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button 
          onClick={handleSave}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button 
          onClick={handleLoad}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Restore
        </button>
      </div>
      
      {!isOnline && (
        <div className="absolute top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-1 rounded flex items-center">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
          Offline Mode
        </div>
      )}
    </div>
  );
};
