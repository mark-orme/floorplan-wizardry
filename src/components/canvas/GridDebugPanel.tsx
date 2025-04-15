
/**
 * Grid Debug Panel Component
 * Provides a UI for debugging grid issues
 */
import React, { useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Grid, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Search, 
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import logger from '@/utils/logger';
import { createGridEmergencyFix } from '@/utils/grid/gridVisibilityHelper';
import { getRenderCount } from '@/utils/canvas/renderTracker';

interface GridDebugPanelProps {
  canvas: FabricCanvas | null;
  gridLayerRef: React.MutableRefObject<any[]>;
  createGrid: () => any[];
  visible?: boolean;
}

export function GridDebugPanel({
  canvas, 
  gridLayerRef,
  createGrid,
  visible = false
}: GridDebugPanelProps) {
  const [gridStats, setGridStats] = useState<{
    total: number;
    onCanvas: number;
    visible: number;
    invisible: number;
    lastCheck: string;
  }>({
    total: 0,
    onCanvas: 0,
    visible: 0,
    invisible: 0,
    lastCheck: '-'
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  
  // Update grid stats periodically
  useEffect(() => {
    if (!visible || !canvas) return;
    
    const updateStats = () => {
      try {
        const gridObjects = gridLayerRef.current;
        const onCanvas = gridObjects.filter(obj => canvas.contains(obj));
        const visibleObjects = onCanvas.filter(obj => obj.visible);
        
        setGridStats({
          total: gridObjects.length,
          onCanvas: onCanvas.length,
          visible: visibleObjects.length,
          invisible: onCanvas.length - visibleObjects.length,
          lastCheck: new Date().toLocaleTimeString()
        });
      } catch (error) {
        console.error('Error updating grid stats:', error);
      }
    };
    
    // Update immediately
    updateStats();
    
    // Set up interval
    const interval = setInterval(updateStats, 2000);
    
    return () => clearInterval(interval);
  }, [canvas, gridLayerRef, visible]);
  
  // Analyze grid health
  const analyzeGrid = () => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      logger.info('Analyzing grid health');
      
      const gridObjects = gridLayerRef.current;
      const canvasObjects = canvas.getObjects();
      const gridOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
      const visibleGrid = gridOnCanvas.filter(obj => obj.visible);
      
      const analysis = {
        timestamp: new Date().toISOString(),
        canvas: {
          width: canvas.width,
          height: canvas.height,
          objectCount: canvasObjects.length,
          isRendering: getRenderCount(canvas) > 0 // Use our render tracking utility instead
        },
        grid: {
          total: gridObjects.length,
          onCanvas: gridOnCanvas.length,
          visible: visibleGrid.length,
          invisible: gridOnCanvas.length - visibleGrid.length,
          missing: gridObjects.length - gridOnCanvas.length
        },
        issues: [] as string[]
      };
      
      // Identify issues
      if (analysis.grid.total === 0) {
        analysis.issues.push('No grid objects found');
      }
      
      if (analysis.grid.missing > 0) {
        analysis.issues.push(`${analysis.grid.missing} grid objects missing from canvas`);
      }
      
      if (analysis.grid.invisible > 0) {
        analysis.issues.push(`${analysis.grid.invisible} grid objects are invisible`);
      }
      
      if (!canvas.width || !canvas.height) {
        analysis.issues.push('Canvas has invalid dimensions');
      }
      
      // Log analysis
      console.log('Grid Analysis:', analysis);
      logger.info('Grid analysis complete', {
        issues: analysis.issues.length,
        gridTotal: analysis.grid.total,
        visible: analysis.grid.visible
      });
      
      // Show toast with results
      if (analysis.issues.length > 0) {
        toast.warning(`Found ${analysis.issues.length} grid issues`, {
          description: analysis.issues.join(', '),
          duration: 5000
        });
      } else {
        toast.success('Grid appears healthy');
      }
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing grid:', error);
      toast.error('Error analyzing grid');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Fix grid visibility
  const fixGridVisibility = () => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }
    
    try {
      logger.info('Fixing grid visibility');
      
      const gridObjects = gridLayerRef.current;
      let fixesApplied = 0;
      
      // Add missing objects to canvas
      gridObjects.forEach(obj => {
        if (!canvas.contains(obj)) {
          canvas.add(obj);
          canvas.sendToBack(obj);
          fixesApplied++;
        }
        
        // Make invisible objects visible
        if (!obj.visible) {
          obj.set('visible', true);
          fixesApplied++;
        }
      });
      
      // Force render
      canvas.requestRenderAll();
      
      // Log results
      logger.info(`Applied ${fixesApplied} grid visibility fixes`);
      
      // Show toast with results
      if (fixesApplied > 0) {
        toast.success(`Fixed ${fixesApplied} grid visibility issues`);
      } else {
        toast.info('No grid visibility issues to fix');
      }
      
      // Force second render after short delay
      setTimeout(() => {
        canvas.requestRenderAll();
      }, 100);
      
      return fixesApplied;
    } catch (error) {
      console.error('Error fixing grid visibility:', error);
      toast.error('Error fixing grid visibility');
      return 0;
    }
  };
  
  // Recreate grid
  const recreateGrid = () => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }
    
    try {
      logger.info('Recreating grid');
      
      // Remove existing grid objects
      const existingGrid = gridLayerRef.current;
      existingGrid.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      
      // Create new grid
      const newGrid = createGrid();
      
      // Update grid reference
      gridLayerRef.current = newGrid;
      
      // Make grid visible
      newGrid.forEach(obj => {
        obj.set('visible', true);
        canvas.sendToBack(obj);
      });
      
      // Force render
      canvas.requestRenderAll();
      
      // Log results
      logger.info(`Grid recreated with ${newGrid.length} objects`);
      
      // Show toast with results
      toast.success(`Grid recreated with ${newGrid.length} objects`);
      
      // Force second render after short delay
      setTimeout(() => {
        canvas.requestRenderAll();
      }, 100);
      
      return newGrid.length;
    } catch (error) {
      console.error('Error recreating grid:', error);
      toast.error('Error recreating grid');
      return 0;
    }
  };
  
  // Toggle grid visibility
  const toggleGridVisibility = () => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }
    
    try {
      const gridObjects = gridLayerRef.current;
      const newVisibility = !showGrid;
      
      gridObjects.forEach(obj => {
        obj.set('visible', newVisibility);
      });
      
      canvas.requestRenderAll();
      
      setShowGrid(newVisibility);
      
      toast.info(`Grid ${newVisibility ? 'shown' : 'hidden'}`);
      logger.info(`Grid visibility toggled to ${newVisibility}`);
      
      return newVisibility;
    } catch (error) {
      console.error('Error toggling grid visibility:', error);
      toast.error('Error toggling grid visibility');
      return showGrid;
    }
  };
  
  // Emergency fix
  const emergencyFix = () => {
    if (!canvas) {
      toast.error('Canvas not available');
      return;
    }
    
    try {
      logger.info('Applying emergency grid fix');
      
      // Create emergency fix function
      const fix = createGridEmergencyFix(canvas, createGrid);
      
      // Apply fix
      fix();
      
      // Update stats
      const updateStats = () => {
        const gridObjects = gridLayerRef.current;
        const onCanvas = gridObjects.filter(obj => canvas.contains(obj));
        const visibleObjects = onCanvas.filter(obj => obj.visible);
        
        setGridStats({
          total: gridObjects.length,
          onCanvas: onCanvas.length,
          visible: visibleObjects.length,
          invisible: onCanvas.length - visibleObjects.length,
          lastCheck: new Date().toLocaleTimeString()
        });
      };
      
      // Update stats after a short delay
      setTimeout(updateStats, 200);
      
      return true;
    } catch (error) {
      console.error('Error applying emergency grid fix:', error);
      toast.error('Error applying emergency grid fix');
      return false;
    }
  };
  
  // Check if there are issues
  const hasIssues = gridStats.invisible > 0 || gridStats.total === 0 || gridStats.onCanvas < gridStats.total;
  
  if (!visible) return null;
  
  return (
    <div className="absolute top-2 right-2 bg-white/90 p-3 rounded shadow-md z-50 text-xs w-64">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold flex items-center">
          <Grid className="w-4 h-4 mr-1" />
          Grid Debug Panel
        </div>
        {hasIssues && (
          <Badge variant="destructive" className="text-[10px] h-5">
            <AlertTriangle className="w-3 h-3 mr-1" /> Issues
          </Badge>
        )}
      </div>
      
      <div className="space-y-1 mb-2 text-[11px]">
        <div className="grid grid-cols-2 gap-1">
          <div>Total grid objects:</div>
          <div className="font-mono">{gridStats.total}</div>
          
          <div>On canvas:</div>
          <div className={`font-mono ${gridStats.onCanvas < gridStats.total ? 'text-red-500' : ''}`}>
            {gridStats.onCanvas}
          </div>
          
          <div>Visible:</div>
          <div className={`font-mono ${gridStats.visible < gridStats.onCanvas ? 'text-red-500' : ''}`}>
            {gridStats.visible}
          </div>
          
          <div>Last check:</div>
          <div className="font-mono">{gridStats.lastCheck}</div>
        </div>
      </div>
      
      <Separator className="my-2" />
      
      <div className="grid grid-cols-2 gap-1 mb-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-7 text-xs"
          onClick={analyzeGrid}
          disabled={isAnalyzing}
        >
          <Search className="w-3 h-3 mr-1" />
          Analyze
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="h-7 text-xs"
          onClick={fixGridVisibility}
        >
          <Eye className="w-3 h-3 mr-1" />
          Fix Visibility
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="h-7 text-xs"
          onClick={recreateGrid}
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Recreate
        </Button>
        
        <Button 
          size="sm" 
          variant={showGrid ? "default" : "outline"} 
          className="h-7 text-xs"
          onClick={toggleGridVisibility}
        >
          {showGrid ? (
            <Eye className="w-3 h-3 mr-1" />
          ) : (
            <EyeOff className="w-3 h-3 mr-1" />
          )}
          {showGrid ? "Hide" : "Show"}
        </Button>
      </div>
      
      <Button 
        size="sm" 
        variant="destructive" 
        className="w-full h-7 text-xs"
        onClick={emergencyFix}
      >
        <AlertTriangle className="w-3 h-3 mr-1" />
        Emergency Fix
      </Button>
      
      <div className="text-[10px] text-gray-500 mt-2">
        <div className="flex items-center">
          <BookOpen className="w-3 h-3 mr-1" />
          Open console for detailed logs
        </div>
      </div>
    </div>
  );
}
