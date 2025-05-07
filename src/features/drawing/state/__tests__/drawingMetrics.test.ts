
import { configureStore } from '@reduxjs/toolkit';
import { drawingMetricsSlice } from '../drawingMetricsSlice';
import { DrawingMode } from '@/constants/drawingModes';

describe('drawingMetrics reducer', () => {
  const { reducer } = drawingMetricsSlice;

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      drawingTime: 0,
      objectCount: 0,
      toolUsage: {},
      lastUsedTool: null,
      sessionStart: expect.any(Number),
    });
  });

  it('should handle incrementObjectCount', () => {
    const actual = reducer(undefined, drawingMetricsSlice.actions.incrementObjectCount());
    expect(actual.objectCount).toEqual(1);
  });

  it('should handle incrementDrawingTime', () => {
    const actual = reducer(undefined, drawingMetricsSlice.actions.incrementDrawingTime(10));
    expect(actual.drawingTime).toEqual(10);
  });

  it('should handle recordToolUse with SELECT', () => {
    // Mock Date.now to return a consistent value for testing
    const mockDateNow = jest.fn(() => 1600000000000);
    const originalDateNow = Date.now;
    Date.now = mockDateNow;
    
    const actual = reducer(undefined, drawingMetricsSlice.actions.recordToolUse(DrawingMode.SELECT));
    expect(actual.lastUsedTool).toEqual(DrawingMode.SELECT);
    expect(actual.toolUsage[DrawingMode.SELECT]).toEqual({
      count: 1,
      time: 0,
      lastUsed: 1600000000000
    });
    
    // Restore original Date.now
    Date.now = originalDateNow;
  });

  it('should handle recordToolUse with RECTANGLE', () => {
    // Mock Date.now to return a consistent value for testing
    const mockDateNow = jest.fn(() => 1600000000000);
    const originalDateNow = Date.now;
    Date.now = mockDateNow;
    
    const actual = reducer(undefined, drawingMetricsSlice.actions.recordToolUse(DrawingMode.RECTANGLE));
    expect(actual.lastUsedTool).toEqual(DrawingMode.RECTANGLE);
    expect(actual.toolUsage[DrawingMode.RECTANGLE]).toEqual({
      count: 1,
      time: 0,
      lastUsed: 1600000000000
    });
    
    // Restore original Date.now
    Date.now = originalDateNow;
  });
});
