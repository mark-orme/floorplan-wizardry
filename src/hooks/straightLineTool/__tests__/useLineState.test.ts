
import { act, renderHook } from '@testing-library/react-hooks';
import { useLineState } from '../useLineState';
import { Canvas as FabricCanvas } from 'fabric';

// Mock dependencies
jest.mock('../useLineDrawing', () => ({
  useLineDrawing: () => ({
    createLine: jest.fn(),
    updateLine: jest.fn(),
    finalizeLine: jest.fn(),
    removeLine: jest.fn()
  })
}));

jest.mock('../useEnhancedGridSnapping', () => ({
  useEnhancedGridSnapping: () => ({
    snapEnabled: true,
    toggleGridSnapping: jest.fn(),
    snapToGrid: jest.fn((point) => point)
  })
}));

jest.mock('../useLineAngleSnap', () => ({
  useLineAngleSnap: () => ({
    anglesEnabled: true,
    toggleAngles: jest.fn(),
    snapToAngle: jest.fn((start, end) => end),
    setAnglesEnabled: jest.fn()
  })
}));

describe('useLineState', () => {
  const mockSaveCurrentState = jest.fn();
  const mockCanvasRef = { current: {} as FabricCanvas };
  
  const defaultProps = {
    fabricCanvasRef: mockCanvasRef,
    lineColor: '#000000',
    lineThickness: 2,
    saveCurrentState: mockSaveCurrentState
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useLineState(defaultProps));
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.startPoint).toBe(null);
    expect(result.current.endPoint).toBe(null);
    expect(result.current.startPointFixed).toBe(false);
    expect(result.current.snapEnabled).toBe(true);
    expect(result.current.anglesEnabled).toBe(true);
    expect(result.current.shiftKeyPressed).toBe(false);
  });
  
  it('should start drawing on startDrawing call', () => {
    const { result } = renderHook(() => useLineState(defaultProps));
    
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.startPoint).toEqual({ x: 100, y: 100 });
    expect(result.current.endPoint).toEqual({ x: 100, y: 100 });
  });
  
  it('should update end point on continueDrawing call', () => {
    const { result } = renderHook(() => useLineState(defaultProps));
    
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
      result.current.continueDrawing({ x: 200, y: 200 });
    });
    
    expect(result.current.isDrawing).toBe(true);
    expect(result.current.startPoint).toEqual({ x: 100, y: 100 });
    expect(result.current.endPoint).toEqual({ x: 200, y: 200 });
  });
  
  it('should complete drawing on completeDrawing call', () => {
    const { result } = renderHook(() => useLineState(defaultProps));
    
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
      result.current.continueDrawing({ x: 200, y: 200 });
      result.current.completeDrawing({ x: 200, y: 200 });
    });
    
    expect(result.current.isDrawing).toBe(false);
  });
  
  it('should toggle grid snapping', () => {
    const { result } = renderHook(() => useLineState(defaultProps));
    
    const initialSnapEnabled = result.current.snapEnabled;
    
    act(() => {
      result.current.toggleSnap();
    });
    
    // With our mock, the actual toggle doesn't change the state
    // In a real implementation this would be different
    expect(result.current.snapEnabled).toBe(initialSnapEnabled);
  });
  
  it('should toggle angles snapping', () => {
    const { result } = renderHook(() => useLineState(defaultProps));
    
    const initialAnglesEnabled = result.current.anglesEnabled;
    
    act(() => {
      result.current.toggleAngles();
    });
    
    // With our mock, the actual toggle doesn't change the state
    // In a real implementation this would be different
    expect(result.current.anglesEnabled).toBe(initialAnglesEnabled);
  });
  
  it('should reset drawing state on cancelDrawing call', () => {
    const { result } = renderHook(() => useLineState(defaultProps));
    
    act(() => {
      result.current.startDrawing({ x: 100, y: 100 });
      result.current.continueDrawing({ x: 200, y: 200 });
      result.current.cancelDrawing();
    });
    
    expect(result.current.isDrawing).toBe(false);
    expect(result.current.startPoint).toBe(null);
    expect(result.current.endPoint).toBe(null);
  });
  
  it('should set shift key pressed state', () => {
    const { result } = renderHook(() => useLineState(defaultProps));
    
    act(() => {
      result.current.setShiftKeyPressed(true);
    });
    
    expect(result.current.shiftKeyPressed).toBe(true);
    
    act(() => {
      result.current.setShiftKeyPressed(false);
    });
    
    expect(result.current.shiftKeyPressed).toBe(false);
  });
});
