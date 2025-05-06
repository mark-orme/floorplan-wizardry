
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DrawingMetricsState {
  toolUsage: Record<string, number>;
  drawingDuration: number;
  objectCount: number;
  lastActive: string;
}

const initialState: DrawingMetricsState = {
  toolUsage: {},
  drawingDuration: 0,
  objectCount: 0,
  lastActive: ''
};

export const drawingMetricsSlice = createSlice({
  name: 'drawingMetrics',
  initialState,
  reducers: {
    recordToolUsage: (state, action: PayloadAction<{ tool: string, duration: number }>) => {
      const { tool, duration } = action.payload;
      state.toolUsage[tool] = (state.toolUsage[tool] || 0) + duration;
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
    resetMetrics: (state) => {
      return initialState;
    }
  }
});

export const {
  recordToolUsage,
  incrementObjectCount,
  decrementObjectCount,
  updateDrawingDuration,
  setLastActive,
  resetMetrics
} = drawingMetricsSlice.actions;

export default drawingMetricsSlice.reducer;
