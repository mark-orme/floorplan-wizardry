
/**
 * Tests for grid error handling utilities
 * Ensures error reporting and recovery work correctly
 * @module utils/__tests__/gridErrorHandling
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  GridErrorSeverity, 
  categorizeGridError,
  GRID_ERROR_MESSAGES
} from '../grid/errorTypes';
import { createGridRecoveryPlan } from '../grid/recoveryPlans';
import { Canvas } from 'fabric';

// Mock dependencies
vi.mock('../../utils/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn()
  }
}));

describe('Grid Error Handling', () => {
  let mockCanvas: Canvas;
  
  beforeEach(() => {
    // Create mock canvas for testing
    mockCanvas = {
      width: 800,
      height: 600,
      getObjects: vi.fn().mockReturnValue([]),
    } as unknown as Canvas;
    
    // Reset mocks
    vi.clearAllMocks();
  });
  
  // Test error categorization
  it('should correctly categorize errors by severity', () => {
    // Critical errors
    expect(categorizeGridError(new Error('canvas disposed'))).toBe(GridErrorSeverity.CRITICAL);
    expect(categorizeGridError(new Error('cannot read property "x" of undefined'))).toBe(GridErrorSeverity.CRITICAL);
    
    // High severity errors
    expect(categorizeGridError(new Error('canvas width not set'))).toBe(GridErrorSeverity.HIGH);
    expect(categorizeGridError(new Error('error during initialization'))).toBe(GridErrorSeverity.HIGH);
    
    // Medium severity errors
    expect(categorizeGridError(new Error('grid line not found'))).toBe(GridErrorSeverity.MEDIUM);
    expect(categorizeGridError(new Error('object position incorrect'))).toBe(GridErrorSeverity.MEDIUM);
    
    // Low severity errors (default)
    expect(categorizeGridError(new Error('unknown error'))).toBe(GridErrorSeverity.LOW);
  });
  
  // Test error messages
  it('should provide consistent error messages', () => {
    expect(GRID_ERROR_MESSAGES.GRID_CREATION_FAILED).toBeDefined();
    expect(GRID_ERROR_MESSAGES.CANVAS_INITIALIZATION_FAILED).toBeDefined();
    expect(GRID_ERROR_MESSAGES.GRID_RENDERING_ERROR).toBeDefined();
  });
  
  // Test recovery plan creation
  it('should create appropriate recovery plans based on error type', () => {
    // Canvas error should recommend resizing and clearing
    const canvasError = new Error('canvas initialization failed');
    const canvasPlan = createGridRecoveryPlan(canvasError, mockCanvas);
    
    expect(canvasPlan.clearCanvas).toBe(true);
    expect(canvasPlan.resizeCanvas).toBe(true);
    
    // Rendering error should recommend simplified grid
    const renderError = new Error('rendering error in grid');
    const renderPlan = createGridRecoveryPlan(renderError, mockCanvas);
    
    expect(renderPlan.useSimplifiedGrid).toBe(true);
    expect(renderPlan.disableBackgroundGrid).toBe(true);
    
    // Object error should clear canvas if there are objects
    mockCanvas.getObjects = vi.fn().mockReturnValue([{}, {}]);
    const objectError = new Error('object creation failed');
    const objectPlan = createGridRecoveryPlan(objectError, mockCanvas);
    
    expect(objectPlan.clearCanvas).toBe(true);
    expect(objectPlan.useSimplifiedGrid).toBe(true);
  });
});
