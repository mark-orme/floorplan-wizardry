
/**
 * Grid Creation Utilities
 * Fallback methods for grid creation when normal methods fail
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import logger from '@/utils/logger';

/**
 * Create a basic emergency grid when normal grid creation fails
 * @param canvas Fabric canvas instance
 * @returns Array of created grid objects
 */
export function createBasicEmergencyGrid(canvas: FabricCanvas): FabricObject[] {
  if (!canvas) {
    logger.error('Cannot create emergency grid: Canvas is null');
    console.error('Cannot create emergency grid: Canvas is null');
    return [];
  }
  
  try {
    logger.info('Creating emergency grid');
    console.log('🚨 Creating emergency grid');
    
    const emergencyGridObjects: FabricObject[] = [];
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridSize = 20;
    
    // Create horizontal grid lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: '#EEEEEE',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      } as any);
      
      canvas.add(line);
      emergencyGridObjects.push(line);
    }
    
    // Create vertical grid lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: '#EEEEEE',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      } as any);
      
      canvas.add(line);
      emergencyGridObjects.push(line);
    }
    
    // Create larger grid lines (every 100px)
    for (let i = 0; i <= width; i += 100) {
      const line = new Line([i, 0, i, height], {
        stroke: '#DDDDDD',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      } as any);
      
      canvas.add(line);
      emergencyGridObjects.push(line);
    }
    
    for (let i = 0; i <= height; i += 100) {
      const line = new Line([0, i, width, i], {
        stroke: '#DDDDDD',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      } as any);
      
      canvas.add(line);
      emergencyGridObjects.push(line);
    }
    
    // Send all grid objects to the back
    emergencyGridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.sendToBack(obj);
      }
    });
    
    canvas.requestRenderAll();
    
    logger.info(`Created ${emergencyGridObjects.length} emergency grid objects`);
    console.log(`✅ Created ${emergencyGridObjects.length} emergency grid objects`);
    
    return emergencyGridObjects;
  } catch (error) {
    logger.error('Failed to create emergency grid:', error);
    console.error('Failed to create emergency grid:', error);
    return [];
  }
}

/**
 * Utility to reset grid system progress
 */
export function resetGridProgress(): void {
  try {
    // Clear any stored grid state
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('grid_initialized');
      window.localStorage.removeItem('grid_created');
      window.localStorage.removeItem('grid_error');
    }
    
    logger.info('Reset grid progress');
    console.log('Reset grid progress');
  } catch (error) {
    logger.error('Error resetting grid progress:', error);
    console.error('Error resetting grid progress:', error);
  }
}

/**
 * Global utility for managing grid state
 */
export function initGridGlobals(): void {
  if (typeof window !== 'undefined') {
    // Add global grid helper functions
    (window as any).createGrid = createBasicEmergencyGrid;
    (window as any).resetGridProgress = resetGridProgress;
    
    // Add emergency reload function
    (window as any).emergencyReload = () => {
      resetGridProgress();
      window.location.reload();
    };
  }
}

// Initialize grid globals when this module loads
initGridGlobals();
