
/**
 * Tests for useSyncedFloorPlans hook
 * Verifies floor plan synchronization and persistence
 * 
 * @module hooks/__tests__/useSyncedFloorPlans
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSyncedFloorPlans } from '../useSyncedFloorPlans';
import { Canvas } from 'fabric';
import { createTestFloorPlan } from '@/utils/test/typedTestFixtures';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useSyncedFloorPlans Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should initialize with empty floor plans', () => {
    const { result } = renderHook(() => useSyncedFloorPlans());
    
    expect(result.current.floorPlans).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
  
  it('should load floor plans from localStorage on init', () => {
    // Setup: Add floor plans to localStorage
    const testFloorPlans = [createTestFloorPlan()];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(testFloorPlans));
    
    // Execute: Render the hook
    const { result } = renderHook(() => useSyncedFloorPlans());
    
    // Verify: Floor plans are loaded from localStorage
    expect(localStorageMock.getItem).toHaveBeenCalledWith('floorPlans');
    expect(result.current.floorPlans).toEqual(testFloorPlans);
  });
  
  it('should handle localStorage errors when loading data', async () => {
    // Setup: Mock localStorage to throw error
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    
    // Execute: Render hook
    const { result } = renderHook(() => useSyncedFloorPlans());
    
    // Verify: Error is handled and toast is shown
    expect(toast.error).toHaveBeenCalledWith('Failed to load floor plans');
    expect(result.current.error).toBeTruthy();
  });
  
  it('should handle localStorage errors when saving data', async () => {
    // Setup: Mock localStorage to throw error
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    
    // Execute: Render hook and attempt to save
    const { result } = renderHook(() => useSyncedFloorPlans());
    
    await act(async () => {
      // Trigger save via setFloorPlans which internally saves to localStorage
      result.current.setFloorPlans([createTestFloorPlan()]);
      
      // Verify: Error handling occurred
      expect(toast.error).toHaveBeenCalledWith('Failed to save floor plans');
    });
  });
  
  it('should create a new floor plan', () => {
    const { result } = renderHook(() => useSyncedFloorPlans());
    
    act(() => {
      result.current.createFloorPlan({
        name: 'New Floor Plan',
        level: 1
      });
    });
    
    expect(result.current.floorPlans.length).toBe(1);
    expect(result.current.floorPlans[0].name).toBe('New Floor Plan');
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
  
  it('should update a floor plan', () => {
    // Setup existing floor plans
    const mockFloorPlan = createTestFloorPlan({
      id: 'floor-1',
      name: 'Floor 1'
    });
    const existingPlans = [mockFloorPlan];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existingPlans));
    
    const { result } = renderHook(() => useSyncedFloorPlans());
    
    act(() => {
      result.current.updateFloorPlan(0, {
        ...mockFloorPlan,
        name: 'Updated Floor Plan'
      });
    });
    
    expect(result.current.floorPlans[0].name).toBe('Updated Floor Plan');
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
  
  it('should delete a floor plan', () => {
    // Setup existing floor plans
    const mockFloorPlan = createTestFloorPlan({
      id: 'floor-1'
    });
    const existingPlans = [mockFloorPlan];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existingPlans));
    
    const { result } = renderHook(() => useSyncedFloorPlans());
    
    act(() => {
      result.current.deleteFloorPlan(mockFloorPlan.id);
    });
    
    expect(result.current.floorPlans.length).toBe(0);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });
});
