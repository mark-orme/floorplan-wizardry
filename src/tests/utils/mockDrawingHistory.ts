
/**
 * Mock implementation for useDrawingHistory
 */
import { vi } from 'vitest';
import { UseDrawingHistoryResult } from '@/hooks/useDrawingHistory.d';

/**
 * Create a mock drawing history hook result
 * @param overrides Properties to override in the mock
 * @returns Mock drawing history hook result
 */
export const createMockDrawingHistory = (
  overrides: Partial<UseDrawingHistoryResult> = {}
): UseDrawingHistoryResult => {
  return {
    handleUndo: vi.fn(),
    handleRedo: vi.fn(), 
    canUndo: false,
    canRedo: false,
    saveCurrentState: vi.fn(),
    ...overrides
  };
};

/**
 * Create mock drawing history with custom behavior
 */
export const createMockDrawingHistoryWithBehavior = () => {
  let canUndo = false;
  let canRedo = false;
  const states: any[] = [];
  let currentIndex = -1;
  
  const handleUndo = vi.fn().mockImplementation(() => {
    if (canUndo) {
      currentIndex--;
      canUndo = currentIndex > 0;
      canRedo = true;
    }
  });
  
  const handleRedo = vi.fn().mockImplementation(() => {
    if (canRedo) {
      currentIndex++;
      canRedo = currentIndex < states.length - 1;
      canUndo = true;
    }
  });
  
  const saveCurrentState = vi.fn().mockImplementation(() => {
    states.push({ timestamp: Date.now() });
    currentIndex = states.length - 1;
    canUndo = states.length > 1;
    canRedo = false;
  });
  
  return {
    handleUndo,
    handleRedo,
    saveCurrentState,
    get canUndo() { return canUndo; },
    get canRedo() { return canRedo; }
  };
};
