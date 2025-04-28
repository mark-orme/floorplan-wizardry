
import { renderHook, act } from '@testing-library/react-hooks';
import { useDrawingState } from '../drawing/useDrawingState';
import { vi } from 'vitest';
import { DrawingState } from '@/types/DrawingState';

// Mock uuid generation
vi.mock('uuid', () => ({
  v4: () => 'test-uuid-1234'
}));

describe('useDrawingState', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDrawingState());
    
    expect(result.current.activeColor).toBe('#000000');
    expect(result.current.activeThickness).toBe(2);
    expect(result.current.activeType).toBe('line');
    expect(result.current.currentStroke).toBeNull();
    expect(result.current.isDrawing).toBe(false);
  });
  
  it('should start a stroke correctly', () => {
    const { result } = renderHook(() => useDrawingState());
    
    act(() => {
      result.current.startStroke({ x: 10, y: 20 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.currentStroke).toEqual({
      id: 'test-uuid-1234',
      points: [{ x: 10, y: 20 }],
      color: '#000000',
      thickness: 2,
      width: 2,
      type: 'line'
    });
  });
  
  it('should update a stroke correctly', () => {
    const { result } = renderHook(() => useDrawingState());
    
    act(() => {
      result.current.startStroke({ x: 10, y: 20 });
    });
    
    act(() => {
      result.current.updateStroke({ x: 30, y: 40 });
    });
    
    expect(result.current.currentStroke?.points).toEqual([
      { x: 10, y: 20 },
      { x: 30, y: 40 }
    ]);
  });
  
  it('should not update a stroke if not drawing', () => {
    const { result } = renderHook(() => useDrawingState());
    
    const updatedStroke = result.current.updateStroke({ x: 30, y: 40 });
    
    expect(updatedStroke).toBeNull();
    expect(result.current.currentStroke).toBeNull();
  });
  
  it('should end a stroke correctly', () => {
    const { result } = renderHook(() => useDrawingState());
    
    act(() => {
      result.current.startStroke({ x: 10, y: 20 });
    });
    
    let finishedStroke;
    act(() => {
      finishedStroke = result.current.endStroke();
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.currentStroke).toBeNull();
    expect(finishedStroke).toEqual({
      id: 'test-uuid-1234',
      points: [{ x: 10, y: 20 }],
      color: '#000000',
      thickness: 2,
      width: 2,
      type: 'line'
    });
  });
  
  it('should cancel a stroke correctly', () => {
    const { result } = renderHook(() => useDrawingState());
    
    act(() => {
      result.current.startStroke({ x: 10, y: 20 });
    });
    
    act(() => {
      result.current.cancelStroke();
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.currentStroke).toBeNull();
  });
  
  it('should allow changing active color', () => {
    const { result } = renderHook(() => useDrawingState());
    
    act(() => {
      result.current.setActiveColor('#ff0000');
    });
    
    expect(result.current.activeColor).toBe('#ff0000');
  });
  
  it('should allow changing active thickness', () => {
    const { result } = renderHook(() => useDrawingState());
    
    act(() => {
      result.current.setActiveThickness(5);
    });
    
    expect(result.current.activeThickness).toBe(5);
  });
});
