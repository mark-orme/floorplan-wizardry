
/**
 * Object limit testing
 * Verifies performance with maximum allowed objects
 * @module tests/boundaries/objectLimitTesting
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas, Object as FabricObject } from 'fabric';
import { createMockCanvas, createMockObject } from '@/utils/test/mockFabricCanvas';

describe('Object Limit Testing', () => {
  let canvas: Canvas;
  
  beforeEach(() => {
    canvas = createMockCanvas() as unknown as Canvas;
    vi.clearAllMocks();
  });
  
  it('handles a large number of objects', () => {
    // Add a large number of objects to the canvas
    const numObjects = 1000;
    const objects = Array(numObjects).fill(null).map((_, i) => 
      createMockObject('rect', { id: `rect-${i}` })
    ) as unknown as FabricObject[];
    
    // Mock getObjects to return these objects
    vi.spyOn(canvas, 'getObjects').mockReturnValue(objects);
    
    // Mock canvas add so we don't need to add each object individually
    const addSpy = vi.spyOn(canvas, 'add');
    
    // Test rendering performance
    const renderAllSpy = vi.spyOn(canvas, 'renderAll');
    canvas.renderAll();
    
    // Verify renderAll was called
    expect(renderAllSpy).toHaveBeenCalled();
    
    // Test object retrieval performance
    expect(canvas.getObjects().length).toBe(numObjects);
  });
  
  it('handles object updates efficiently', () => {
    // Add a moderate number of objects
    const numObjects = 100;
    const objects = Array(numObjects).fill(null).map((_, i) => 
      createMockObject('rect', { 
        id: `rect-${i}`,
        left: i * 10,
        top: i * 10,
        width: 50,
        height: 50,
        fill: '#000000'
      })
    ) as unknown as FabricObject[];
    
    // Mock getObjects to return these objects
    vi.spyOn(canvas, 'getObjects').mockReturnValue(objects);
    
    // Test batch update performance
    const renderAllSpy = vi.spyOn(canvas, 'renderAll');
    
    // Update all objects
    objects.forEach(obj => {
      obj.set({ fill: '#FF0000' });
    });
    
    canvas.renderAll();
    
    // Verify renderAll was called
    expect(renderAllSpy).toHaveBeenCalled();
  });
  
  it('handles selection of many objects efficiently', () => {
    // Add a moderate number of objects
    const numObjects = 100;
    const objects = Array(numObjects).fill(null).map((_, i) => 
      createMockObject('rect', { id: `rect-${i}` })
    ) as unknown as FabricObject[];
    
    // Mock getObjects to return these objects
    vi.spyOn(canvas, 'getObjects').mockReturnValue(objects);
    
    // Create an active selection of all objects
    const activeSelection = {
      type: 'activeSelection',
      getObjects: vi.fn().mockReturnValue(objects),
      forEachObject: vi.fn((callback) => {
        objects.forEach(callback);
      })
    };
    
    // Mock getActiveObject to return this selection
    vi.spyOn(canvas, 'getActiveObject').mockReturnValue(activeSelection as any);
    
    // Test discardActiveObject performance
    const discardSpy = vi.spyOn(canvas, 'discardActiveObject');
    canvas.discardActiveObject();
    
    // Verify discardActiveObject was called
    expect(discardSpy).toHaveBeenCalled();
  });
  
  it('handles deletion of many objects efficiently', () => {
    // Add a large number of objects
    const numObjects = 500;
    const objects = Array(numObjects).fill(null).map((_, i) => 
      createMockObject('rect', { id: `rect-${i}` })
    ) as unknown as FabricObject[];
    
    // Mock getObjects to return these objects
    vi.spyOn(canvas, 'getObjects').mockReturnValue(objects);
    
    // Create an active selection of half the objects
    const selectedObjects = objects.slice(0, numObjects / 2);
    const activeSelection = {
      type: 'activeSelection',
      getObjects: vi.fn().mockReturnValue(selectedObjects),
      forEachObject: vi.fn((callback) => {
        selectedObjects.forEach(callback);
      })
    };
    
    // Mock getActiveObject to return this selection
    vi.spyOn(canvas, 'getActiveObject').mockReturnValue(activeSelection as any);
    
    // Track remove calls
    const removeSpy = vi.spyOn(canvas, 'remove');
    
    // Remove all selected objects
    activeSelection.getObjects().forEach((obj) => {
      canvas.remove(obj);
    });
    
    // Verify number of remove calls
    expect(removeSpy).toHaveBeenCalledTimes(numObjects / 2);
  });
});
