
import { renderHook, act } from '@testing-library/react-hooks';
import { useFloorPlanDrawing } from '../useFloorPlanDrawing';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock data for testing
const mockFloorPlan = {
  id: 'floor-1',
  name: 'First Floor',
  strokes: [],
  level: 0,
  gia: 0
};

describe('useFloorPlanDrawing', () => {
  // Create a clean hook for each test
  const setup = () => {
    const updateFloorPlanMock = vi.fn();
    const setActiveStrokeMock = vi.fn();
    
    const result = renderHook(() => useFloorPlanDrawing({
      floorPlan: mockFloorPlan,
      updateFloorPlan: updateFloorPlanMock,
      setActiveStroke: setActiveStrokeMock
    }));
    
    return {
      result,
      updateFloorPlanMock,
      setActiveStrokeMock
    };
  };
  
  describe('initialization', () => {
    it('should initialize with default drawing tool', () => {
      const { result } = setup();
      expect(result.current.activeTool).toBeDefined();
    });
    
    it('should initialize with empty stroke collection', () => {
      const { result } = setup();
      expect(result.current.strokes).toEqual([]);
    });
  });
  
  describe('tool selection', () => {
    it('should change active tool', () => {
      const { result } = setup();
      
      act(() => {
        result.current.setActiveTool('line');
      });
      
      expect(result.current.activeTool).toBe('line');
      
      act(() => {
        result.current.setActiveTool('select');
      });
      
      expect(result.current.activeTool).toBe('select');
    });
  });
  
  describe('stroke management', () => {
    it('should add a stroke', () => {
      const { result, updateFloorPlanMock } = setup();
      
      const newStroke = {
        id: 'stroke-1',
        points: [{ x: 10, y: 10 }, { x: 20, y: 20 }],
        type: 'line',
        color: '#000000',
        thickness: 2
      };
      
      act(() => {
        result.current.addStroke(newStroke);
      });
      
      // Check that updateFloorPlan was called with the new stroke
      expect(updateFloorPlanMock).toHaveBeenCalledWith(expect.objectContaining({
        strokes: [newStroke]
      }));
    });
  });
  
  describe('drawing operations', () => {
    it('should start drawing at a point', () => {
      const { result } = setup();
      
      act(() => {
        result.current.startDrawing({ x: 10, y: 10 });
      });
      
      expect(result.current.currentPoint).toEqual({ x: 10, y: 10 });
    });
    
    it('should update current point when drawing', () => {
      const { result } = setup();
      
      act(() => {
        result.current.startDrawing({ x: 10, y: 10 });
        result.current.continueDrawing({ x: 20, y: 20 });
      });
      
      expect(result.current.currentPoint).toEqual({ x: 20, y: 20 });
    });
    
    it('should complete drawing and add a stroke', () => {
      const { result, updateFloorPlanMock } = setup();
      
      act(() => {
        result.current.startDrawing({ x: 10, y: 10 });
        result.current.continueDrawing({ x: 20, y: 20 });
        result.current.endDrawing();
      });
      
      // Check that updateFloorPlan was called with a new stroke
      expect(updateFloorPlanMock).toHaveBeenCalled();
    });
  });
});
