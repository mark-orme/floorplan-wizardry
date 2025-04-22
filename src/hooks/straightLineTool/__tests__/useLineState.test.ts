
/**
 * Tests for useLineState hook
 * @module hooks/straightLineTool/__tests__/useLineState.test
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLineState } from '../useLineState';
import { createMockFunctionParams, createTestPoint } from '@/utils/test/mockUtils';

describe('useLineState', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLineState());
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.isActive).toBe(false);
    expect(result.current.isToolInitialized).toBe(false);
    expect(result.current.inputMethod).toBe('mouse');
    expect(result.current.isPencilMode).toBe(false);
    expect(result.current.snapEnabled).toBe(true);
    expect(result.current.anglesEnabled).toBe(false);
  });
  
  it('should set isDrawing state', () => {
    const { result } = renderHook(() => useLineState());
    
    act(() => {
      result.current.setIsDrawing(true);
    });
    
    expect(result.current.isDrawing).toBe(true);
  });
  
  it('should toggle snap state', () => {
    const { result } = renderHook(() => useLineState());
    
    const initialSnapState = result.current.snapEnabled;
    
    act(() => {
      result.current.toggleSnap();
    });
    
    expect(result.current.snapEnabled).toBe(!initialSnapState);
  });
  
  it('should toggle angles state', () => {
    const { result } = renderHook(() => useLineState());
    
    const initialAnglesState = result.current.anglesEnabled;
    
    act(() => {
      result.current.toggleAngles();
    });
    
    expect(result.current.anglesEnabled).toBe(!initialAnglesState);
  });
  
  it('should initialize the tool', () => {
    const { result } = renderHook(() => useLineState());
    
    act(() => {
      result.current.initializeTool();
    });
    
    expect(result.current.isToolInitialized).toBe(true);
  });
  
  it('should reset drawing state', () => {
    const { result } = renderHook(() => useLineState());
    
    // Set up a drawing state
    act(() => {
      result.current.setIsDrawing(true);
      result.current.initializeTool();
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.isToolInitialized).toBe(true);
    
    // Reset the state
    act(() => {
      result.current.resetDrawingState();
    });
    
    // Check that the state was reset
    expect(result.current.isDrawing).toBe(false);
  });
});
