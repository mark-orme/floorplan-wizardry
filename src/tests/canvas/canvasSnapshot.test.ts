
import { describe, it, expect, beforeEach } from 'vitest';
import { Canvas, Rect, Circle } from 'fabric';

describe('Canvas snapshot serialization', () => {
  let canvas: Canvas;

  beforeEach(() => {
    // Setup a fake DOM canvas
    const el = document.createElement('canvas');
    el.width = 800;
    el.height = 600;
    canvas = new Canvas(el);

    // Add objects to canvas
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 200,
      height: 100,
      fill: 'blue',
      id: 'test-rect'
    });

    const circle = new Circle({
      left: 300,
      top: 200,
      radius: 50,
      fill: 'red',
      id: 'test-circle'
    });

    canvas.add(rect, circle);
  });

  it('should serialize and restore canvas with matching object count', async () => {
    const json = canvas.toJSON();

    const el2 = document.createElement('canvas');
    el2.width = 800;
    el2.height = 600;
    const restoredCanvas = new Canvas(el2);

    await new Promise<void>((resolve) =>
      restoredCanvas.loadFromJSON(json, () => {
        restoredCanvas.renderAll();
        resolve();
      })
    );

    expect(restoredCanvas.getObjects().length).toBe(canvas.getObjects().length);
  });

  it('should match serialized snapshot', () => {
    const json = canvas.toJSON();
    expect(json).toMatchSnapshot();
  });
  
  it('should preserve object IDs after serialization and restoration', async () => {
    const originalRect = canvas.getObjects().find(obj => (obj as any).id === 'test-rect');
    const originalCircle = canvas.getObjects().find(obj => (obj as any).id === 'test-circle');
    
    expect(originalRect).toBeDefined();
    expect(originalCircle).toBeDefined();
    
    const json = canvas.toJSON();
    
    const el2 = document.createElement('canvas');
    el2.width = 800;
    el2.height = 600;
    const restoredCanvas = new Canvas(el2);
    
    await new Promise<void>((resolve) =>
      restoredCanvas.loadFromJSON(json, () => {
        restoredCanvas.renderAll();
        resolve();
      })
    );
    
    const restoredRect = restoredCanvas.getObjects().find(obj => (obj as any).id === 'test-rect');
    const restoredCircle = restoredCanvas.getObjects().find(obj => (obj as any).id === 'test-circle');
    
    expect(restoredRect).toBeDefined();
    expect(restoredCircle).toBeDefined();
  });
  
  it('should preserve object properties after serialization', async () => {
    const json = canvas.toJSON();
    
    const el2 = document.createElement('canvas');
    el2.width = 800;
    el2.height = 600;
    const restoredCanvas = new Canvas(el2);
    
    await new Promise<void>((resolve) =>
      restoredCanvas.loadFromJSON(json, () => {
        restoredCanvas.renderAll();
        resolve();
      })
    );
    
    const originalRect = canvas.getObjects()[0] as Rect;
    const restoredRect = restoredCanvas.getObjects()[0] as Rect;
    
    expect(restoredRect.width).toBe(originalRect.width);
    expect(restoredRect.height).toBe(originalRect.height);
    expect(restoredRect.fill).toBe(originalRect.fill);
    expect(restoredRect.left).toBe(originalRect.left);
    expect(restoredRect.top).toBe(originalRect.top);
  });
