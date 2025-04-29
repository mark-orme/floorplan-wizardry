
import { vi, describe, it, expect } from 'vitest';
import { DrawingMode } from '@/constants/drawingModes';
import { DrawingTool } from '@/types/floorPlanTypes';
import { asDrawingMode, asDrawingTool } from '@/utils/drawing/drawingToolAdapter';

describe('useDrawingToolAdapter', () => {
  it('should convert DrawingMode to DrawingTool', () => {
    // Test conversions
    expect(asDrawingTool(DrawingMode.SELECT)).toBe('select');
    expect(asDrawingTool(DrawingMode.PAN)).toBe('pan');
    // Add the existing DrawingMode to be compatible
    expect(asDrawingTool(DrawingMode.LINE)).toBe('line');
  });

  it('should convert DrawingTool to DrawingMode', () => {
    // Test conversions
    expect(asDrawingMode('select' as DrawingTool)).toBe(DrawingMode.SELECT);
    expect(asDrawingMode('pan' as DrawingTool)).toBe(DrawingMode.PAN);
    expect(asDrawingMode('line' as DrawingTool)).toBe(DrawingMode.LINE);
  });
});
