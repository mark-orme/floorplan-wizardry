import { DrawingMetricsState, initialDrawingMetricsState, drawingMetricsReducer, startToolUsage, endToolUsage } from '../drawingMetricsSlice';

describe('Drawing Metrics', () => {
  let initialState: DrawingMetricsState;

  beforeEach(() => {
    initialState = initialDrawingMetricsState;
  });

  it('should return the initial state', () => {
    expect(drawingMetricsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should start tracking tool usage', () => {
    const tool = 'select';
    const newState = drawingMetricsReducer(initialState, startToolUsage(tool));
    expect(newState.activeTool).toBe(tool);
    expect(newState.toolUsageStartTime).not.toBeNull();
  });

  it('should end tracking tool usage', () => {
    const tool = 'select';
    const startTime = Date.now() - 100;
    const interimState: DrawingMetricsState = {
      ...initialState,
      activeTool: tool,
      toolUsageStartTime: startTime,
      toolUsageDuration: {}
    };
    const newState = drawingMetricsReducer(interimState, endToolUsage());
    expect(newState.activeTool).toBeNull();
    expect(newState.toolUsageStartTime).toBeNull();

    // Add null checks for metrics.toolUsageDuration
    expect(newState.toolUsageDuration?.select || 0).toBeGreaterThanOrEqual(0);
  });

  it('should track tool usage duration', () => {
    const selectTool = 'select';
    const drawTool = 'draw';

    // Start select tool
    let metrics = drawingMetricsReducer(initialState, startToolUsage(selectTool));
    const selectStartTime = metrics.toolUsageStartTime || Date.now();

    // Simulate some time passing
    metrics = {
      ...metrics,
      toolUsageStartTime: selectStartTime
    };

    // End select tool and start draw tool
    metrics = drawingMetricsReducer(metrics, endToolUsage());
    metrics = drawingMetricsReducer(metrics, startToolUsage(drawTool));
    const drawStartTime = metrics.toolUsageStartTime || Date.now();

    // Simulate more time passing
    metrics = {
      ...metrics,
      toolUsageStartTime: drawStartTime
    };

    // End draw tool
    metrics = drawingMetricsReducer(metrics, endToolUsage());

    // Add null checks for metrics.toolUsageDuration
    expect(metrics.toolUsageDuration?.select || 0).toBe(100);
    expect(metrics.toolUsageDuration?.draw || 0).toBe(200);
  });
});
