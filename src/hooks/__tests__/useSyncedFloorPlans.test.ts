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
import { FloorPlan } from '@/types/floorPlanTypes';
import { toast } from 'sonner';
import { adaptFloorPlan } from '@/utils/floorPlanAdapter';

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

// Use adaptFloorPlan to ensure all required properties are present
const mockFloorPlan = adaptFloorPlan({
  id: 'floor-1',
  name: 'Floor 1',
  label: 'First Floor',
  strokes: [],
  walls: [],
  rooms: [],
  level: 0,
  index: 0,
  gia: 0,
  canvasData: null,
  canvasJson: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paperSize: 'A4',
    level: 0
  }
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
  });

  it('should load floor plans from localStorage on init', () => {
    // Setup: Add floor plans to localStorage
    const testFloorPlans = [mockFloorPlan];
    localStorageMock.setItem('floorPlans', JSON.stringify(testFloorPlans));
    
    // Execute: Render the hook
    const { result } = renderHook(() => useSyncedFloorPlans());
    
    // Verify: Floor plans are loaded from localStorage
    expect(localStorageMock.getItem).toHaveBeenCalledWith('floorPlans');
    expect(result.current.floorPlans).toEqual(testFloorPlans);
  });

  it('should save floor plans to localStorage when using setFloorPlans', async () => {
    // Setup: Render hook
    const { result } = renderHook(() => useSyncedFloorPlans());
    
    // Execute: Set floor plans using the setter
    act(() => {
      result.current.setFloorPlans([mockFloorPlan]);
    });
    
    // Allow any async operations to complete
    await vi.runAllTimersAsync();
    
    // Verify: Floor plans are saved to localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith('floorPlans', JSON.stringify([mockFloorPlan]));
    expect(result.current.floorPlans).toEqual([mockFloorPlan]);
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
    expect(result.current.floorPlans).toEqual([]);
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
      result.current.setFloorPlans([mockFloorPlan]);
      
      // Verify: Error handling occurred
      expect(toast.error).toHaveBeenCalledWith('Failed to save floor plans');
    });
  });

  it('should sync floor plans with canvas', () => {
    // Setup: Create mock canvas
    const mockCanvas = new Canvas(null);
    const { result } = renderHook(() => useSyncedFloorPlans());
    
    // Execute: Sync floor plans with canvas
    act(() => {
      result.current.syncFloorPlans(mockCanvas, [mockFloorPlan]);
    });
    
    // Note: This test is just checking the function executes without errors
    // In a real implementation, we would verify canvas changes
  });

  it('should load a floor plan to canvas', () => {
    // Setup: Create mock canvas
    const mockCanvas = new Canvas(null);
    const { result } = renderHook(() => useSyncedFloorPlans());
    
    // Execute: Load floor plan to canvas
    act(() => {
      result.current.loadFloorPlan(mockCanvas, mockFloorPlan);
    });
    
    // Note: This test is just checking the function executes without errors
    // In a real implementation, we would verify canvas changes
  });

  it('should calculate Gross Internal Area (GIA)', () => {
    // Setup: Create floor plans with different GIA values
    const floorPlansWithGIA = [
      { ...mockFloorPlan, gia: 100 },
      { ...mockFloorPlan, id: 'test-floor-2', gia: 200 }
    ];
    
    const { result } = renderHook(() => useSyncedFloorPlans());
    
    // Execute: Calculate GIA
    const gia = result.current.calculateGIA(floorPlansWithGIA as FloorPlan[]);
    
    // Verify: GIA should be the sum of all floor plans
    expect(gia).toBe(300);
  });
});
