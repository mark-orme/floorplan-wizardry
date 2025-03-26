
import { renderHook } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { useCanvasProfiler } from '@/hooks/useCanvasProfiler';

// Mock the performance API
const mockPerformance = {
  now: vi.fn(),
  mark: vi.fn(),
  measure: vi.fn(),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
};

// Mock the canvas profiler utility functions
vi.mock('@/utils/profiling/canvasProfiler', () => ({
  startCanvasOperation: vi.fn(),
  endCanvasOperation: vi.fn(),
  getOperationDuration: vi.fn(),
  clearProfilingData: vi.fn(),
}));

// Import after mocking
import { 
  startCanvasOperation, 
  endCanvasOperation, 
  getOperationDuration, 
  clearProfilingData 
} from '@/utils/profiling/canvasProfiler';

describe('useCanvasProfiler', () => {
  beforeEach(() => {
    // Setup performance mock
    global.performance = mockPerformance as unknown as Performance;
    
    // Setup timestamp mock
    mockPerformance.now.mockReturnValue(1000);
    
    // Reset all mocks
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  test('should return profiling functions', () => {
    // When
    const { result } = renderHook(() => useCanvasProfiler());
    
    // Then
    expect(result.current.startOperation).toBeInstanceOf(Function);
    expect(result.current.endOperation).toBeInstanceOf(Function);
    expect(result.current.getOperationTime).toBeInstanceOf(Function);
    expect(result.current.clearProfileData).toBeInstanceOf(Function);
  });
  
  test('startOperation should call performance mark', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler());
    const operationName = 'testOperation';
    
    // When
    result.current.startOperation(operationName);
    
    // Then
    expect(performance.mark).toHaveBeenCalledWith(`${operationName}-start`);
    expect(startCanvasOperation).toHaveBeenCalledWith(operationName);
  });
  
  test('endOperation should call performance measure', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler());
    const operationName = 'testOperation';
    
    // When
    result.current.endOperation(operationName);
    
    // Then
    expect(performance.measure).toHaveBeenCalledWith(
      operationName,
      `${operationName}-start`
    );
    expect(endCanvasOperation).toHaveBeenCalledWith(operationName);
  });
  
  test('getOperationTime should return operation duration', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler());
    const operationName = 'testOperation';
    const expectedDuration = 50;
    
    // Mock the getOperationDuration to return our expected value
    (getOperationDuration as vi.Mock).mockReturnValue(expectedDuration);
    
    // When
    const duration = result.current.getOperationTime(operationName);
    
    // Then
    expect(duration).toBe(expectedDuration);
    expect(getOperationDuration).toHaveBeenCalledWith(operationName);
  });
  
  test('clearProfileData should clear performance marks and measures', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler());
    
    // When
    result.current.clearProfileData();
    
    // Then
    expect(performance.clearMarks).toHaveBeenCalled();
    expect(performance.clearMeasures).toHaveBeenCalled();
    expect(clearProfilingData).toHaveBeenCalled();
  });
  
  test('should profile complete operation cycle', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler());
    const operationName = 'testOperation';
    const expectedDuration = 50;
    
    (getOperationDuration as vi.Mock).mockReturnValue(expectedDuration);
    
    // When - start and end an operation
    result.current.startOperation(operationName);
    result.current.endOperation(operationName);
    
    // Then - we can get its duration
    expect(result.current.getOperationTime(operationName)).toBe(expectedDuration);
    
    // When - we clear the data
    result.current.clearProfileData();
    
    // Then - the data is cleared
    expect(clearProfilingData).toHaveBeenCalled();
  });
  
  test('should handle multiple operations', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler());
    
    // When - start and end multiple operations
    result.current.startOperation('operation1');
    result.current.endOperation('operation1');
    
    result.current.startOperation('operation2');
    result.current.endOperation('operation2');
    
    // Then - both operations are profiled
    expect(startCanvasOperation).toHaveBeenCalledTimes(2);
    expect(endCanvasOperation).toHaveBeenCalledTimes(2);
  });
});
