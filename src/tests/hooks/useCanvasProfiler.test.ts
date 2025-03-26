
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
  getCanvasPerformanceReport: vi.fn(),
  canvasProfiler: {
    initialize: vi.fn(),
    startOperation: vi.fn(),
    endOperation: vi.fn(),
    getPerformanceReport: vi.fn(),
    reset: vi.fn()
  }
}));

// Import after mocking
import { 
  startCanvasOperation, 
  endCanvasOperation, 
  getCanvasPerformanceReport,
  canvasProfiler
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
    expect(result.current.resetProfiling).toBeInstanceOf(Function);
    expect(result.current.getReport).toBeInstanceOf(Function);
  });
  
  test('startOperation should call profiler', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler());
    const operationName = 'testOperation';
    const mockOpId = 'test-op-id';
    (canvasProfiler.startOperation as ReturnType<typeof vi.fn>).mockReturnValue(mockOpId);
    
    // When
    result.current.startOperation(operationName);
    
    // Then
    expect(canvasProfiler.startOperation).toHaveBeenCalledWith(operationName, undefined);
  });
  
  test('endOperation should call profiler', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler());
    const operationId = 'testOperation-123';
    
    // When
    result.current.endOperation(operationId);
    
    // Then
    expect(canvasProfiler.endOperation).toHaveBeenCalledWith(operationId);
  });
  
  test('getReport should return operation duration', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler());
    const expectedReport = { operations: [], summary: {} };
    (canvasProfiler.getPerformanceReport as ReturnType<typeof vi.fn>).mockReturnValue(expectedReport);
    
    // When
    const report = result.current.getReport();
    
    // Then
    expect(report).toBe(expectedReport);
    expect(canvasProfiler.getPerformanceReport).toHaveBeenCalled();
  });
  
  test('resetProfiling should clear profiling data', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler());
    
    // When
    result.current.resetProfiling();
    
    // Then
    expect(canvasProfiler.reset).toHaveBeenCalled();
  });
  
  test('should profile complete operation cycle', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler());
    const operationName = 'testOperation';
    const mockOpId = 'test-op-id';
    (canvasProfiler.startOperation as ReturnType<typeof vi.fn>).mockReturnValue(mockOpId);
    
    // When - start and end an operation
    result.current.startOperation(operationName);
    result.current.endOperation(mockOpId);
    
    // Then - verify the cycle was performed correctly
    expect(canvasProfiler.startOperation).toHaveBeenCalledWith(operationName, undefined);
    expect(canvasProfiler.endOperation).toHaveBeenCalledWith(mockOpId);
    
    // When - we get the report
    result.current.getReport();
    
    // Then - report is fetched
    expect(canvasProfiler.getPerformanceReport).toHaveBeenCalled();
    
    // When - we reset the profiler
    result.current.resetProfiling();
    
    // Then - the data is cleared
    expect(canvasProfiler.reset).toHaveBeenCalled();
  });
  
  test('should handle multiple operations', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler());
    
    // When - start and end multiple operations
    result.current.startOperation('operation1');
    result.current.endOperation('operation1-id');
    
    result.current.startOperation('operation2');
    result.current.endOperation('operation2-id');
    
    // Then - both operations are profiled
    expect(canvasProfiler.startOperation).toHaveBeenCalledTimes(2);
    expect(canvasProfiler.endOperation).toHaveBeenCalledTimes(2);
  });
});
