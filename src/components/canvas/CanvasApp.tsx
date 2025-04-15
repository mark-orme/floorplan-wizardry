
import React, { useRef, useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { DrawingMode } from '@/constants/drawingModes';
import { CanvasInitializer } from './CanvasInitializer';
import { ConnectedDrawingCanvas } from './ConnectedDrawingCanvas';
import { updateCanvasDimensions } from '@/utils/canvas/safeDimensions';
import { captureError, captureMessage } from '@/utils/sentryUtils';
import { createFloorPlanDataForSync, setupRealtimeSync } from '@/utils/realtime/syncUtils';
import { broadcastFloorPlanUpdate, notifyPresenceChange } from '@/utils/syncService';

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
  const initTimeRef = useRef<number>(Date.now());
  
  // Log application startup
  useEffect(() => {
    captureMessage('CanvasApp component mounted', 'canvas-app-init', {
      level: 'info',
      tags: {
        component: 'CanvasApp',
        operation: 'mount'
      },
      extra: {
        enableSync,
        timestamp: new Date().toISOString()
      }
    });
    
    // Track page load performance
    const loadTime = performance.now();
    
    return () => {
      captureMessage('CanvasApp component unmounted', 'canvas-app-cleanup', {
        level: 'info',
        tags: {
          component: 'CanvasApp',
          operation: 'unmount'
        },
        extra: {
          sessionDuration: Date.now() - initTimeRef.current
        }
      });
    };
  }, [enableSync]);
  
  // Update dimensions when container size changes
  useEffect(() => {
    if (!containerRef.current) {
      captureMessage('Container ref not available', 'canvas-container-missing', {
        level: 'warning',
        tags: {
          component: 'CanvasApp',
          operation: 'resize-observer'
        }
      });
      return;
    }
    
    try {
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
            captureError(err, 'canvas-dimension-update-error', {
              level: 'error',
              tags: {
                component: 'CanvasApp',
                operation: 'resize'
              },
              extra: {
                dimensions: { width, height }
              }
            });
          }
        }
      });
      
      observer.observe(containerRef.current);
      
      return () => observer.disconnect();
    } catch (error) {
      captureError(error, 'resize-observer-error', {
        level: 'error',
        tags: {
          component: 'CanvasApp',
          operation: 'resize-observer'
        }
      });
    }
  }, []);
  
  // Handle canvas ready
  const handleCanvasReady = (canvas: FabricCanvas) => {
    try {
      // Store reference to canvas
      fabricCanvasRef.current = canvas;
      
      // Track canvas initialization time
      const initTime = Date.now() - initTimeRef.current;
      captureMessage(`Canvas initialized successfully in ${initTime}ms`, 'canvas-ready', {
        level: 'info',
        tags: {
          component: 'CanvasApp',
          operation: 'canvas-init'
        },
        extra: {
          initTime,
          dimensions,
          canvasType: canvas.constructor.name
        }
      });
      
      // Pass canvas to parent component
      setCanvas(canvas);
      
      // Set up collaboration if enabled
      if (enableSync) {
        try {
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
          notifyPresenceChange();
          
          // Create initial sync data (using a temporary user name)
          const initialFloorPlans = createFloorPlanDataForSync(canvas, 'User');
          
          // Broadcast initial state
          setTimeout(() => {
            if (canvas) {
              broadcastFloorPlanUpdate(initialFloorPlans);
            }
          }, 1000);
          
          captureMessage('Collaboration setup complete', 'sync-init-success', {
            level: 'info',
            tags: {
              component: 'CanvasApp',
              operation: 'sync-init'
            }
          });
        } catch (syncError) {
          captureError(syncError, 'sync-init-error', {
            level: 'error',
            tags: {
              component: 'CanvasApp',
              operation: 'sync-init'
            }
          });
        }
      }
      
      toast.success('Canvas initialized');
    } catch (error) {
      console.error('Error initializing canvas:', error);
      captureError(error, 'canvas-init-error', {
        level: 'error',
        tags: {
          component: 'CanvasApp',
          operation: 'canvas-init'
        },
        extra: {
          dimensions,
          browserInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            vendor: navigator.vendor
          }
        }
      });
      setHasCanvasError(true);
    }
  };
  
  // Handle canvas error
  const handleCanvasError = (error: Error) => {
    console.error('Canvas error:', error);
    captureError(error, 'canvas-error', {
      level: 'error',
      tags: {
        component: 'CanvasApp',
        operation: 'canvas-operation'
      },
      extra: {
        dimensions,
        timeElapsed: Date.now() - initTimeRef.current,
        hasCanvasRef: !!fabricCanvasRef.current,
        browserInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          vendor: navigator.vendor,
          screenSize: `${window.screen.width}x${window.screen.height}`,
          devicePixelRatio: window.devicePixelRatio
        }
      }
    });
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
          captureError(error, 'channel-unsubscribe-error', {
            level: 'warning',
            tags: {
              component: 'CanvasApp',
              operation: 'cleanup'
            }
          });
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
