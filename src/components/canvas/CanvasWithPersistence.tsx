
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useAutoSaveCanvas } from '@/hooks/useAutoSaveCanvas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useCanvasMetrics } from '@/hooks/useCanvasMetrics';
import { useSentryCanvasMonitoring } from '@/hooks/useSentryCanvasMonitoring';
import { useRealtimeCanvasSync } from '@/hooks/useRealtimeCanvasSync';
import { useVirtualizedCanvas } from '@/hooks/useVirtualizedCanvas';
import { fetchWithCSRF } from '@/utils/security';

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
  
  // Add virtualization for canvas
  const { 
    performanceMetrics,
    virtualizationEnabled,
    toggleVirtualization 
  } = useVirtualizedCanvas(fabricCanvasRef, {
    enabled: true,
    threshold: 100,
    autoToggle: true
  });
  
  const { saveCanvas, loadCanvas, lastSaved, isSaving, isLoading } = useAutoSaveCanvas({
    canvas: fabricCanvasRef.current,
    enabled: isCanvasReady,
    storageKey: storageKey,
    onSave: (success) => {
      if (success) {
        toast.success('Canvas saved');
      }
    },
    onLoad: (success) => {
      if (success) {
        toast.success('Canvas loaded');
      }
    },
    // Use CSRF-protected fetch for saving
    customFetch: fetchWithCSRF
  });

  useEffect(() => {
    if (!isCanvasReady) return;
    
    const hasSavedData = localStorage.getItem(storageKey) !== null;
    if (hasSavedData) {
      loadCanvas();
    }
  }, [isCanvasReady, loadCanvas, storageKey]);

  const { collaborators, syncCanvas } = useRealtimeCanvasSync({
    canvas: fabricCanvasRef.current,
    enabled: enableCollaboration && !!fabricCanvasRef.current,
    userName,
    onRemoteUpdate: () => {
      console.log(`Canvas updated at ${new Date().toLocaleString()}`);
    }
  });
  
  useEffect(() => {
    setCollaboratorsCount(collaborators.length);
  }, [collaborators]);

  const { metrics } = useCanvasMetrics({
    fabricCanvasRef
  });

  useSentryCanvasMonitoring({
    canvas: fabricCanvasRef.current,
  });

  useEffect(() => {
    if (!fabricCanvasRef.current || !enableCollaboration || !isCanvasReady) return;
    
    const handleObjectModified = () => {
      syncCanvas();
    };
    
    const handlePathCreated = () => {
      syncCanvas();
    };
    
    fabricCanvasRef.current.on('object:modified', handleObjectModified);
    fabricCanvasRef.current.on('path:created', handlePathCreated);
    
    const initialSyncTimer = setTimeout(() => {
      syncCanvas();
    }, 1000);
    
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.off('object:modified', handleObjectModified);
        fabricCanvasRef.current.off('path:created', handlePathCreated);
      }
      clearTimeout(initialSyncTimer);
    };
  }, [fabricCanvasRef.current, enableCollaboration, isCanvasReady, syncCanvas, userName]);

  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        data-testid="persistent-canvas"
      />
      
      {showControls && (
        <div className="absolute top-2 right-2 flex gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => saveCanvas()}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => loadCanvas()}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVirtualization}
            className={virtualizationEnabled ? 'bg-green-100' : ''}
          >
            {virtualizationEnabled ? 'Virtualization On' : 'Virtualization Off'}
          </Button>
        </div>
      )}
      
      {/* Performance metrics indicator */}
      {showControls && performanceMetrics.fps > 0 && (
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
          {performanceMetrics.fps} FPS | {performanceMetrics.visibleObjectCount}/{performanceMetrics.objectCount} objects
        </div>
      )}
      
      {enableCollaboration && collaboratorsCount > 0 && (
        <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {collaboratorsCount} {collaboratorsCount === 1 ? 'person' : 'people'} editing
        </div>
      )}
    </div>
  );
};
