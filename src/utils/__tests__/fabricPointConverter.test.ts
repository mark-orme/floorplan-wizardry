
import { Point as FabricPoint } from 'fabric';
import { 
  fromFabricPoint, 
  toFabricPoint, 
  createFabricPoint,
  toAppPoint,
  getPointFromEvent,
  isAppPoint
} from '../fabricPointConverter';

describe('fabricPointConverter', () => {
  it('should convert between fabric point and app point correctly', () => {
    const fabricPoint = new FabricPoint(10, 20);
    const appPoint = fromFabricPoint(fabricPoint);
    
    expect(appPoint.x).toBe(10);
    expect(appPoint.y).toBe(20);
    
    const backToFabric = toFabricPoint(appPoint);
    expect(backToFabric.x).toBe(10);
    expect(backToFabric.y).toBe(20);
  });
  
  it('should create fabric point from coordinates', () => {
    const fabricPoint = createFabricPoint(15, 25);
    
    expect(fabricPoint.x).toBe(15);
    expect(fabricPoint.y).toBe(25);
  });
  
  it('should convert to app point format', () => {
    const point = { x: 30, y: 40 };
    const appPoint = toAppPoint(point);
    
    expect(appPoint.x).toBe(30);
    expect(appPoint.y).toBe(40);
  });
  
  it('should extract point from mouse event', () => {
    const mouseEvent = {
      clientX: 50,
      clientY: 60
    } as MouseEvent;
    
    const mockCanvas = {
      getPointer: jest.fn().mockReturnValue({ x: 50, y: 60 })
    };
    
    const point = getPointFromEvent(mouseEvent, mockCanvas);
    
    expect(point.x).toBe(50);
    expect(point.y).toBe(60);
    expect(mockCanvas.getPointer).toHaveBeenCalledWith(mouseEvent);
  });
  
  it('should validate if object is a point', () => {
    expect(isAppPoint({ x: 10, y: 20 })).toBe(true);
    expect(isAppPoint({ x: '10', y: 20 })).toBe(false);
    expect(isAppPoint({ x: 10 })).toBe(false);
    expect(isAppPoint(null)).toBe(false);
  });
});
