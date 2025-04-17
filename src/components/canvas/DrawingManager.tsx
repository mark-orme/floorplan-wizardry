
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useAutoSaveCanvas } from '@/hooks/useAutoSaveCanvas';
import { DrawingMode } from '@/constants/drawingModes';
import { ReliableGridLayer } from '@/components/canvas/ReliableGridLayer';
import { BrushCursorPreview } from '@/components/canvas/BrushCursorPreview';
import { MeasurementGuideModal } from '@/components/MeasurementGuideModal';
import { useMemoizedDrawingComponents } from '@/hooks/useMemoizedDrawingComponents';
import { useRealtimeCanvasSync } from '@/hooks/useRealtimeCanvasSync';

interface DrawingManagerProps {
  fabricCanvas: FabricCanvas | null;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  showGrid?: boolean;
  storageKey?: string;
  disableAutoSave?: boolean;
  enableCollaboration?: boolean;
  userName?: string;
  onCollaboratorUpdate?: (count: number) => void;
}

export const DrawingManager: React.FC<DrawingManagerProps> = ({
  fabricCanvas,
  tool,
  lineColor,
  lineThickness,
  showGrid = true,
  storageKey = 'drawing_autosave',
  disableAutoSave = false,
  enableCollaboration = true,
  userName = 'Anonymous',
  onCollaboratorUpdate
}) => {
  // State for grid and guide modal
  const [isGridReady, setIsGridReady] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  // Track component mount state
  const isMountedRef = useRef(true);
  
  // Auto-save drawing state
  const { saveCanvas, loadCanvas } = useAutoSaveCanvas({
    canvas: fabricCanvas,
    enabled: !disableAutoSave && !!fabricCanvas,
    storageKey: storageKey
  });
  
  // Real-time collaboration
  const { collaborators, syncCanvas } = useRealtimeCanvasSync({
    canvas: fabricCanvas,
    enabled: enableCollaboration && !!fabricCanvas,
    onRemoteUpdate: (sender, timestamp) => {
      console.log(`Canvas updated by ${sender} at ${new Date(timestamp).toLocaleString()}`);
    }
  });
  
  // Update collaborator count for parent components
  useEffect(() => {
    if (onCollaboratorUpdate && collaborators.length > 0) {
      onCollaboratorUpdate(collaborators.length);
    }
  }, [collaborators, onCollaboratorUpdate]);
  
  // Set up canvas change handlers for collaboration
  useEffect(() => {
    if (!fabricCanvas || !enableCollaboration) return;
    
    const handleObjectModified = () => {
      syncCanvas(userName);
    };
    
    const handlePathCreated = () => {
      syncCanvas(userName);
    };
    
    const handleObjectAdded = () => {
      syncCanvas(userName);
    };
    
    const handleObjectRemoved = () => {
      syncCanvas(userName);
    };
    
    // Attach event handlers
    fabricCanvas.on('object:modified', handleObjectModified);
    fabricCanvas.on('path:created', handlePathCreated);
    fabricCanvas.on('object:added', handleObjectAdded);
    fabricCanvas.on('object:removed', handleObjectRemoved);
    
    // Initial sync
    const initialSyncTimer = setTimeout(() => {
      syncCanvas(userName);
    }, 1000);
    
    return () => {
      // Remove event handlers
      fabricCanvas.off('object:modified', handleObjectModified);
      fabricCanvas.off('path:created', handlePathCreated);
      fabricCanvas.off('object:added', handleObjectAdded);
      fabricCanvas.off('object:removed', handleObjectRemoved);
      clearTimeout(initialSyncTimer);
    };
  }, [fabricCanvas, enableCollaboration, syncCanvas, userName]);
  
  // Memoize handlers to prevent unnecessary re-renders
  const handleGridCreated = useCallback((isCreated: boolean) => {
    setIsGridReady(isCreated);
  }, []);
  
  const handleCloseGuide = useCallback((dontShowAgain: boolean) => {
    setShowGuide(false);
    if (dontShowAgain) {
      localStorage.setItem('hideDrawingGuide', 'true');
    }
  }, []);
  
  const handleOpenGuideChange = useCallback((open: boolean) => {
    setShowGuide(open);
  }, []);
  
  // Use memoized components for performance
  const { brushPreview, measurementGuide } = useMemoizedDrawingComponents({
    fabricCanvas,
    tool,
    lineColor,
    lineThickness,
    showGuide,
    handleCloseGuide,
    handleOpenGuideChange
  });
  
  // Check if guide should be shown on mount
  useEffect(() => {
    const hideGuide = localStorage.getItem('hideDrawingGuide') === 'true';
    
    if (!hideGuide) {
      const timer = setTimeout(() => {
        if (isMountedRef.current) {
          setShowGuide(true);
        }
      }, 1000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return (
    <>
      {/* Grid Layer */}
      {fabricCanvas && showGrid && (
        <ReliableGridLayer
          canvas={fabricCanvas}
          enabled={showGrid}
          onGridCreated={handleGridCreated}
        />
      )}
      
      {/* Brush Preview */}
      {brushPreview}
      
      {/* Measurement Guide Modal */}
      {measurementGuide}
      
      {/* Collaboration Indicator */}
      {enableCollaboration && collaborators.length > 0 && (
        <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {collaborators.length} {collaborators.length === 1 ? 'person' : 'people'} editing
        </div>
      )}
    </>
  );
};
