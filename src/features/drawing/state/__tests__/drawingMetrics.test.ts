
import { configureStore } from '@reduxjs/toolkit';
import { drawingMetricsSlice } from '../drawingMetricsSlice';
import { DrawingMode } from '@/constants/drawingModes';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('drawingMetrics reducer', () => {
  // Use the reducer directly from the slice
  const { reducer, actions } = drawingMetricsSlice;

  // Mock Date.now for testing purposes
  let originalDateNow: () => number;

  beforeEach(() => {
    originalDateNow = Date.now;
    Date.now = vi.fn(() => 1600000000000);
  });

  afterEach(() => {
    Date.now = originalDateNow;
  });

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      currentTool: null,
      startTime: null,
      drawingDuration: 0,
      toolUsage: {},
    });
  });

  it('should handle startToolUsage', () => {
    const actual = reducer(undefined, actions.startToolUsage(DrawingMode.SELECT));
    expect(actual.currentTool).toEqual(DrawingMode.SELECT);
    expect(actual.startTime).toEqual(1600000000000);
  });

  it('should handle endToolUsage', () => {
    // First start using a tool
    let state = reducer(undefined, actions.startToolUsage(DrawingMode.SELECT));
    
    // Then end using it
    state = reducer(state, actions.endToolUsage());
    
    expect(state.currentTool).toBeNull();
    expect(state.startTime).toBeNull();
    expect(state.toolUsage[DrawingMode.SELECT]).toEqual(0); // No time passed in the mock
  });

  it('should handle incrementToolUsage', () => {
    const actual = reducer(undefined, actions.incrementToolUsage({
      tool: DrawingMode.RECTANGLE, 
      duration: 5000
    }));
    
    expect(actual.toolUsage[DrawingMode.RECTANGLE]).toEqual(5000);
    expect(actual.drawingDuration).toEqual(5000);
  });
});
