
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCanvasProfiler } from '@/hooks/useCanvasProfiler';
import { canvasProfiler } from '@/utils/profiling/canvasProfiler';

// Mock the canvasProfiler module
vi.mock('@/utils/profiling/canvasProfiler', () => ({
  canvasProfiler: {
    initialize: vi.fn(),
    reset: vi.fn(),
  },
  startCanvasOperation: vi.fn().mockReturnValue('test-op-id'),
  endCanvasOperation: vi.fn(),
  getCanvasPerformanceReport: vi.fn().mockReturnValue({ test: 'data' }),
}));

describe('useCanvasProfiler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  test('initializes with default disabled state', () => {
    // When
    const { result } = renderHook(() => useCanvasProfiler());
    
    // Then
    expect(result.current.isEnabled).toBe(false);
    expect(canvasProfiler.initialize).not.toHaveBeenCalled();
  });
  
  test('initializes profiler when enabled option is true', () => {
    // When
    renderHook(() => useCanvasProfiler({ enabled: true }));
    
    // Then
    expect(canvasProfiler.initialize).toHaveBeenCalled();
  });
  
  test('toggles profiling state correctly', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler());
    
    // When - toggle on
    act(() => {
      result.current.toggleProfiling();
    });
    
    // Then
    expect(result.current.isEnabled).toBe(true);
    expect(canvasProfiler.initialize).toHaveBeenCalled();
    
    // When - toggle off
    act(() => {
      result.current.toggleProfiling();
    });
    
    // Then
    expect(result.current.isEnabled).toBe(false);
  });
  
  test('startOperation calls startCanvasOperation', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler({ enabled: true }));
    
    // When
    const opId = result.current.startOperation('test-operation');
    
    // Then
    expect(opId).toBe('test-op-id');
  });
  
  test('endOperation calls endCanvasOperation', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler({ enabled: true }));
    
    // When
    result.current.endOperation('test-op-id');
    
    // Then
    expect(endCanvasOperation).toHaveBeenCalledWith('test-op-id');
  });
  
  test('resetProfiling calls canvasProfiler.reset', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler({ enabled: true }));
    
    // When
    result.current.resetProfiling();
    
    // Then
    expect(canvasProfiler.reset).toHaveBeenCalled();
  });
  
  test('getReport returns performance report', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler({ enabled: true }));
    
    // When
    const report = result.current.getReport();
    
    // Then
    expect(report).toEqual({ test: 'data' });
  });
  
  test('profileFn wraps function with profiling', async () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler({ enabled: true }));
    const testFn = vi.fn().mockReturnValue('result');
    
    // When
    const profiledFn = result.current.profileFn('test-fn', testFn);
    const fnResult = profiledFn();
    
    // Then
    expect(testFn).toHaveBeenCalled();
    expect(fnResult).toBe('result');
    expect(startCanvasOperation).toHaveBeenCalledWith('test-fn');
    expect(endCanvasOperation).toHaveBeenCalled();
  });
  
  test('profileFn handles promises correctly', async () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler({ enabled: true }));
    const testPromiseFn = vi.fn().mockResolvedValue('result');
    
    // When
    const profiledFn = result.current.profileFn('test-promise-fn', testPromiseFn);
    const promise = profiledFn();
    
    // Then
    expect(testPromiseFn).toHaveBeenCalled();
    expect(startCanvasOperation).toHaveBeenCalledWith('test-promise-fn');
    
    // When resolved
    const fnResult = await promise;
    
    // Then
    expect(fnResult).toBe('result');
    expect(endCanvasOperation).toHaveBeenCalled();
  });
  
  test('profileFn handles exceptions correctly', () => {
    // Given
    const { result } = renderHook(() => useCanvasProfiler({ enabled: true }));
    const errorFn = vi.fn().mockImplementation(() => {
      throw new Error('test error');
    });
    
    // When/Then
    const profiledFn = result.current.profileFn('error-fn', errorFn);
    expect(() => profiledFn()).toThrow('test error');
    expect(startCanvasOperation).toHaveBeenCalledWith('error-fn');
    expect(endCanvasOperation).toHaveBeenCalled();
  });
});
