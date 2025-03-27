
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { createBasicEmergencyGrid, validateGrid, verifyGridExists, retryWithBackoff } from '../gridCreationUtils';
import { Canvas as FabricCanvas } from 'fabric';

// Mock Fabric to avoid DOM dependencies in tests
vi.mock('fabric', () => {
  // Create mock classes
  const MockLine = vi.fn().mockImplementation(() => ({
    type: 'line',
    visible: true
  }));
  
  const MockText = vi.fn().mockImplementation(() => ({
    type: 'text',
    visible: true
  }));
  
  // Create mock canvas
  const MockCanvas = vi.fn().mockImplementation(() => ({
    width: 800,
    height: 600,
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn().mockReturnValue(true),
    getObjects: vi.fn().mockReturnValue([]),
    sendObjectToBack: vi.fn(),
    bringObjectToFront: vi.fn(),
    requestRenderAll: vi.fn()
  }));
  
  return {
    Canvas: MockCanvas,
    Line: MockLine,
    Text: MockText
  };
});

describe('gridCreationUtils', () => {
  let canvas: FabricCanvas;
  let gridLayerRef: { current: any[] };
  
  beforeEach(() => {
    // Create a mock canvas
    canvas = new FabricCanvas();
    
    // Create a mock grid layer ref
    gridLayerRef = { current: [] };
  });
  
  test('should create grid objects', () => {
    const result = createBasicEmergencyGrid(canvas, gridLayerRef);
    expect(result.length).toBeGreaterThan(0);
  });
  
  test('should validate grid correctly', () => {
    gridLayerRef.current = [
      { type: 'line', visible: true },
      { type: 'line', visible: true }
    ];
    
    (canvas.contains as any).mockReturnValue(true);
    
    const result = validateGrid(canvas, gridLayerRef);
    expect(result).toBe(true);
  });

  test('should verify grid exists', () => {
    gridLayerRef.current = [
      { type: 'line', visible: true },
      { type: 'line', visible: true }
    ];
    
    (canvas.contains as any).mockReturnValue(true);
    
    const result = verifyGridExists(canvas, gridLayerRef);
    expect(result).toBe(true);
  });
});
