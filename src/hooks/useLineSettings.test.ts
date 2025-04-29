
import { renderHook, act } from '@/utils/testing/react-hooks-testing';
import { useLineSettings } from './useLineSettings';
import { describe, it, expect, vi } from 'vitest';

describe('useLineSettings', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLineSettings({}));
    
    expect(result.current.lineColor).toBeDefined();
    expect(result.current.lineThickness).toBeDefined();
  });
  
  it('should allow changing line color', () => {
    const { result } = renderHook(() => useLineSettings({
      initialLineColor: '#000000'
    }));
    
    act(() => {
      result.current.setLineColor('#FF0000');
    });
    
    expect(result.current.lineColor).toBe('#FF0000');
  });
  
  it('should allow changing line thickness', () => {
    const { result } = renderHook(() => useLineSettings({
      initialLineThickness: 2
    }));
    
    act(() => {
      result.current.setLineThickness(5);
    });
    
    expect(result.current.lineThickness).toBe(5);
  });
});
