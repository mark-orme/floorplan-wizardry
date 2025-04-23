
/**
 * Tests for useSyncedFloorPlans hook
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useSyncedFloorPlans } from '@/hooks/useSyncedFloorPlans';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DrawingMode } from '@/constants/drawingModes';

// Mock dependencies
vi.mock('@/api/floorPlans', () => ({
  fetchFloorPlans: vi.fn(),
  saveFloorPlan: vi.fn(),
  deleteFloorPlan: vi.fn()
}));

describe('useSyncedFloorPlans', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should initialize with empty floor plans', () => {
    const { result } = renderHook(() => useSyncedFloorPlans({}));
    
    expect(result.current.floorPlans).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
  
  it('should add a floor plan', () => {
    const { result } = renderHook(() => useSyncedFloorPlans({}));
    
    act(() => {
      result.current.addFloorPlan();
    });
    
    expect(result.current.floorPlans.length).toBe(1);
    expect(result.current.floorPlans[0]).toHaveProperty('name');
  });
  
  it('should create a floor plan with custom data', () => {
    const { result } = renderHook(() => useSyncedFloorPlans({}));
    
    act(() => {
      result.current.createFloorPlan({ name: 'Floor 1' });
      result.current.createFloorPlan({ name: 'Floor 2' });
    });
    
    expect(result.current.floorPlans.length).toBe(2);
    expect(result.current.floorPlans[0].name).toBe('Floor 1');
    expect(result.current.floorPlans[1].name).toBe('Floor 2');
  });
  
  it('should delete a floor plan', () => {
    const { result } = renderHook(() => useSyncedFloorPlans({}));
    
    // Add floor plans
    act(() => {
      result.current.createFloorPlan({ name: 'Floor 1' });
      result.current.createFloorPlan({ name: 'Floor 2' });
      result.current.createFloorPlan({ name: 'Floor 3' });
    });
    
    // Delete the second one
    act(() => {
      result.current.deleteFloorPlan(1);
    });
    
    expect(result.current.floorPlans.length).toBe(2);
    expect(result.current.floorPlans[0].name).toBe('Floor 1');
    expect(result.current.floorPlans[1].name).toBe('Floor 3');
  });
});
