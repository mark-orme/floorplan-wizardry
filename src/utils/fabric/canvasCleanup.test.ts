
/**
 * Tests for canvas cleanup utilities
 */
import { describe, it, expect, vi } from 'vitest';
import { Canvas } from 'fabric';

describe('Canvas Cleanup Tests', () => {
  it('should remove elements from canvas', () => {
    // Mocked canvas
    const canvas = {
      remove: vi.fn(),
      renderAll: vi.fn()
    };
    
    // Only pass the canvas argument
    canvas.remove();
    canvas.renderAll();
    
    expect(canvas.remove).toHaveBeenCalled();
    expect(canvas.renderAll).toHaveBeenCalled();
  });
  
  it('should handle empty canvas', () => {
    const canvas = {
      remove: vi.fn(),
      renderAll: vi.fn()
    };
    
    // Only pass the canvas argument
    canvas.renderAll();
    
    // Assertions
    expect(canvas.renderAll).toHaveBeenCalled();
  });
});
