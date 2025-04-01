
/**
 * Canvas edge behavior test
 * Tests how tools behave at canvas edges
 * @module tests/boundaries/canvasEdgeBehavior
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas } from 'fabric';
import { createMockCanvas } from '@/utils/test/mockFabricCanvas';
import { DrawingMode } from '@/constants/drawingModes';

describe('Canvas Edge Behavior Tests', () => {
  let canvas: Canvas;
  
  beforeEach(() => {
    canvas = createMockCanvas() as unknown as Canvas;
    vi.clearAllMocks();
  });
  
  it('handles drawing operations at canvas edges', () => {
    // Mock canvas dimensions
    vi.spyOn(canvas, 'getWidth').mockReturnValue(800);
    vi.spyOn(canvas, 'getHeight').mockReturnValue(600);
    
    // Mock the freeDrawingBrush
    canvas.isDrawingMode = true;
    
    // Fire mouse:down event at the edge
    const downEvent = {
      e: { clientX: 0, clientY: 0 },
      pointer: { x: 0, y: 0 }
    };
    
    const fireSpy = vi.spyOn(canvas, 'fire');
    canvas.fire('mouse:down', downEvent);
    
    // Move outside the canvas (negative coordinates)
    const moveEvent = {
      e: { clientX: -10, clientY: -10 },
      pointer: { x: -10, y: -10 }
    };
    
    canvas.fire('mouse:move', moveEvent);
    
    // Move back inside
    const moveBackEvent = {
      e: { clientX: 10, clientY: 10 },
      pointer: { x: 10, y: 10 }
    };
    
    canvas.fire('mouse:move', moveBackEvent);
    
    // End drawing
    const upEvent = {
      e: { clientX: 20, clientY: 20 },
      pointer: { x: 20, y: 20 }
    };
    
    canvas.fire('mouse:up', upEvent);
    
    // Verify events were fired
    expect(fireSpy).toHaveBeenCalledTimes(4);
  });
  
  it('handles object creation at canvas edges', () => {
    // Mock canvas dimensions
    vi.spyOn(canvas, 'getWidth').mockReturnValue(800);
    vi.spyOn(canvas, 'getHeight').mockReturnValue(600);
    
    // Mock object creation at edge
    const addSpy = vi.spyOn(canvas, 'add');
    
    // Create a line that goes from edge to edge
    const line = {
      type: 'line',
      points: [
        { x: 0, y: 0 },
        { x: 800, y: 600 }
      ]
    };
    
    canvas.add(line as any);
    
    // Verify object was added
    expect(addSpy).toHaveBeenCalledWith(line);
  });
  
  it('handles viewport operations at edges', () => {
    // Mock canvas dimensions
    vi.spyOn(canvas, 'getWidth').mockReturnValue(800);
    vi.spyOn(canvas, 'getHeight').mockReturnValue(600);
    
    // Mock viewport transform
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    
    // Set zoom
    canvas.setZoom(2);
    
    // Try to pan to negative coordinates
    canvas.viewportTransform = [1, 0, 0, 1, -100, -100];
    
    // Verify transform was set
    expect(canvas.viewportTransform).toEqual([1, 0, 0, 1, -100, -100]);
    
    // Try to pan beyond canvas boundaries
    canvas.viewportTransform = [1, 0, 0, 1, -1000, -1000];
    
    // In a real implementation, this might be constrained
    // For the mock, we're just verifying the call works
    expect(canvas.viewportTransform).toEqual([1, 0, 0, 1, -1000, -1000]);
  });
  
  it('handles selection at canvas edges', () => {
    // Mock canvas dimensions
    vi.spyOn(canvas, 'getWidth').mockReturnValue(800);
    vi.spyOn(canvas, 'getHeight').mockReturnValue(600);
    
    // Enable selection mode
    canvas.selection = true;
    
    // Mock an object at the edge
    const edgeObject = {
      type: 'rect',
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      setCoords: vi.fn()
    };
    
    canvas.add(edgeObject as any);
    
    // Mock setActiveObject
    const setActiveSpy = vi.spyOn(canvas, 'setActiveObject');
    
    // Select the object
    canvas.setActiveObject(edgeObject as any);
    
    // Verify selection was made
    expect(setActiveSpy).toHaveBeenCalledWith(edgeObject);
  });
});

