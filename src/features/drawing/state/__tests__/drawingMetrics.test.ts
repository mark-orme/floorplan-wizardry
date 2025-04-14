
import { describe, test, expect, beforeEach } from 'vitest';
import { 
  registerToolChange, 
  registerObjectCreated, 
  registerObjectDeleted, 
  registerObjectModified, 
  getDrawingMetrics, 
  resetDrawingMetrics 
} from '../drawingMetrics';
import { DrawingMode } from '@/constants/drawingModes';

describe('Drawing Metrics', () => {
  beforeEach(() => {
    resetDrawingMetrics();
  });
  
  test('should track tool changes', () => {
    // Track a tool change
    registerToolChange(DrawingMode.DRAW);
    
    // Get metrics
    const metrics = getDrawingMetrics();
    
    // Verify metrics
    expect(metrics.toolSwitchCount).toBe(1);
    expect(metrics.toolUsageDuration[DrawingMode.SELECT]).toBeGreaterThanOrEqual(0);
    expect(metrics.toolUsageDuration[DrawingMode.DRAW]).toBeGreaterThanOrEqual(0);
  });
  
  test('should track object operations', () => {
    // Track operations
    registerObjectCreated();
    registerObjectCreated();
    registerObjectModified();
    registerObjectDeleted();
    
    // Get metrics
    const metrics = getDrawingMetrics();
    
    // Verify metrics
    expect(metrics.objectsCreated).toBe(2);
    expect(metrics.objectsModified).toBe(1);
    expect(metrics.objectsDeleted).toBe(1);
  });
  
  test('should reset metrics', () => {
    // Track some operations
    registerToolChange(DrawingMode.DRAW);
    registerObjectCreated();
    registerObjectModified();
    
    // Reset metrics
    resetDrawingMetrics();
    
    // Get metrics
    const metrics = getDrawingMetrics();
    
    // Verify metrics are reset
    expect(metrics.toolSwitchCount).toBe(0);
    expect(metrics.objectsCreated).toBe(0);
    expect(metrics.objectsModified).toBe(0);
    expect(metrics.objectsDeleted).toBe(0);
  });
});
