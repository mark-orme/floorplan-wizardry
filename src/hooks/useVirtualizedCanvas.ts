/**
 * Enhanced Canvas Virtualization Hook
 * Provides true object culling with tiled viewport for optimal performance
 */
import { useCallback, useEffect, useState, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { debounce } from '@/utils/debounce';
import logger from '@/utils/logger';

export interface VirtualizationPerformanceMetrics {
  fps: number;
  objectCount: number;
  visibleObjectCount: number;
  renderTime: number;
  viewportSize: { width: number; height: number };
  tileCount: number;
}

interface TileData {
  left: number;
  top: number;
  right: number;
  bottom: number;
  objects: Set<FabricObject>;
}

interface UseVirtualizedCanvasOptions {
  enabled?: boolean;
  paddingPx?: number;
  tileSize?: number;
  autoToggle?: boolean;
  objectThreshold?: number;
}

export const useVirtualizedCanvas = (
  canvasRef: React.MutableRefObject<FabricCanvas | null>,
  options: UseVirtualizedCanvasOptions = {}
) => {
  const {
    enabled = true,
    paddingPx = 200,
    tileSize = 500,
    autoToggle = true,
    objectThreshold = 100
  } = options;
  
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(enabled);
  const [performanceMetrics, setPerformanceMetrics] = useState<VirtualizationPerformanceMetrics>({
    fps: 60,
    objectCount: 0,
    visibleObjectCount: 0,
    renderTime: 0,
    viewportSize: { width: 0, height: 0 },
    tileCount: 0
  });
  
  // Keep track of visible area
  const visibleAreaRef = useRef({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  });
  
  // Store tiles for spatial partitioning
  const tilesRef = useRef<Map<string, TileData>>(new Map());
  
  // FPS tracking
  const fpsRef = useRef({
    frameCount: 0,
    lastTime: performance.now(),
    fps: 0
  });
  
  // Create a tile key from coordinates
  const getTileKey = useCallback((x: number, y: number): string => {
    const tileX = Math.floor(x / tileSize);
    const tileY = Math.floor(y / tileSize);
    return `${tileX}:${tileY}`;
  }, [tileSize]);
  
  // Initialize the tile system
  const initializeTiles = useCallback(() => {
    tilesRef.current.clear();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get all objects
    const objects = canvas.getObjects();
    
    // Add each object to appropriate tiles
    objects.forEach(obj => {
      try {
        const bounds = obj.getBoundingRect();
        
        // Get tiles that this object spans
        const startTileX = Math.floor(bounds.left / tileSize);
        const startTileY = Math.floor(bounds.top / tileSize);
        const endTileX = Math.floor((bounds.left + bounds.width) / tileSize);
        const endTileY = Math.floor((bounds.top + bounds.height) / tileSize);
        
        // Add to each overlapping tile
        for (let tileX = startTileX; tileX <= endTileX; tileX++) {
          for (let tileY = startTileY; tileY <= endTileY; tileY++) {
            const tileKey = `${tileX}:${tileY}`;
            
            // Create tile if it doesn't exist
            if (!tilesRef.current.has(tileKey)) {
              tilesRef.current.set(tileKey, {
                left: tileX * tileSize,
                top: tileY * tileSize,
                right: (tileX + 1) * tileSize,
                bottom: (tileY + 1) * tileSize,
                objects: new Set()
              });
            }
            
            // Add object to tile
            tilesRef.current.get(tileKey)?.objects.add(obj);
          }
        }
      } catch (error) {
        logger.error('Error adding object to tile', { error });
      }
    });
    
    logger.debug('Initialized virtualization tiles', { 
      tileCount: tilesRef.current.size,
      objectCount: objects.length
    });
    
    return tilesRef.current.size;
  }, [canvasRef, tileSize]);
  
  // Add an object to tiles
  const addObjectToTiles = useCallback((obj: FabricObject) => {
    try {
      const bounds = obj.getBoundingRect();
      
      // Get tiles that this object spans
      const startTileX = Math.floor(bounds.left / tileSize);
      const startTileY = Math.floor(bounds.top / tileSize);
      const endTileX = Math.floor((bounds.left + bounds.width) / tileSize);
      const endTileY = Math.floor((bounds.top + bounds.height) / tileSize);
      
      // Add to each overlapping tile
      for (let tileX = startTileX; tileX <= endTileX; tileX++) {
        for (let tileY = startTileY; tileY <= endTileY; tileY++) {
          const tileKey = `${tileX}:${tileY}`;
          
          // Create tile if it doesn't exist
          if (!tilesRef.current.has(tileKey)) {
            tilesRef.current.set(tileKey, {
              left: tileX * tileSize,
              top: tileY * tileSize,
              right: (tileX + 1) * tileSize,
              bottom: (tileY + 1) * tileSize,
              objects: new Set()
            });
          }
          
          // Add object to tile
          tilesRef.current.get(tileKey)?.objects.add(obj);
        }
      }
    } catch (error) {
      logger.error('Error adding object to tiles', { error });
    }
  }, [tileSize]);
  
  // Remove an object from tiles
  const removeObjectFromTiles = useCallback((obj: FabricObject) => {
    try {
      // Remove from all tiles
      tilesRef.current.forEach(tile => {
        tile.objects.delete(obj);
      });
      
      // Clean up empty tiles
      for (const [key, tile] of tilesRef.current.entries()) {
        if (tile.objects.size === 0) {
          tilesRef.current.delete(key);
        }
      }
    } catch (error) {
      logger.error('Error removing object from tiles', { error });
    }
  }, []);
  
  // Update object in tiles (remove and re-add)
  const updateObjectInTiles = useCallback((obj: FabricObject) => {
    removeObjectFromTiles(obj);
    addObjectToTiles(obj);
  }, [removeObjectFromTiles, addObjectToTiles]);
  
  // Calculate visible tiles
  const getVisibleTiles = useCallback(() => {
    const visibleTiles: TileData[] = [];
    
    if (tilesRef.current.size === 0) return visibleTiles;
    
    // Get visible area
    const { left, top, right, bottom } = visibleAreaRef.current;
    
    // Find visible tiles
    const startTileX = Math.floor((left - paddingPx) / tileSize);
    const startTileY = Math.floor((top - paddingPx) / tileSize);
    const endTileX = Math.floor((right + paddingPx) / tileSize);
    const endTileY = Math.floor((bottom + paddingPx) / tileSize);
    
    // Collect tiles in visible area
    for (let tileX = startTileX; tileX <= endTileX; tileX++) {
      for (let tileY = startTileY; tileY <= endTileY; tileY++) {
        const tileKey = `${tileX}:${tileY}`;
        const tile = tilesRef.current.get(tileKey);
        
        if (tile) {
          visibleTiles.push(tile);
        }
      }
    }
    
    return visibleTiles;
  }, [paddingPx, tileSize]);
  
  // Update visible objects
  const updateVisibleObjects = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !virtualizationEnabled) return;
    
    const startTime = performance.now();
    
    try {
      // Get canvas viewport transform
      const vpt = canvas.viewportTransform;
      if (!vpt) return;
      
      // Calculate visible area
      const zoom = canvas.getZoom();
      const visibleArea = {
        left: -vpt[4] / zoom,
        top: -vpt[5] / zoom,
        right: (-vpt[4] + canvas.width!) / zoom,
        bottom: (-vpt[5] + canvas.height!) / zoom
      };
      
      // Update visible area ref
      visibleAreaRef.current = visibleArea;
      
      // Get tiles in visible area
      const visibleTiles = getVisibleTiles();
      
      // Collect all objects in visible tiles
      const visibleObjects = new Set<FabricObject>();
      visibleTiles.forEach(tile => {
        tile.objects.forEach(obj => {
          visibleObjects.add(obj);
        });
      });
      
      // Update object visibility
      let visibleCount = 0;
      canvas.forEachObject(obj => {
        // Skip grid objects (always visible)
        if ((obj as any).isGrid) return;
        
        const isVisible = visibleObjects.has(obj);
        
        if (isVisible !== obj.visible) {
          obj.visible = isVisible;
          // Only call setCoords on visibility change
          obj.setCoords();
        }
        
        if (isVisible) visibleCount++;
      });
      
      // Update performance metrics
      const endTime = performance.now();
      
      // Update FPS
      fpsRef.current.frameCount++;
      const now = performance.now();
      const elapsed = now - fpsRef.current.lastTime;
      
      if (elapsed > 1000) {
        fpsRef.current.fps = Math.round((fpsRef.current.frameCount * 1000) / elapsed);
        fpsRef.current.frameCount = 0;
        fpsRef.current.lastTime = now;
        
        // Update metrics
        setPerformanceMetrics({
          fps: fpsRef.current.fps,
          objectCount: canvas.getObjects().length,
          visibleObjectCount: visibleCount,
          renderTime: endTime - startTime,
          viewportSize: { 
            width: canvas.width || 0, 
            height: canvas.height || 0 
          },
          tileCount: tilesRef.current.size
        });
      }
      
      canvas.requestRenderAll();
    } catch (error) {
      logger.error('Error updating visible objects', { error });
    }
  }, [canvasRef, virtualizationEnabled, getVisibleTiles]);
  
  // Debounced version of updateVisibleObjects
  const debouncedUpdateVisibleObjects = useCallback(
    debounce(updateVisibleObjects, 16), // ~60fps
    [updateVisibleObjects]
  );
  
  // Toggle virtualization on/off
  const toggleVirtualization = useCallback(() => {
    const newState = !virtualizationEnabled;
    setVirtualizationEnabled(newState);
    
    // If turning off, make all objects visible
    if (!newState) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.getObjects().forEach(obj => {
          obj.visible = true;
        });
        canvas.requestRenderAll();
      }
    } else {
      // If turning on, initialize tiles and update visibility
      initializeTiles();
      updateVisibleObjects();
    }
    
    logger.info(`Canvas virtualization ${newState ? 'enabled' : 'disabled'}`);
  }, [virtualizationEnabled, canvasRef, initializeTiles, updateVisibleObjects]);
  
  // Force refresh virtualization
  const refreshVirtualization = useCallback(() => {
    if (!virtualizationEnabled) return;
    
    initializeTiles();
    updateVisibleObjects();
  }, [virtualizationEnabled, initializeTiles, updateVisibleObjects]);
  
  // Initialize virtualization
  useEffect(() => {
    if (!virtualizationEnabled) return;
    
    initializeTiles();
    updateVisibleObjects();
  }, [virtualizationEnabled, initializeTiles, updateVisibleObjects]);
  
  // Auto-toggle virtualization based on object count
  useEffect(() => {
    if (!autoToggle) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const checkObjectCount = () => {
      const objectCount = canvas.getObjects().length;
      
      // Enable virtualization if object count exceeds threshold
      if (objectCount > objectThreshold && !virtualizationEnabled) {
        setVirtualizationEnabled(true);
        logger.info('Auto-enabling virtualization due to high object count', { objectCount });
      } 
      // Disable virtualization if object count is low
      else if (objectCount <= objectThreshold && virtualizationEnabled) {
        setVirtualizationEnabled(false);
        logger.info('Auto-disabling virtualization due to low object count', { objectCount });
      }
    };
    
    // Check initial object count
    checkObjectCount();
    
    // Set up event listeners for object changes
    const handleObjectAdded = () => {
      checkObjectCount();
    };
    
    const handleObjectRemoved = () => {
      checkObjectCount();
    };
    
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
    };
  }, [canvasRef, autoToggle, objectThreshold, virtualizationEnabled]);
  
  // Set up event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Handle viewport changes for virtualization
    const handleViewportChange = () => {
      if (virtualizationEnabled) {
        debouncedUpdateVisibleObjects();
      }
    };
    
    // Handle object modification
    const handleObjectModified = (e: any) => {
      if (virtualizationEnabled && e.target) {
        updateObjectInTiles(e.target);
        debouncedUpdateVisibleObjects();
      }
    };
    
    // Handle object added
    const handleObjectAdded = (e: any) => {
      if (virtualizationEnabled && e.target) {
        addObjectToTiles(e.target);
        debouncedUpdateVisibleObjects();
      }
    };
    
    // Handle object removed
    const handleObjectRemoved = (e: any) => {
      if (virtualizationEnabled && e.target) {
        removeObjectFromTiles(e.target);
        debouncedUpdateVisibleObjects();
      }
    };
    
    // Register event handlers
    canvas.on('mouse:wheel', handleViewportChange);
    canvas.on('mouse:down', handleViewportChange);
    canvas.on('mouse:up', handleViewportChange);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);
    
    // Handle resize
    const handleResize = () => {
      if (virtualizationEnabled) {
        refreshVirtualization();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up event handlers
    return () => {
      canvas.off('mouse:wheel', handleViewportChange);
      canvas.off('mouse:down', handleViewportChange);
      canvas.off('mouse:up', handleViewportChange);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:removed', handleObjectRemoved);
      window.removeEventListener('resize', handleResize);
    };
  }, [
    canvasRef,
    virtualizationEnabled,
    debouncedUpdateVisibleObjects,
    refreshVirtualization,
    addObjectToTiles,
    removeObjectFromTiles,
    updateObjectInTiles
  ]);
  
  return {
    virtualizationEnabled,
    performanceMetrics,
    toggleVirtualization,
    refreshVirtualization,
    visibleArea: visibleAreaRef.current
  };
};

// Utility for debouncing function calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
