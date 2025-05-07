
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
    expect(newState.currentTool).toBe(tool);
    expect(newState.startTime).toBeTruthy();
  });

  it('should end tracking tool usage', () => {
    // First start tracking
    const tool = 'rectangle';
    let state = drawingMetricsReducer(initialState, startToolUsage(tool));
    
    // Mock Date.now to return a consistent value for testing
    const realDateNow = Date.now;
    const mockStartTime = 1000;
    const mockEndTime = 5000;
    const mockDuration = mockEndTime - mockStartTime;
    
    // Mock time passing (4 seconds)
    const mockDateNow = () => mockEndTime;
    global.Date.now = mockDateNow;
    
    state = { ...state, startTime: mockStartTime };
    
    // Now end tracking
    state = drawingMetricsReducer(state, endToolUsage());
    
    // Restore Date.now
    global.Date.now = realDateNow;
    
    // Check that usage was recorded correctly
    expect(state.currentTool).toBeNull();
    expect(state.startTime).toBeNull();
    expect(state.toolUsage[tool]).toBe(mockDuration);
    expect(state.drawingDuration).toBe(mockDuration);
  });
});
