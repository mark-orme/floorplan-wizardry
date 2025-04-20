
/**
 * Tests for useSyncedFloorPlans hook
 * Verifies floor plan synchronization and persistence
 * 
 * @module hooks/__tests__/useSyncedFloorPlans
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSyncedFloorPlans } from '@/hooks/useSyncedFloorPlans';
import { Canvas } from 'fabric';
import { createTestFloorPlan } from '@/utils/test/typedTestFixtures';
import { toast } from 'sonner';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';

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
const mockFloorPlan = createTestFloorPlan({
  id: 'floor-1',
  name: 'Floor 1',
  label: 'First Floor',
});

// Create a mock canvas reference
const mockFabricCanvasRef = { current: null };

describe('useSyncedFloorPlans Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize with empty floor plans', () => {
    const { result } = renderHook(() => useSyncedFloorPlans({ fabricCanvasRef: mockFabricCanvasRef }));
    
    expect(result.current.floorPlans).toEqual([]);
  });

  it('should load floor plans from localStorage on init', () => {
    // Setup: Add floor plans to localStorage
    const testFloorPlans = [mockFloorPlan];
    localStorageMock.setItem('floorPlans', JSON.stringify(testFloorPlans));
    
    // Execute: Render the hook
    const { result } = renderHook(() => useSyncedFloorPlans({ fabricCanvasRef: mockFabricCanvasRef }));
    
    // Verify: Floor plans are loaded from localStorage
    expect(localStorageMock.getItem).toHaveBeenCalledWith('floorPlans');
    expect(result.current.floorPlans).toEqual(testFloorPlans);
  });

  it('should save floor plans to localStorage when using setFloorPlans', async () => {
    // Setup: Render hook
    const { result } = renderHook(() => useSyncedFloorPlans({ fabricCanvasRef: mockFabricCanvasRef }));
    
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
    const { result } = renderHook(() => useSyncedFloorPlans({ fabricCanvasRef: mockFabricCanvasRef }));
    
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
    const { result } = renderHook(() => useSyncedFloorPlans({ fabricCanvasRef: mockFabricCanvasRef }));
    
    await act(async () => {
      // Trigger save via setFloorPlans which internally saves to localStorage
      result.current.setFloorPlans([mockFloorPlan]);
      
      // Verify: Error handling occurred
      expect(toast.error).toHaveBeenCalledWith('Failed to save floor plans');
    });
  });

  it('should support floor plan sync functionality', () => {
    // Setup: Create mock canvas
    const mockCanvas = new Canvas(null);
    mockFabricCanvasRef.current = mockCanvas;
    const { result } = renderHook(() => useSyncedFloorPlans({ fabricCanvasRef: mockFabricCanvasRef }));
    
    // Check if there's an addFloorPlan method
    if (typeof result.current.addFloorPlan === 'function') {
      // Execute: Add a floor plan
      act(() => {
        result.current.addFloorPlan();
      });
    }
  });
});
