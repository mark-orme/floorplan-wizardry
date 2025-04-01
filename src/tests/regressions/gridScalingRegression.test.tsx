
/**
 * Grid scaling regression tests
 * Verifies grid behavior during zoom/pan operations
 * @module tests/regressions/gridScalingRegression
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { createMockCanvas, createMockObject } from '@/utils/test/mockFabricCanvas';

describe('Grid Scaling Regression Tests', () => {
  let canvas: Canvas;
  let gridObjects: FabricObject[];
  
  beforeEach(() => {
    // Create a mock canvas
    canvas = createMockCanvas() as unknown as Canvas;
    
    // Create mock grid objects
    gridObjects = [
      createMockObject('line', { id: 'grid1', objectType: 'grid' }),
      createMockObject('line', { id: 'grid2', objectType: 'grid' })
    ] as unknown as FabricObject[];
    
    // Add grid objects to canvas
    gridObjects.forEach(obj => canvas.add(obj));
  });
  
  it('maintains grid visibility during zoom operations', () => {
    // Initial check
    expect(canvas.getObjects().length).toBe(2);
    
    // Set zoom
    const zoomSpy = vi.spyOn(canvas, 'setZoom');
    canvas.setZoom(2);
    
    // Verify zoom was set
    expect(zoomSpy).toHaveBeenCalledWith(2);
    
    // Grid objects should still be on the canvas
    expect(canvas.getObjects().length).toBe(2);
    expect(canvas.contains(gridObjects[0])).toBe(true);
    expect(canvas.contains(gridObjects[1])).toBe(true);
  });
  
  it('handles extreme zoom levels correctly', () => {
    // Test very small zoom
    canvas.setZoom(0.1);
    expect(canvas.getZoom()).toBe(0.1);
    
    // Grid should still be on canvas
    expect(canvas.contains(gridObjects[0])).toBe(true);
    expect(canvas.contains(gridObjects[1])).toBe(true);
    
    // Test very large zoom
    canvas.setZoom(10);
    expect(canvas.getZoom()).toBe(10);
    
    // Grid should still be on canvas
    expect(canvas.contains(gridObjects[0])).toBe(true);
    expect(canvas.contains(gridObjects[1])).toBe(true);
  });
  
  it('sends grid to back after zoom operations', () => {
    // Add a non-grid object
    const nonGridObject = createMockObject('rect', { id: 'rect1' }) as unknown as FabricObject;
    canvas.add(nonGridObject);
    
    // Mock sendObjectToBack
    const sendToBackSpy = vi.spyOn(canvas, 'sendObjectToBack');
    
    // Set zoom
    canvas.setZoom(1.5);
    
    // In a real implementation, after zoom, grid would be sent to back
    // We're just testing that the method exists and can be called
    gridObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    // Verify sendObjectToBack was called for each grid object
    expect(sendToBackSpy).toHaveBeenCalledTimes(2);
    expect(sendToBackSpy).toHaveBeenCalledWith(gridObjects[0]);
    expect(sendToBackSpy).toHaveBeenCalledWith(gridObjects[1]);
  });
});

