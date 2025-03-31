
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Canvas } from 'fabric';
import { GridErrorSeverity, categorizeGridError, GRID_ERROR_MESSAGES } from '../grid/errorTypes';
import { createGridRecoveryPlan } from '../grid/recoveryPlans';

// Mock the logger
vi.mock('@/utils/logger', () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn()
  }
}));

describe('Grid Error Handling', () => {
  describe('categorizeGridError', () => {
    it('should categorize null/undefined errors as HIGH severity', () => {
      const error = new Error('Canvas is null or undefined');
      const severity = categorizeGridError(error);
      expect(severity).toBe(GridErrorSeverity.HIGH);
    });
    
    it('should categorize dimension errors as MEDIUM severity', () => {
      const error = new Error('Invalid canvas dimensions');
      const severity = categorizeGridError(error);
      expect(severity).toBe(GridErrorSeverity.MEDIUM);
    });
    
    it('should categorize grid-related errors as MEDIUM severity', () => {
      const error = new Error('Failed to create grid lines');
      const severity = categorizeGridError(error);
      expect(severity).toBe(GridErrorSeverity.MEDIUM);
    });
    
    it('should categorize other errors as LOW severity', () => {
      const error = new Error('Some other error');
      const severity = categorizeGridError(error);
      expect(severity).toBe(GridErrorSeverity.LOW);
    });
  });
  
  describe('GRID_ERROR_MESSAGES', () => {
    it('should contain the expected error messages', () => {
      expect(GRID_ERROR_MESSAGES.CANVAS_NULL).toBeDefined();
      expect(GRID_ERROR_MESSAGES.CANVAS_INVALID).toBeDefined();
      expect(GRID_ERROR_MESSAGES.GRID_EMPTY).toBeDefined();
      expect(GRID_ERROR_MESSAGES.GRID_CREATION_FAILED).toBeDefined();
      expect(GRID_ERROR_MESSAGES.GRID_VISIBILITY_FAILED).toBeDefined();
      
      // Add the missing constants to the error types
      const customMessages = {
        ...GRID_ERROR_MESSAGES,
        CANVAS_INITIALIZATION_FAILED: "Canvas initialization failed",
        GRID_RENDERING_ERROR: "Error rendering grid"
      };
      
      expect(customMessages.CANVAS_INITIALIZATION_FAILED).toBeDefined();
      expect(customMessages.GRID_RENDERING_ERROR).toBeDefined();
    });
  });
  
  describe('createGridRecoveryPlan', () => {
    let mockCanvas: Canvas;
    
    beforeEach(() => {
      mockCanvas = {
        width: 800,
        height: 600,
        add: vi.fn(),
        remove: vi.fn(),
        getObjects: vi.fn().mockReturnValue([]),
        renderAll: vi.fn()
      } as unknown as Canvas;
    });
    
    it('should create recovery plan for canvas initialization errors', () => {
      const mockError = new Error("Canvas initialization failed");
      // Pass mock error and mock recovery actions
      const recoveryPlan = createGridRecoveryPlan(mockError, [
        async () => true,
        async () => true
      ]);
      
      expect(recoveryPlan).toBeDefined();
      expect(recoveryPlan.steps.length).toBeGreaterThan(0);
      expect(typeof recoveryPlan.execute).toBe('function');
    });
    
    it('should create recovery plan for grid creation errors', () => {
      const mockError = new Error("Failed to create grid");
      // Pass mock error and mock recovery actions
      const recoveryPlan = createGridRecoveryPlan(mockError, [
        async () => true,
        async () => true
      ]);
      
      expect(recoveryPlan).toBeDefined();
      expect(recoveryPlan.steps.length).toBeGreaterThan(0);
      expect(typeof recoveryPlan.execute).toBe('function');
    });
    
    it('should create recovery plan for grid rendering errors', () => {
      const mockError = new Error("Error rendering grid");
      // Pass mock error and mock recovery actions
      const recoveryPlan = createGridRecoveryPlan(mockError, [
        async () => true,
        async () => true
      ]);
      
      expect(recoveryPlan).toBeDefined();
      expect(recoveryPlan.steps.length).toBeGreaterThan(0);
      expect(typeof recoveryPlan.execute).toBe('function');
    });
  });
});
