
import { SimplePoint, toFabricPoint } from '@/utils/fabric/pointAdapter';
import { vi } from 'vitest';

// Mock the useFloorPlanDrawing hook
const useFloorPlanDrawingMock = {
  startDrawing: vi.fn(),
  continueDrawing: vi.fn(),
  endDrawing: vi.fn(),
  cancelDrawing: vi.fn(),
  isDrawing: false,
};

// Update your Point instances to use toFabricPoint
const testPoint1: SimplePoint = { x: 10, y: 20 };
const testPoint2: SimplePoint = { x: 100, y: 200 };

// When you need a Fabric Point, convert it:
const fabricPoint1 = toFabricPoint(testPoint1);
const fabricPoint2 = toFabricPoint(testPoint2);

export { useFloorPlanDrawingMock, testPoint1, testPoint2, fabricPoint1, fabricPoint2 };
