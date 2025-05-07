
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DrawingMode } from '@/constants/drawingModes';

export interface DrawingMetricsState {
  currentTool: DrawingMode | null;
  startTime: number | null;
  drawingDuration: number;
  toolUsage: Record<string, number>;
}

export const initialDrawingMetricsState: DrawingMetricsState = {
  currentTool: null,
  startTime: null,
  drawingDuration: 0,
  toolUsage: {}
};

export const drawingMetricsSlice = createSlice({
  name: 'drawingMetrics',
  initialState: initialDrawingMetricsState,
  reducers: {
    startToolUsage: (state: DrawingMetricsState, action: PayloadAction<DrawingMode>) => {
      state.currentTool = action.payload;
      state.startTime = Date.now();
    },
    
    endToolUsage: (state: DrawingMetricsState) => {
      const { currentTool, startTime } = state;
      
      if (currentTool && startTime) {
        const duration = Date.now() - startTime;
        
        state.toolUsage = {
          ...state.toolUsage,
          [currentTool]: (state.toolUsage[currentTool] || 0) + duration
        };
        
        state.drawingDuration += duration;
        state.currentTool = null;
        state.startTime = null;
      }
    },
    
    resetMetrics: (state: DrawingMetricsState) => {
      return initialDrawingMetricsState;
    },
    
    incrementToolUsage: (state: DrawingMetricsState, action: PayloadAction<{tool: DrawingMode; duration: number}>) => {
      const { tool, duration } = action.payload;
      state.toolUsage[tool] = (state.toolUsage[tool] || 0) + duration;
      state.drawingDuration += duration;
    },
    
    setDrawingDuration: (state: DrawingMetricsState, action: PayloadAction<number>) => {
      state.drawingDuration = action.payload;
    },
    
    setToolUsageStats: (state: DrawingMetricsState, action: PayloadAction<Record<string, number>>) => {
      state.toolUsage = action.payload;
    },
    
    clearStats: (state: DrawingMetricsState) => {
      state.toolUsage = {};
      state.drawingDuration = 0;
    }
  }
});

export const {
  startToolUsage,
  endToolUsage,
  resetMetrics,
  incrementToolUsage,
  setDrawingDuration,
  setToolUsageStats,
  clearStats
} = drawingMetricsSlice.actions;

export default drawingMetricsSlice.reducer;
