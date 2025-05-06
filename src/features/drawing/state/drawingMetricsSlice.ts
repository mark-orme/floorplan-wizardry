
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface for drawing metrics
export interface DrawingMetricsState {
  toolUsage: Record<string, number>;
  drawingDuration: number;
  objectCount: number;
  lastActive: string;
  currentTool: string | null;
  startTime: number | null;
}

// Initialize state with default values
export const initialDrawingMetricsState: DrawingMetricsState = {
  toolUsage: {},
  drawingDuration: 0,
  objectCount: 0,
  lastActive: '',
  currentTool: null,
  startTime: null
};

// Create the slice with reducers
export const drawingMetricsSlice = createSlice({
  name: 'drawingMetrics',
  initialState: initialDrawingMetricsState,
  reducers: {
    recordToolUsage: (state, action: PayloadAction<{ tool: string, duration: number }>) => {
      const { tool, duration } = action.payload;
      state.toolUsage[tool] = (state.toolUsage[tool] || 0) + duration;
    },
    
    startToolUsage: (state, action: PayloadAction<string>) => {
      state.currentTool = action.payload;
      state.startTime = Date.now();
      state.lastActive = new Date().toISOString();
    },
    
    endToolUsage: (state) => {
      if (state.currentTool && state.startTime) {
        const duration = Date.now() - state.startTime;
        state.toolUsage[state.currentTool] = (state.toolUsage[state.currentTool] || 0) + duration;
        state.drawingDuration += duration;
        state.currentTool = null;
        state.startTime = null;
      }
    },
    
    incrementObjectCount: (state) => {
      state.objectCount += 1;
    },
    
    decrementObjectCount: (state) => {
      state.objectCount = Math.max(0, state.objectCount - 1);
    },
    
    updateDrawingDuration: (state, action: PayloadAction<number>) => {
      state.drawingDuration += action.payload;
    },
    
    setLastActive: (state, action: PayloadAction<string>) => {
      state.lastActive = action.payload;
    },
    
    resetMetrics: () => {
      return initialDrawingMetricsState;
    }
  }
});

// Export actions
export const {
  recordToolUsage,
  startToolUsage,
  endToolUsage,
  incrementObjectCount,
  decrementObjectCount,
  updateDrawingDuration,
  setLastActive,
  resetMetrics
} = drawingMetricsSlice.actions;

// Export reducer
export const drawingMetricsReducer = drawingMetricsSlice.reducer;

export default drawingMetricsReducer;
