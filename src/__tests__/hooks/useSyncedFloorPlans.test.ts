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
    const { result } = renderHook(() => useSyncedFloorPlans({
      autoSync: false
    }));
    
    expect(result.current.floorPlans).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
  
  it('should add a floor plan', () => {
    const { result } = renderHook(() => useSyncedFloorPlans({
      autoSync: false
    }));
    
    act(() => {
      result.current.addFloorPlan({
        name: 'Test Floor'
      });
    });
    
    expect(result.current.floorPlans.length).toBe(1);
    expect(result.current.floorPlans[0].name).toBe('Test Floor');
    expect(result.current.selectedFloorPlanIndex).toBe(0);
  });
  
  it('should select a floor plan', () => {
    const { result } = renderHook(() => useSyncedFloorPlans({
      autoSync: false
    }));
    
    // Add two floor plans
    act(() => {
      result.current.addFloorPlan({ name: 'Floor 1' });
      result.current.addFloorPlan({ name: 'Floor 2' });
    });
    
    // Select the second one
    act(() => {
      result.current.selectFloorPlan(1);
    });
    
    expect(result.current.selectedFloorPlanIndex).toBe(1);
    expect(result.current.selectedFloorPlan?.name).toBe('Floor 2');
  });
  
  it('should delete a floor plan', () => {
    const { result } = renderHook(() => useSyncedFloorPlans({
      autoSync: false
    }));
    
    // Add floor plans
    act(() => {
      result.current.addFloorPlan({ name: 'Floor 1' });
      result.current.addFloorPlan({ name: 'Floor 2' });
      result.current.addFloorPlan({ name: 'Floor 3' });
    });
    
    // Select the second one then delete it
    act(() => {
      result.current.selectFloorPlan(1);
    });
    
    act(() => {
      result.current.deleteFloorPlan(1);
    });
    
    expect(result.current.floorPlans.length).toBe(2);
    expect(result.current.floorPlans[0].name).toBe('Floor 1');
    expect(result.current.floorPlans[1].name).toBe('Floor 3');
    expect(result.current.selectedFloorPlanIndex).toBe(0);
  });
});
