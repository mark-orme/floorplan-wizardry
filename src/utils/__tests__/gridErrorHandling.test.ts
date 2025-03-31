
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

// Create a mock canvas factory
const createMockCanvas = (config = {}) => {
  return {
    width: 800,
    height: 600,
    getObjects: vi.fn().mockReturnValue([]),
    ...config
  } as unknown as Canvas;
};

describe('Grid Error Handling', () => {
  let mockCanvas: Canvas;
  
  beforeEach(() => {
    // Create mock canvas for testing
    mockCanvas = createMockCanvas();
    
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
  it('should create appropriate recovery plans for canvas errors', () => {
    // Create a canvas initialization error
    const canvasError = new Error('canvas initialization failed');
    
    // Get recovery plan
    const plan = createGridRecoveryPlan(canvasError, mockCanvas);
    
    // Verify recovery plan properties
    expect(plan.clearCanvas).toBeTruthy();
    expect(plan.resizeCanvas).toBeTruthy();
  });
  
  it('should create appropriate recovery plans for rendering errors', () => {
    // Create a rendering error
    const renderError = new Error('rendering error in grid');
    
    // Get recovery plan
    const plan = createGridRecoveryPlan(renderError, mockCanvas);
    
    // Verify recovery plan properties
    expect(plan.useSimplifiedGrid).toBeTruthy();
    expect(plan.disableBackgroundGrid).toBeTruthy();
  });
  
  it('should create appropriate recovery plans for object errors', () => {
    // Create a mock canvas with objects
    const mockCanvasWithObjects = createMockCanvas({
      getObjects: vi.fn().mockReturnValue([{}, {}])
    });
    
    // Create an object error
    const objectError = new Error('object creation failed');
    
    // Get recovery plan
    const plan = createGridRecoveryPlan(objectError, mockCanvasWithObjects);
    
    // Verify recovery plan properties
    expect(plan.clearCanvas).toBeTruthy();
    expect(plan.useSimplifiedGrid).toBeTruthy();
  });
});
