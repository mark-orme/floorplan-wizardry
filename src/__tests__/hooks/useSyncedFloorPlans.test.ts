
/**
 * Tests for useSyncedFloorPlans hook
 * Verifies floor plan synchronization and persistence
 * 
 * @module hooks/__tests__/useSyncedFloorPlans
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSyncedFloorPlans } from '../../hooks/useSyncedFloorPlans';
import { Canvas } from 'fabric';
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

// Create a mock floor plan using the fixed helper function
const mockFloorPlan = createTestFloorPlan();

// Create mocked functions for the hook props
const mockLoadFloorPlans = vi.fn().mockResolvedValue([]);
const mockSaveFloorPlans = vi.fn().mockResolvedValue(undefined);

describe('useSyncedFloorPlans Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    mockLoadFloorPlans.mockResolvedValue([]);
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should initialize with empty floor plans', () => {
    const { result } = renderHook(() => useSyncedFloorPlans({
      initialFloorPlans: [],
      loadFloorPlans: mockLoadFloorPlans,
      saveFloorPlans: mockSaveFloorPlans
    }));
    
    expect(result.current.floorPlans).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });
  
  it('should load floor plans from localStorage on init', () => {
    // Setup: Add floor plans to localStorage
    const testFloorPlans = [mockFloorPlan];
    mockLoadFloorPlans.mockResolvedValue(testFloorPlans);
    
    // Execute: Render the hook
    const { result } = renderHook(() => useSyncedFloorPlans({
      initialFloorPlans: [],
      loadFloorPlans: mockLoadFloorPlans,
      saveFloorPlans: mockSaveFloorPlans
    }));
    
    // Verify: Floor plans are loaded
    expect(mockLoadFloorPlans).toHaveBeenCalled();
    expect(result.current.floorPlans).toEqual([]); // Initial value before effect
  });
  
  it('should handle localStorage errors when loading data', async () => {
    // Setup: Mock loadFloorPlans to throw error
    mockLoadFloorPlans.mockRejectedValue(new Error('Test error'));
    
    // Execute: Render hook
    const { result } = renderHook(() => useSyncedFloorPlans({
      initialFloorPlans: [],
      loadFloorPlans: mockLoadFloorPlans,
      saveFloorPlans: mockSaveFloorPlans
    }));
    
    // Wait for effect to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Verify: Error is handled
    expect(mockLoadFloorPlans).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Failed to load floor plans');
  });
  
  it('should handle localStorage errors when saving data', async () => {
    // Setup: Mock saveFloorPlans to throw error
    mockSaveFloorPlans.mockRejectedValue(new Error('Test error'));
    
    // Execute: Render hook and attempt to save
    const { result } = renderHook(() => useSyncedFloorPlans({
      initialFloorPlans: [],
      loadFloorPlans: mockLoadFloorPlans,
      saveFloorPlans: mockSaveFloorPlans
    }));
    
    await act(async () => {
      // Trigger save via syncFloorPlans
      await result.current.syncFloorPlans();
      
      // Verify: Error handling occurred
      expect(toast.error).toHaveBeenCalledWith('Failed to sync floor plans');
    });
  });
  
  it('should add a new floor plan', () => {
    const { result } = renderHook(() => useSyncedFloorPlans({
      initialFloorPlans: [],
      loadFloorPlans: mockLoadFloorPlans,
      saveFloorPlans: mockSaveFloorPlans
    }));
    
    act(() => {
      result.current.addFloorPlan();
    });
    
    expect(result.current.floorPlans.length).toBe(1);
  });
  
  it('should update a floor plan', () => {
    // Setup existing floor plans
    const existingPlans = [mockFloorPlan];
    mockLoadFloorPlans.mockResolvedValue(existingPlans);
    
    const { result } = renderHook(() => useSyncedFloorPlans({
      initialFloorPlans: existingPlans,
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
    const existingPlans = [mockFloorPlan];
    
    const { result } = renderHook(() => useSyncedFloorPlans({
      initialFloorPlans: existingPlans,
      loadFloorPlans: mockLoadFloorPlans,
      saveFloorPlans: mockSaveFloorPlans
    }));
    
    act(() => {
      result.current.deleteFloorPlan(0);
    });
    
    expect(result.current.floorPlans.length).toBe(0);
  });
});
