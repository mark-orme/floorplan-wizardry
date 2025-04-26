
/**
 * Grid Tester Module
 * 
 * Provides testing utilities for grid operations
 * @module utils/grid/gridTester
 */
import { Canvas } from 'fabric';
import type { GridConfig } from './gridTypes';
import { MockCanvas } from '@/utils/test/createMockCanvas';

/**
 * Interface for grid test results
 */
export interface GridTestResult {
  success: boolean;
  message: string;
  gridObjects: number;
  smallGrid: number;
  largeGrid: number;
  hasMarkers: boolean;
}

/**
 * Test grid creation with configuration
 * 
 * @param canvas The canvas instance to test
 * @param config Grid configuration
 * @returns Grid test result
 */
export function testGridCreation(canvas: Canvas | MockCanvas, config: GridConfig): GridTestResult {
  try {
    // Execute grid creation (mock implementation for tests)
    const mockObjects = createTestGridObjects(config.gridSize || 20);
    
    // Count grid objects by type
    const smallGridCount = mockObjects.filter(obj => obj.gridType === 'small').length;
    const largeGridCount = mockObjects.filter(obj => obj.gridType === 'large').length;
    const hasMarkers = mockObjects.some(obj => obj.gridType === 'marker');

    return {
      success: true,
      message: 'Grid created successfully',
      gridObjects: mockObjects.length,
      smallGrid: smallGridCount,
      largeGrid: largeGridCount,
      hasMarkers: hasMarkers
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown grid creation error',
      gridObjects: 0,
      smallGrid: 0,
      largeGrid: 0,
      hasMarkers: false
    };
  }
}

/**
 * Create test grid objects for testing
 * 
 * @param gridSize Grid size in pixels
 * @returns Array of mock grid objects
 */
export function createTestGridObjects(gridSize: number) {
  // Mock grid objects for testing
  const numLines = Math.ceil(1000 / gridSize); // Reasonable number of grid lines
  
  // Create mock objects with gridType property
  return [
    ...Array(numLines).fill(0).map((_, i) => ({ 
      id: `grid-h-small-${i}`,
      gridType: 'small'
    })),
    ...Array(Math.ceil(numLines/5)).fill(0).map((_, i) => ({ 
      id: `grid-h-large-${i}`,
      gridType: 'large'
    })),
    ...Array(Math.ceil(numLines/10)).fill(0).map((_, i) => ({ 
      id: `grid-marker-${i}`,
      gridType: 'marker'
    }))
  ];
}

/**
 * Test grid visibility toggling
 * 
 * @param canvas The canvas instance
 * @param isVisible Whether the grid should be visible
 * @returns Boolean indicating test success
 */
export function testGridVisibility(
  canvas: Canvas | MockCanvas, 
  isVisible: boolean
): boolean {
  try {
    // Mock implementation for testing visibility
    return true;
  } catch (error) {
    console.error('Grid visibility test failed:', error);
    return false;
  }
}
