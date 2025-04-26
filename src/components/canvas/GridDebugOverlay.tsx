
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import * as gridConstants from '@/constants/gridConstants';

interface GridDebugOverlayProps {
  canvas: FabricCanvas | null;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showGridInfo?: boolean;
  showPerformance?: boolean;
}

export const GridDebugOverlay: React.FC<GridDebugOverlayProps> = ({
  canvas,
  position = 'bottom-right',
  showGridInfo = false,
  showPerformance = false
}) => {
  const [stats, setStats] = useState({
    gridObjects: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    visibleGridLines: 0
  });

  // Update statistics
  useEffect(() => {
    if (!canvas) return;
    
    const updateStats = () => {
      const allObjects = canvas.getObjects();
      const gridObjects = allObjects.filter(obj => 
        obj.get('objectType') === 'grid' || 
        (obj as any).gridObject === true
      );
      
      const visibleGridLines = gridObjects.filter(obj => obj.visible).length;
      
      setStats({
        gridObjects: gridObjects.length,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        visibleGridLines
      });
    };
    
    // Initial update
    updateStats();
    
    // Setup periodic updates
    const interval = setInterval(updateStats, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, [canvas]);
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };
  
  // If canvas is null or debugging is not enabled
  if (!canvas || (!showGridInfo && !showPerformance)) {
    return null;
  }
  
  // Auto-fix grid if configured
  const handleFixGrid = () => {
    if (!canvas) return;
    
    const gridAutoFix = gridConstants.GRID_AUTO_FIX;
    if (!gridAutoFix) return;
    
    // Logic for fixing grid would go here
    console.log('Auto-fixing grid');
  };
  
  return (
    <div 
      className={`fixed z-50 p-2 bg-black/70 text-white text-xs rounded-md ${positionClasses[position]}`}
    >
      <div className="font-semibold mb-1">Grid Debug</div>
      
      {showGridInfo && (
        <>
          <div>Size: {stats.canvasWidth} × {stats.canvasHeight}</div>
          <div>Grid Objects: {stats.gridObjects}</div>
          <div>Visible Lines: {stats.visibleGridLines}</div>
          <div>Health: {stats.visibleGridLines === stats.gridObjects ? '✅' : '⚠️'}</div>
        </>
      )}
      
      {showPerformance && (
        <div className="border-t border-white/30 mt-1 pt-1">
          <div>Objects: {canvas.getObjects().length}</div>
          <div>Background: {canvas.backgroundColor || 'none'}</div>
        </div>
      )}
      
      <button 
        className="mt-1 px-2 py-1 bg-blue-500 text-white rounded text-xs w-full"
        onClick={handleFixGrid}
      >
        Fix Grid
      </button>
    </div>
  );
};
