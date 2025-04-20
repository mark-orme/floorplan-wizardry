
import { render, screen } from '@testing-library/react';
import { FloorPlanCanvas } from '../FloorPlanCanvas';
import { CanvasEngineProvider } from '@/contexts/CanvasEngineContext';
import { MockCanvasEngine } from '@/implementations/canvas-engine/MockCanvasEngine';

jest.mock('@/implementations/canvas-engine/FabricCanvasEngine', () => ({
  FabricCanvasEngine: jest.fn().mockImplementation(() => new MockCanvasEngine()),
}));

describe('FloorPlanCanvas', () => {
  it('initializes canvas engine correctly', () => {
    const onCanvasReady = jest.fn();
    
    render(
      <CanvasEngineProvider>
        <FloorPlanCanvas onCanvasReady={onCanvasReady} />
      </CanvasEngineProvider>
    );
    
    expect(screen.getByTestId('floor-plan-canvas')).toBeInTheDocument();
    expect(onCanvasReady).toHaveBeenCalled();
    
    const engine = onCanvasReady.mock.calls[0][0];
    expect(engine).toBeInstanceOf(MockCanvasEngine);
  });

  it('handles basic drawing operations with mock engine', () => {
    const onCanvasReady = jest.fn();
    
    render(
      <CanvasEngineProvider>
        <FloorPlanCanvas onCanvasReady={onCanvasReady} />
      </CanvasEngineProvider>
    );
    
    const engine = onCanvasReady.mock.calls[0][0];
    
    // Test drawing operations
    engine.drawLine([{ x: 0, y: 0 }, { x: 100, y: 100 }], { color: 'black', width: 2 });
    expect(engine.getObjects()).toHaveLength(1);
    
    engine.clear();
    expect(engine.getObjects()).toHaveLength(0);
  });
});
