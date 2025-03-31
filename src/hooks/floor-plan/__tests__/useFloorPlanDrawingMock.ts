
/**
 * Mock implementation for useFloorPlanDrawing tests
 * Provides consistent behavior for tests
 * @module hooks/floor-plan/__tests__/useFloorPlanDrawingMock
 */
import { FloorPlan, Stroke } from '@/types/floorPlanTypes';
import { Point } from '@/types/core/Geometry';
import { DrawingTool } from '@/types/core/DrawingTool';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Mock props for useFloorPlanDrawing tests
 * Allows tests to pass either floorPlan or floorPlans
 */
export interface MockFloorPlanDrawingProps {
  // Single floor plan props
  floorPlan?: FloorPlan;
  setFloorPlan?: React.Dispatch<React.SetStateAction<FloorPlan>>;
  
  // Multiple floor plans props
  floorPlans?: FloorPlan[];
  currentFloor?: number;
  setFloorPlans?: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  
  // Common props
  fabricCanvasRef: { current: any };
  tool?: DrawingTool;
  setGia?: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Mock result for useFloorPlanDrawing tests
 */
export interface MockFloorPlanDrawingResult {
  isDrawing: boolean;
  drawingPoints: Point[];
  currentPoint: Point | null;
  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  endDrawing: (point: Point) => void;
  cancelDrawing: () => void;
  addStroke: (stroke: Stroke) => void;
  calculateAreas: () => { id: string; area: number }[];
}

/**
 * Creates a mock implementation of useFloorPlanDrawing result
 * 
 * @param {MockFloorPlanDrawingProps} props - Mock props
 * @returns {MockFloorPlanDrawingResult} Mock result
 */
export function createMockFloorPlanDrawingResult(
  props: MockFloorPlanDrawingProps
): MockFloorPlanDrawingResult {
  return {
    isDrawing: false,
    drawingPoints: [],
    currentPoint: null,
    
    startDrawing: (point: Point) => {
      console.log('Mock startDrawing called with point:', point);
    },
    
    continueDrawing: (point: Point) => {
      console.log('Mock continueDrawing called with point:', point);
    },
    
    endDrawing: (point: Point) => {
      console.log('Mock endDrawing called with point:', point);
      
      // Call the appropriate setter based on provided props
      if (props.floorPlan && props.setFloorPlan) {
        props.setFloorPlan({ ...props.floorPlan });
      } else if (props.floorPlans && props.setFloorPlans && typeof props.currentFloor === 'number') {
        const updatedFloorPlans = [...props.floorPlans];
        props.setFloorPlans(updatedFloorPlans);
      }
    },
    
    cancelDrawing: () => {
      console.log('Mock cancelDrawing called');
    },
    
    addStroke: (stroke: Stroke) => {
      console.log('Mock addStroke called with stroke:', stroke);
      
      // Call the appropriate setter based on provided props
      if (props.floorPlan && props.setFloorPlan) {
        props.setFloorPlan({
          ...props.floorPlan,
          strokes: [...props.floorPlan.strokes, stroke]
        });
      } else if (props.floorPlans && props.setFloorPlans && typeof props.currentFloor === 'number') {
        const updatedFloorPlans = [...props.floorPlans];
        const currentFloorPlan = updatedFloorPlans[props.currentFloor];
        if (currentFloorPlan) {
          currentFloorPlan.strokes = [...currentFloorPlan.strokes, stroke];
          props.setFloorPlans(updatedFloorPlans);
        }
      }
    },
    
    calculateAreas: () => {
      console.log('Mock calculateAreas called');
      return [{ id: 'mock-area-1', area: 100 }];
    }
  };
}
