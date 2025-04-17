
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useAutoSaveCanvas } from '@/hooks/useAutoSaveCanvas';
import { DrawingMode } from '@/constants/drawingModes';
import { ReliableGridLayer } from '@/components/canvas/ReliableGridLayer';
import { BrushCursorPreview } from '@/components/canvas/BrushCursorPreview';
import { MeasurementGuideModal } from '@/components/MeasurementGuideModal';
import { useMemoizedDrawingComponents } from '@/hooks/useMemoizedDrawingComponents';

interface DrawingManagerProps {
  fabricCanvas: FabricCanvas | null;
  tool: DrawingMode;
  lineColor: string;
  lineThickness: number;
  showGrid?: boolean;
  storageKey?: string;
  disableAutoSave?: boolean;
}

export const DrawingManager: React.FC<DrawingManagerProps> = ({
  fabricCanvas,
  tool,
  lineColor,
  lineThickness,
  showGrid = true,
  storageKey = 'drawing_autosave',
  disableAutoSave = false
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
    storageKey
  });
  
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
    </>
  );
};
