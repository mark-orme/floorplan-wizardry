
/**
 * Infinite grid renderer
 * Provides functionality to create and manage an infinite scrolling grid
 * @module utils/grid/infiniteGridRenderer
 */
import { Canvas, Object as FabricObject } from 'fabric';
import logger from '@/utils/logger';

// Type definitions
interface InfiniteGridOptions {
  // Basic grid appearance
  color?: string;
  majorColor?: string;
  spacing?: number;
  majorSpacing?: number;
  opacity?: number;
  majorOpacity?: number;
  
  // Performance options
  renderMargin?: number;
  updateThreshold?: number;
  maxLines?: number;
}

interface ViewportBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface GridState {
  lines: FabricObject[];
  majorLines: FabricObject[];
  markers: FabricObject[];
  lastBounds: ViewportBounds;
  initialized: boolean;
}

// Create a grid renderer
export function createInfiniteGridRenderer(canvas: Canvas, options: InfiniteGridOptions = {}) {
  // Default options
  const {
    color = '#e0e0e0',
    majorColor = '#c0c0c0',
    spacing = 20,
    majorSpacing = 100,
    opacity = 0.4,
    majorOpacity = 0.6,
    renderMargin = 500,
    updateThreshold = 100,
    maxLines = 1000
  } = options;
  
  // Grid state
  const state: GridState = {
    lines: [],
    majorLines: [],
    markers: [],
    lastBounds: { left: 0, top: 0, right: 0, bottom: 0 },
    initialized: false
  };
  
  /**
   * Calculate current viewport bounds with margin
   */
  function getViewportBounds(): ViewportBounds {
    const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
    const zoom = canvas.getZoom();
    
    // Calculate viewport boundaries in object coordinates
    const width = canvas.width || 0;
    const height = canvas.height || 0;
    
    // Apply inverse transform to get object coordinates
    const invZoom = 1 / zoom;
    
    const bounds = {
      left: -vpt[4] * invZoom - renderMargin,
      top: -vpt[5] * invZoom - renderMargin,
      right: (-vpt[4] + width) * invZoom + renderMargin,
      bottom: (-vpt[5] + height) * invZoom + renderMargin,
    };
    
    return bounds;
  }
  
  /**
   * Check if bounds have changed significantly
   */
  function boundsChangedSignificantly(oldBounds: ViewportBounds, newBounds: ViewportBounds): boolean {
    return (
      Math.abs(oldBounds.left - newBounds.left) > updateThreshold ||
      Math.abs(oldBounds.top - newBounds.top) > updateThreshold ||
      Math.abs(oldBounds.right - newBounds.right) > updateThreshold ||
      Math.abs(oldBounds.bottom - newBounds.bottom) > updateThreshold
    );
  }
  
  /**
   * Create grid lines for current viewport
   */
  function createGridLines(): void {
    try {
      // Clear existing grid
      clearGrid();
      
      // Get current bounds
      const bounds = getViewportBounds();
      state.lastBounds = bounds;
      
      // Calculate line positions
      const minX = Math.floor(bounds.left / spacing) * spacing;
      const maxX = Math.ceil(bounds.right / spacing) * spacing;
      const minY = Math.floor(bounds.top / spacing) * spacing;
      const maxY = Math.ceil(bounds.bottom / spacing) * spacing;
      
      const zoom = canvas.getZoom();
      const strokeWidth = 1 / zoom;
      
      // Create lines with limits to prevent too many lines
      const lineCountX = Math.min(Math.ceil((maxX - minX) / spacing), maxLines / 2);
      const lineCountY = Math.min(Math.ceil((maxY - minY) / spacing), maxLines / 2);
      
      // Create vertical lines
      for (let i = 0; i <= lineCountX; i++) {
        const x = minX + i * spacing;
        
        // Check if it's a major line
        const isMajor = Math.abs(x % majorSpacing) < 0.001;
        
        const line = new window.fabric.Line([x, bounds.top, x, bounds.bottom], {
          stroke: isMajor ? majorColor : color,
          strokeWidth,
          opacity: isMajor ? majorOpacity : opacity,
          selectable: false,
          evented: false,
          originX: 'center',
          originY: 'center'
        });
        
        canvas.add(line);
        
        if (isMajor) {
          state.majorLines.push(line);
        } else {
          state.lines.push(line);
        }
      }
      
      // Create horizontal lines
      for (let i = 0; i <= lineCountY; i++) {
        const y = minY + i * spacing;
        
        // Check if it's a major line
        const isMajor = Math.abs(y % majorSpacing) < 0.001;
        
        const line = new window.fabric.Line([bounds.left, y, bounds.right, y], {
          stroke: isMajor ? majorColor : color,
          strokeWidth,
          opacity: isMajor ? majorOpacity : opacity,
          selectable: false,
          evented: false,
          originX: 'center',
          originY: 'center'
        });
        
        canvas.add(line);
        
        if (isMajor) {
          state.majorLines.push(line);
        } else {
          state.lines.push(line);
        }
      }
      
      // Move all grid lines to back
      [...state.lines, ...state.majorLines].forEach(line => {
        canvas.sendToBack(line);
      });
      
      canvas.requestRenderAll();
      state.initialized = true;
      
    } catch (error) {
      logger.error('Error creating infinite grid:', error instanceof Error ? error.message : String(error));
    }
  }
  
  /**
   * Clear all grid lines
   */
  function clearGrid(): void {
    try {
      // Remove all lines and markers
      [...state.lines, ...state.majorLines, ...state.markers].forEach(obj => {
        canvas.remove(obj);
      });
      
      // Reset state
      state.lines = [];
      state.majorLines = [];
      state.markers = [];
      
    } catch (error) {
      logger.error('Error clearing grid:', error instanceof Error ? error.message : String(error));
    }
  }
  
  /**
   * Update grid when viewport changes
   */
  function updateGrid(): void {
    const newBounds = getViewportBounds();
    
    // Check if we need to redraw
    if (!state.initialized || boundsChangedSignificantly(state.lastBounds, newBounds)) {
      createGridLines();
    }
  }
  
  /**
   * Initialize the infinite grid
   */
  function initialize(): void {
    if (state.initialized) return;
    
    // Create initial grid
    createGridLines();
    
    // Set up viewport change handlers
    canvas.on('mouse:wheel', updateGrid);
    canvas.on('object:moving', updateGrid);
    canvas.on('after:render', updateGrid);
  }
  
  // Public API
  return {
    initialize,
    updateGrid,
    clearGrid,
    
    // Set visible state
    setVisible(visible: boolean): void {
      [...state.lines, ...state.majorLines].forEach(line => {
        line.set('visible', visible);
      });
      canvas.requestRenderAll();
    },
    
    // Cleanup when done
    destroy(): void {
      clearGrid();
      canvas.off('mouse:wheel', updateGrid);
      canvas.off('object:moving', updateGrid);
      canvas.off('after:render', updateGrid);
      state.initialized = false;
    }
  };
}
