/**
 * Tests for canvas cleanup utilities
 */
import { describe, it, expect, vi } from 'vitest';
import { removeFromCanvas } from './canvasCleanup';

describe('Canvas Cleanup Tests', () => {
  it('should remove elements from canvas', () => {
    // Mocked canvas
    const canvas = {
      remove: vi.fn(),
      renderAll: vi.fn()
    };
    
    // Fix line 92: Only pass the canvas argument
    removeFromCanvas(canvas);
    
    expect(canvas.remove).toHaveBeenCalled();
    expect(canvas.renderAll).toHaveBeenCalled();
  });
  
  it('should handle empty canvas', () => {
    const canvas = {
      remove: vi.fn(),
      renderAll: vi.fn()
    };
    
    // Fix line 126: Only pass the canvas argument
    removeFromCanvas(canvas);
    
    // Assertions
    expect(canvas.renderAll).toHaveBeenCalled();
  });
});
