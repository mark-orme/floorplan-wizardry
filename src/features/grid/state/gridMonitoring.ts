
// Define the shape of our grid state
interface GridState {
  visible: boolean;
  size: number;
  opacity: number;
  snapEnabled: boolean;
  lastUpdated: number;
}

// Initial grid state
const initialGridState: GridState = {
  visible: true,
  size: 20,
  opacity: 0.5,
  snapEnabled: true,
  lastUpdated: Date.now()
};

// Action types
type GridAction = 
  | { type: 'TOGGLE_GRID_VISIBILITY' }
  | { type: 'SET_GRID_SIZE'; payload: number }
  | { type: 'SET_GRID_OPACITY'; payload: number }
  | { type: 'TOGGLE_GRID_SNAP' }
  | { type: 'RESET_GRID' };

// Reducer function
function gridReducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
    case 'TOGGLE_GRID_VISIBILITY':
      return {
        ...state,
        visible: !state.visible,
        lastUpdated: Date.now()
      };
    case 'SET_GRID_SIZE':
      return {
        ...state,
        size: action.payload,
        lastUpdated: Date.now()
      };
    case 'SET_GRID_OPACITY':
      return {
        ...state,
        opacity: action.payload,
        lastUpdated: Date.now()
      };
    case 'TOGGLE_GRID_SNAP':
      return {
        ...state,
        snapEnabled: !state.snapEnabled,
        lastUpdated: Date.now()
      };
    case 'RESET_GRID':
      return {
        ...initialGridState,
        lastUpdated: Date.now()
      };
    default:
      return state;
  }
}

// Performance monitoring function
function monitorGridPerformance(gridState: GridState) {
  // Add performance monitoring logic here
  console.log('Grid state updated', {
    visible: gridState.visible,
    size: gridState.size,
    lastUpdated: new Date(gridState.lastUpdated).toISOString()
  });
  
  return {
    performanceMetrics: {
      renderTime: 0, // Placeholder for actual measurements
      complexity: calculateGridComplexity(gridState)
    }
  };
}

// Helper function to calculate grid complexity
function calculateGridComplexity(gridState: GridState) {
  if (!gridState.visible) return 0;
  
  // Simple calculation based on grid size (smaller size = more grid lines = higher complexity)
  return gridState.size > 0 ? (100 / gridState.size) : 0;
}

export {
  type GridState,
  initialGridState,
  gridReducer,
  monitorGridPerformance
};
