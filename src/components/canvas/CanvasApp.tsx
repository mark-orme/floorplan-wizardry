
import React, { useRef, useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { DrawingMode } from '@/constants/drawingModes';
import { CanvasInitializer } from './CanvasInitializer';
import { ConnectedDrawingCanvas } from './ConnectedDrawingCanvas';
import { updateCanvasDimensions } from '@/utils/canvas/safeDimensions';
import { captureError } from '@/utils/sentryUtils';
import { createFloorPlanDataForSync, setupRealtimeSync } from '@/utils/realtime/syncUtils';
import { broadcastFloorPlanUpdate, broadcastPresenceUpdate } from '@/utils/syncService';

interface CanvasAppProps {
  setCanvas: (canvas: FabricCanvas) => void;
  tool?: DrawingMode;
  lineThickness?: number;
  lineColor?: string;
  enableSync?: boolean; // Optional flag to enable/disable syncing
}

export const CanvasApp: React.FC<CanvasAppProps> = ({
  setCanvas,
  tool = DrawingMode.SELECT,
  lineThickness = 2,
  lineColor = "#000000",
  enableSync = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hasCanvasError, setHasCanvasError] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);
  const [collaboratorCount, setCollaboratorCount] = useState(0);
  
  // References for sync state
  const lastSyncTimeRef = useRef<number>(0);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const channelRef = useRef<any>(null);
  
  // Update dimensions when container size changes
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Get container dimensions
    const { width, height } = containerRef.current.getBoundingClientRect();
    setDimensions({ width, height });
    
    // Set up resize observer
    const observer = new ResizeObserver(() => {
      if (!containerRef.current) return;
      
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      
      // Update canvas dimensions if canvas exists
      if (fabricCanvasRef.current) {
        try {
          updateCanvasDimensions(fabricCanvasRef.current, containerRef);
        } catch (err) {
          console.error('Error updating canvas dimensions:', err);
        }
      }
    });
    
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);
  
  // Handle canvas ready
  const handleCanvasReady = (canvas: FabricCanvas) => {
    try {
      // Store reference to canvas
      fabricCanvasRef.current = canvas;
      
      // Pass canvas to parent component
      setCanvas(canvas);
      
      // Set up collaboration if enabled
      if (enableSync) {
        // Set up realtime sync
        const channel = setupRealtimeSync(
          canvas,
          lastSyncTimeRef,
          setLastSyncTime,
          setCollaboratorCount,
          (sender, timestamp) => {
            console.log(`Received update from ${sender} at ${new Date(timestamp).toLocaleTimeString()}`);
          }
        );
        
        // Store channel reference
        channelRef.current = channel;
        
        // Broadcast initial presence
        broadcastPresenceUpdate(1);
        
        // Create initial sync data (using a temporary user name)
        const initialFloorPlans = createFloorPlanDataForSync(canvas, 'User');
        
        // Broadcast initial state
        setTimeout(() => {
          if (canvas) {
            broadcastFloorPlanUpdate(initialFloorPlans);
          }
        }, 1000);
      }
      
      toast.success('Canvas initialized');
    } catch (error) {
      console.error('Error initializing canvas:', error);
      captureError(error, 'canvas-init-error');
      setHasCanvasError(true);
    }
  };
  
  // Handle canvas error
  const handleCanvasError = (error: Error) => {
    console.error('Canvas error:', error);
    captureError(error, 'canvas-error');
    setHasCanvasError(true);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clean up channel if it exists
      if (channelRef.current) {
        try {
          channelRef.current.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from channel:', error);
        }
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative"
    >
      <CanvasInitializer
        width={dimensions.width}
        height={dimensions.height}
        onCanvasReady={handleCanvasReady}
        onCanvasError={handleCanvasError}
      >
        <ConnectedDrawingCanvas
          tool={tool}
          lineThickness={lineThickness}
          lineColor={lineColor}
        />
      </CanvasInitializer>
      
      {/* Display error state if needed */}
      {hasCanvasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90">
          <div className="text-center p-6 max-w-md">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">We've encountered an error with the canvas rendering.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Collaboration indicator if enabled */}
      {enableSync && collaboratorCount > 0 && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
          {collaboratorCount} {collaboratorCount === 1 ? 'collaborator' : 'collaborators'} online
        </div>
      )}
    </div>
  );
};
