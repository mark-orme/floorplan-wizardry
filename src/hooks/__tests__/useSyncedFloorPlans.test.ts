
/**
 * Tests for useSyncedFloorPlans hook
 * Verifies floor plan synchronization and persistence
 * 
 * @module hooks/__tests__/useSyncedFloorPlans
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSyncedFloorPlans } from '../useSyncedFloorPlans';
import { createTestFloorPlan } from '@/types/floor-plan/unifiedTypes';
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
  // Mock implementation for required props
  const mockLoadFloorPlans = vi.fn().mockResolvedValue([]);
  const mockSaveFloorPlans = vi.fn().mockResolvedValue(undefined);
  
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should initialize with empty floor plans', () => {
    const { result } = renderHook(() => useSyncedFloorPlans({
      loadFloorPlans: mockLoadFloorPlans,
      saveFloorPlans: mockSaveFloorPlans
    }));
    
    expect(result.current.floorPlans).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });
  
  it('should load floor plans from localStorage on init', () => {
    // Setup: Add floor plans to localStorage
    const testFloorPlans = [createTestFloorPlan()];
    mockLoadFloorPlans.mockResolvedValueOnce(testFloorPlans);
    
    // Execute: Render the hook
    const { result } = renderHook(() => useSyncedFloorPlans({
      loadFloorPlans: mockLoadFloorPlans,
      saveFloorPlans: mockSaveFloorPlans
    }));
    
    // Verify: Floor plans are loaded
    expect(mockLoadFloorPlans).toHaveBeenCalled();
    expect(result.current.floorPlans).toEqual(testFloorPlans);
  });
  
  it('should handle localStorage errors when loading data', async () => {
    // Setup: Mock to throw error
    mockLoadFloorPlans.mockRejectedValueOnce(new Error('Test error'));
    
    // Execute: Render hook
    const { result } = renderHook(() => useSyncedFloorPlans({
      loadFloorPlans: mockLoadFloorPlans,
      saveFloorPlans: mockSaveFloorPlans
    }));
    
    // Wait for the effect to complete
    await vi.runAllTimersAsync();
    
    // Verify: Error is handled and toast is shown
    expect(toast.error).toHaveBeenCalledWith('Failed to load floor plans');
    expect(result.current.error).toBeTruthy();
  });
  
  it('should handle localStorage errors when saving data', async () => {
    // Setup: Mock to throw error
    mockSaveFloorPlans.mockRejectedValueOnce(new Error('Test error'));
    
    // Execute: Render hook and attempt to save
    const { result } = renderHook(() => useSyncedFloorPlans({
      loadFloorPlans: mockLoadFloorPlans,
      saveFloorPlans: mockSaveFloorPlans
    }));
    
    await act(async () => {
      await result.current.syncFloorPlans();
      
      // Verify: Error handling occurred
      expect(toast.error).toHaveBeenCalledWith('Failed to sync floor plans');
    });
  });
  
  it('should create a new floor plan', () => {
    const { result } = renderHook(() => useSyncedFloorPlans({
      loadFloorPlans: mockLoadFloorPlans,
      saveFloorPlans: mockSaveFloorPlans
    }));
    
    act(() => {
      result.current.createFloorPlan({
        name: 'New Floor Plan',
        level: 1
      });
    });
    
    expect(result.current.floorPlans.length).toBe(1);
    expect(result.current.floorPlans[0].name).toBe('New Floor Plan');
  });
  
  it('should update a floor plan', () => {
    // Setup existing floor plans
    const mockFloorPlan = createTestFloorPlan();
    mockLoadFloorPlans.mockResolvedValueOnce([mockFloorPlan]);
    
    const { result } = renderHook(() => useSyncedFloorPlans({
      loadFloorPlans: mockLoadFloorPlans,
      saveFloorPlans: mockSaveFloorPlans
    }));
    
    act(() => {
      result.current.updateFloorPlan(0, {
        ...mockFloorPlan,
        name: 'Updated Floor Plan'
      });
    });
    
    expect(result.current.floorPlans[0].name).toBe('Updated Floor Plan');
  });
  
  it('should delete a floor plan', () => {
    // Setup existing floor plans
    const mockFloorPlan = createTestFloorPlan();
    mockLoadFloorPlans.mockResolvedValueOnce([mockFloorPlan]);
    
    const { result } = renderHook(() => useSyncedFloorPlans({
      loadFloorPlans: mockLoadFloorPlans,
      saveFloorPlans: mockSaveFloorPlans
    }));
    
    act(() => {
      result.current.deleteFloorPlan(mockFloorPlan.id);
    });
    
    expect(result.current.floorPlans.length).toBe(0);
  });
});
