
/**
 * Mock implementation for useFloorPlanDrawing tests
 * Provides consistent behavior for tests
 * @module hooks/floor-plan/__tests__/useFloorPlanDrawingMock
 */
import { FloorPlan, Stroke, Point, createTestFloorPlan, createTestStroke } from '@/types/floor-plan/unifiedTypes';
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
  console.log('Creating mock floor plan drawing result');
  
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
        props.setFloorPlan((prevFloorPlan) => {
          // Create a fully valid floor plan object
          const validFloorPlan = {
            ...createTestFloorPlan({}),  // Start with a complete valid floor plan
            ...prevFloorPlan,            // Apply previous properties
            strokes: [...(prevFloorPlan.strokes || [])]
          };
          
          return validFloorPlan;
        });
      } else if (props.floorPlans && props.setFloorPlans && typeof props.currentFloor === 'number') {
        props.setFloorPlans((prevFloorPlans) => {
          const updatedFloorPlans = [...prevFloorPlans];
          if (updatedFloorPlans[props.currentFloor!]) {
            // Create a fully valid floor plan object
            updatedFloorPlans[props.currentFloor!] = {
              ...createTestFloorPlan({}),  // Start with a complete valid floor plan
              ...updatedFloorPlans[props.currentFloor!],
              strokes: [...(updatedFloorPlans[props.currentFloor!].strokes || [])]
            };
          }
          return updatedFloorPlans;
        });
      }
    },
    
    cancelDrawing: () => {
      console.log('Mock cancelDrawing called');
    },
    
    addStroke: (stroke: Stroke) => {
      console.log('Mock addStroke called with stroke:', stroke);
      
      // Ensure the stroke has all required properties
      const validStroke = createTestStroke(stroke);
      
      // Call the appropriate setter based on provided props
      if (props.floorPlan && props.setFloorPlan) {
        props.setFloorPlan((prevFloorPlan) => {
          // Create a fully valid floor plan object
          const validFloorPlan = {
            ...createTestFloorPlan({}),  // Start with a complete valid floor plan
            ...prevFloorPlan,            // Apply previous properties
            strokes: [...(prevFloorPlan.strokes || []), validStroke]
          };
          
          return validFloorPlan;
        });
      } else if (props.floorPlans && props.setFloorPlans && typeof props.currentFloor === 'number') {
        props.setFloorPlans((prevFloorPlans) => {
          const updatedFloorPlans = [...prevFloorPlans];
          if (props.currentFloor !== undefined && updatedFloorPlans[props.currentFloor]) {
            // Create a fully valid floor plan object
            const currentFloorPlan = {
              ...createTestFloorPlan({}),  // Start with a complete valid floor plan
              ...updatedFloorPlans[props.currentFloor!],
              strokes: [...(updatedFloorPlans[props.currentFloor!].strokes || []), validStroke]
            };
            
            updatedFloorPlans[props.currentFloor!] = currentFloorPlan;
          }
          return updatedFloorPlans;
        });
      }
    },
    
    calculateAreas: () => {
      console.log('Mock calculateAreas called');
      return [{ id: 'mock-area-1', area: 100 }];
    }
  };
}
