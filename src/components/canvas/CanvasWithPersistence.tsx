
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useAutoSaveCanvas } from '@/hooks/useAutoSaveCanvas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCanvasMetrics } from '@/hooks/useCanvasMetrics';
import { useSentryCanvasMonitoring } from '@/hooks/useSentryCanvasMonitoring';
import { useRealtimeCanvasSync } from '@/hooks/useRealtimeCanvasSync';

interface CanvasWithPersistenceProps {
  width: number;
  height: number;
  onCanvasReady?: (canvas: FabricCanvas) => void;
  showControls?: boolean;
  storageKey?: string;
  enableCollaboration?: boolean;
  userName?: string;
}

export const CanvasWithPersistence: React.FC<CanvasWithPersistenceProps> = ({
  width,
  height,
  onCanvasReady,
  showControls = true,
  storageKey = 'canvas_autosave',
  enableCollaboration = true,
  userName = 'User'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [collaboratorsCount, setCollaboratorsCount] = useState(0);
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new FabricCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#FFFFFF',
      preserveObjectStacking: true,
      renderOnAddRemove: false
    });
    
    fabricCanvasRef.current = canvas;
    setIsCanvasReady(true);
    
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
    
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [width, height, onCanvasReady]);
  
  // Set up auto-save
  const { saveCanvas, loadCanvas, lastSaved, isSaving, isLoading } = useAutoSaveCanvas({
    canvas: fabricCanvasRef.current,
    enabled: isCanvasReady,
    storageKey: storageKey,
    onSave: (success) => {
      if (success) {
        toast.success('Canvas saved', { id: 'canvas-save' });
      }
    },
    onLoad: (success) => {
      if (success) {
        toast.success('Canvas loaded', { id: 'canvas-load' });
      }
    }
  });
  
  // Set up real-time collaboration
  const { collaborators, syncCanvas } = useRealtimeCanvasSync({
    canvas: fabricCanvasRef.current,
    enabled: isCanvasReady && enableCollaboration,
    onRemoteUpdate: (sender, timestamp) => {
      console.log(`Received canvas update from ${sender} at ${new Date(timestamp).toLocaleString()}`);
    }
  });
  
  // Update collaborators count
  useEffect(() => {
    setCollaboratorsCount(collaborators.length);
  }, [collaborators]);
  
  // Track canvas metrics
  const { metrics } = useCanvasMetrics({
    fabricCanvasRef
  });
  
  // Monitor canvas performance with Sentry
  useSentryCanvasMonitoring({
    canvas: fabricCanvasRef.current,
    enabled: isCanvasReady
  });
  
  // Set up canvas change handlers for collaboration
  useEffect(() => {
    if (!fabricCanvasRef.current || !enableCollaboration || !isCanvasReady) return;
    
    const handleObjectModified = () => {
      syncCanvas(userName);
    };
    
    const handlePathCreated = () => {
      syncCanvas(userName);
    };
    
    // Attach event handlers
    fabricCanvasRef.current.on('object:modified', handleObjectModified);
    fabricCanvasRef.current.on('path:created', handlePathCreated);
    
    // Initial sync
    const initialSyncTimer = setTimeout(() => {
      syncCanvas(userName);
    }, 1000);
    
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.off('object:modified', handleObjectModified);
        fabricCanvasRef.current.off('path:created', handlePathCreated);
      }
      clearTimeout(initialSyncTimer);
    };
  }, [fabricCanvasRef.current, enableCollaboration, isCanvasReady, syncCanvas, userName]);
  
  // Load canvas data on initial mount
  useEffect(() => {
    if (!isCanvasReady) return;
    
    // Check if there's saved data
    const hasSavedData = localStorage.getItem(storageKey) !== null;
    
    if (hasSavedData) {
      loadCanvas();
    }
  }, [isCanvasReady, loadCanvas, storageKey]);
  
  return (
    <div className="relative">
      <canvas ref={canvasRef} className="border border-gray-200 rounded-md shadow-md" />
      
      {showControls && (
        <div className="absolute bottom-2 right-2 flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={saveCanvas} 
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={loadCanvas} 
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load'}
          </Button>
        </div>
      )}
      
      {enableCollaboration && collaboratorsCount > 0 && (
        <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {collaboratorsCount} {collaboratorsCount === 1 ? 'person' : 'people'} editing
        </div>
      )}
      
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 rounded text-xs">
          FPS: {metrics.fps} | Objects: {metrics.objectCount}
        </div>
      )}
    </div>
  );
};
