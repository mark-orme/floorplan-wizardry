
import { DrawingMode } from '@/constants/drawingModes';

// Define the shape of our drawing state
interface DrawingMetrics {
  pointCount: number;
  strokeCount: number;
  currentTool: DrawingMode;
  isDrawing: boolean;
  timestamp: number;
}

// Initial metrics state
const initialMetrics: DrawingMetrics = {
  pointCount: 0,
  strokeCount: 0,
  currentTool: DrawingMode.SELECT,
  isDrawing: false,
  timestamp: Date.now()
};

// Action types
type MetricsAction = 
  | { type: 'TOOL_CHANGED'; payload: DrawingMode }
  | { type: 'DRAWING_STARTED' }
  | { type: 'DRAWING_ENDED'; payload: { pointCount: number } }
  | { type: 'POINT_ADDED' }
  | { type: 'RESET_METRICS' };

// Ensure DrawingMode includes PAN
if (!Object.values(DrawingMode).includes('PAN' as any)) {
  // Add PAN to DrawingMode if it doesn't exist
  (DrawingMode as any).PAN = 'PAN';
}

// Reducer function
function metricsReducer(state: DrawingMetrics, action: MetricsAction): DrawingMetrics {
  switch (action.type) {
    case 'TOOL_CHANGED':
      return {
        ...state,
        currentTool: action.payload,
        timestamp: Date.now()
      };
    case 'DRAWING_STARTED':
      return {
        ...state,
        isDrawing: true,
        timestamp: Date.now()
      };
    case 'DRAWING_ENDED':
      return {
        ...state,
        isDrawing: false,
        pointCount: state.pointCount + action.payload.pointCount,
        strokeCount: state.strokeCount + 1,
        timestamp: Date.now()
      };
    case 'POINT_ADDED':
      return {
        ...state,
        pointCount: state.pointCount + 1,
        timestamp: Date.now()
      };
    case 'RESET_METRICS':
      return {
        ...initialMetrics,
        timestamp: Date.now()
      };
    default:
      return state;
  }
}

// Data transformer for analytics
function transformMetricsForAnalytics(metrics: DrawingMetrics) {
  return {
    averagePointsPerStroke: metrics.strokeCount > 0 
      ? metrics.pointCount / metrics.strokeCount 
      : 0,
    currentTool: metrics.currentTool,
    isDrawing: metrics.isDrawing,
    lastUpdated: new Date(metrics.timestamp).toISOString()
  };
}

export {
  type DrawingMetrics,
  initialMetrics,
  metricsReducer,
  transformMetricsForAnalytics
};
