
import { describe, it, expect, beforeEach } from 'vitest';
import { Canvas, Rect } from 'fabric';

describe('Undo/Redo snapshot system', () => {
  let canvas: Canvas;
  let historyStack: string[] = [];
  let redoStack: string[] = [];

  const snapshot = () => {
    historyStack.push(JSON.stringify(canvas.toJSON()));
    redoStack = [];
  };

  const undo = () => {
    if (historyStack.length <= 1) return;
    const last = historyStack.pop();
    if (last) redoStack.push(last);
    const prev = historyStack[historyStack.length - 1];
    canvas.loadFromJSON(JSON.parse(prev), () => canvas.renderAll());
  };

  const redo = () => {
    const next = redoStack.pop();
    if (next) {
      historyStack.push(next);
      canvas.loadFromJSON(JSON.parse(next), () => canvas.renderAll());
    }
  };

  beforeEach(() => {
    const el = document.createElement('canvas');
    el.width = 800;
    el.height = 600;
    canvas = new Canvas(el);
    historyStack = [];
    redoStack = [];
    
    // Take initial snapshot of empty canvas
    snapshot();
  });

  it('should undo and redo canvas state', async () => {
    // Add a rectangle
    const rect = new Rect({ 
      width: 100, 
      height: 100, 
      left: 50, 
      top: 50, 
      fill: 'green' 
    });
    canvas.add(rect);
    snapshot();

    // Modify rectangle position
    rect.set('left', 200);
    canvas.renderAll();
    snapshot();

    // Verify we have 3 snapshots (initial empty + 2 modifications)
    expect(historyStack.length).toBe(3);

    // Undo to first modification
    undo();
    expect(canvas.getObjects()[0].left).toBe(50); // Back to original position

    // Redo to second modification
    redo();
    expect(canvas.getObjects()[0].left).toBe(200); // Forward again
    
    // Undo twice to get to empty canvas
    undo();
    undo();
    expect(canvas.getObjects().length).toBe(0); // Back to empty canvas
  });
  
  it('should handle multiple objects with undo/redo', () => {
    // Add first rectangle
    const rect1 = new Rect({ 
      width: 100, 
      height: 100, 
      left: 50, 
      top: 50, 
      fill: 'green' 
    });
    canvas.add(rect1);
    snapshot();
    
    // Add second rectangle
    const rect2 = new Rect({ 
      width: 100, 
      height: 100, 
      left: 200, 
      top: 50, 
      fill: 'blue' 
    });
    canvas.add(rect2);
    snapshot();
    
    // Verify we have 3 snapshots (initial empty + 2 additions)
    expect(historyStack.length).toBe(3);
    expect(canvas.getObjects().length).toBe(2);
    
    // Undo to remove the second rectangle
    undo();
    expect(canvas.getObjects().length).toBe(1);
    
    // Undo to empty canvas
    undo();
    expect(canvas.getObjects().length).toBe(0);
    
    // Redo to add first rectangle back
    redo();
    expect(canvas.getObjects().length).toBe(1);
    expect((canvas.getObjects()[0] as Rect).fill).toBe('green');
  });
});
