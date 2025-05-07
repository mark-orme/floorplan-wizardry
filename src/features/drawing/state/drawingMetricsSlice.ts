
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DrawingMode } from '@/constants/drawingModes';

export interface DrawingMetricsState {
  currentTool: DrawingMode | string | null;
  startTime: number | null;
  drawingDuration: number;
  toolUsage: Record<string, number>;
  // For backward compatibility
  objectCount?: number;
  drawingTime?: number;
  lastUsedTool?: DrawingMode | null;
  toolSwitchCount?: number;
  sessionStart?: number;
}

export const initialDrawingMetricsState: DrawingMetricsState = {
  currentTool: null,
  startTime: null,
  drawingDuration: 0,
  toolUsage: {},
  // For backward compatibility
  objectCount: 0,
  drawingTime: 0,
  lastUsedTool: null,
  sessionStart: Date.now(),
};

export const drawingMetricsSlice = createSlice({
  name: 'drawingMetrics',
  initialState: initialDrawingMetricsState,
  reducers: {
    startToolUsage: (state: DrawingMetricsState, action: PayloadAction<DrawingMode | string>) => {
      state.currentTool = action.payload;
      state.startTime = Date.now();
      // For backward compatibility
      state.lastUsedTool = action.payload as any;
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
        
        // For backward compatibility
        if (state.drawingTime !== undefined) {
          state.drawingTime += duration;
        }
      }
    },
    
    incrementToolUsage: (state: DrawingMetricsState, action: PayloadAction<{tool: DrawingMode | string; duration: number}>) => {
      const { tool, duration } = action.payload;
      state.toolUsage[tool] = (state.toolUsage[tool] || 0) + duration;
      state.drawingDuration += duration;
      
      // For backward compatibility
      if (state.drawingTime !== undefined) {
        state.drawingTime += duration;
      }
    },
    
    setDrawingDuration: (state: DrawingMetricsState, action: PayloadAction<number>) => {
      state.drawingDuration = action.payload;
      // For backward compatibility
      if (state.drawingTime !== undefined) {
        state.drawingTime = action.payload;
      }
    },
    
    setToolUsageStats: (state: DrawingMetricsState, action: PayloadAction<Record<string, number>>) => {
      state.toolUsage = action.payload;
    },
    
    clearStats: (state: DrawingMetricsState) => {
      state.toolUsage = {};
      state.drawingDuration = 0;
      // For backward compatibility
      if (state.drawingTime !== undefined) {
        state.drawingTime = 0;
      }
      if (state.objectCount !== undefined) {
        state.objectCount = 0;
      }
    },
    
    // Backward compatibility methods
    incrementObjectCount: (state: DrawingMetricsState) => {
      if (state.objectCount !== undefined) {
        state.objectCount += 1;
      }
    },
    
    incrementDrawingTime: (state: DrawingMetricsState, action: PayloadAction<number>) => {
      if (state.drawingTime !== undefined) {
        state.drawingTime += action.payload;
      }
      state.drawingDuration += action.payload;
    },
    
    recordToolUse: (state: DrawingMetricsState, action: PayloadAction<DrawingMode>) => {
      if (state.lastUsedTool !== undefined) {
        state.lastUsedTool = action.payload;
      }
      
      // Add to toolUsage for both old and new API
      const toolKey = action.payload.toString();
      if (!state.toolUsage[toolKey]) {
        state.toolUsage[toolKey] = {
          count: 1,
          time: 0,
          lastUsed: Date.now()
        } as any;
      } else {
        (state.toolUsage[toolKey] as any).count += 1;
        (state.toolUsage[toolKey] as any).lastUsed = Date.now();
      }
    }
  }
});

export const {
  startToolUsage,
  endToolUsage,
  incrementToolUsage,
  setDrawingDuration,
  setToolUsageStats,
  clearStats,
  // Backward compatibility exports
  incrementObjectCount,
  incrementDrawingTime,
  recordToolUse
} = drawingMetricsSlice.actions;

// Export the reducer for test compatibility
export default drawingMetricsSlice.reducer;
