
/**
 * Central state management system
 * Provides a lightweight Redux-like state management using React Context and useReducer
 * @module store
 */
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Action type definition
export interface Action<T = any> {
  type: string;
  payload?: T;
}

// State structure
export interface AppState {
  canvas: CanvasState;
  property: PropertyState;
  ui: UIState;
}

// Canvas-related state
export interface CanvasState {
  currentTool: string;
  zoomLevel: number;
  lineThickness: number;
  lineColor: string;
  snapToGrid: boolean;
  floorPlans: any[];
  currentFloor: number;
  gia: number;
  drawingState: any | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
}

// Property-related state
export interface PropertyState {
  properties: any[];
  currentProperty: any | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
}

// UI-related state
export interface UIState {
  sidebarOpen: boolean;
  currentTab: string;
  searchTerm: string;
  debugMode: boolean;
}

// Initial state
const initialState: AppState = {
  canvas: {
    currentTool: 'select',
    zoomLevel: 1,
    lineThickness: 2,
    lineColor: '#000000',
    snapToGrid: true,
    floorPlans: [],
    currentFloor: 0,
    gia: 0,
    drawingState: null,
    isLoading: false,
    hasError: false,
    errorMessage: ''
  },
  property: {
    properties: [],
    currentProperty: null,
    isLoading: false,
    hasError: false,
    errorMessage: ''
  },
  ui: {
    sidebarOpen: true,
    currentTab: 'details',
    searchTerm: '',
    debugMode: false
  }
};

// Root reducer that combines all sub-reducers
const rootReducer = (state: AppState, action: Action): AppState => {
  return {
    canvas: canvasReducer(state.canvas, action),
    property: propertyReducer(state.property, action),
    ui: uiReducer(state.ui, action)
  };
};

// Canvas reducer
const canvasReducer = (state: CanvasState, action: Action): CanvasState => {
  switch (action.type) {
    case 'canvas/setTool':
      return { ...state, currentTool: action.payload };
    case 'canvas/setZoom':
      return { ...state, zoomLevel: action.payload };
    case 'canvas/setLineThickness':
      return { ...state, lineThickness: action.payload };
    case 'canvas/setLineColor':
      return { ...state, lineColor: action.payload };
    case 'canvas/setSnapToGrid':
      return { ...state, snapToGrid: action.payload };
    case 'canvas/setFloorPlans':
      return { ...state, floorPlans: action.payload };
    case 'canvas/setCurrentFloor':
      return { ...state, currentFloor: action.payload };
    case 'canvas/setGia':
      return { ...state, gia: action.payload };
    case 'canvas/setDrawingState':
      return { ...state, drawingState: action.payload };
    case 'canvas/setLoading':
      return { ...state, isLoading: action.payload };
    case 'canvas/setError':
      return { 
        ...state, 
        hasError: action.payload.hasError, 
        errorMessage: action.payload.message || '' 
      };
    default:
      return state;
  }
};

// Property reducer
const propertyReducer = (state: PropertyState, action: Action): PropertyState => {
  switch (action.type) {
    case 'property/setProperties':
      return { ...state, properties: action.payload };
    case 'property/setCurrentProperty':
      return { ...state, currentProperty: action.payload };
    case 'property/setLoading':
      return { ...state, isLoading: action.payload };
    case 'property/setError':
      return { 
        ...state, 
        hasError: action.payload.hasError, 
        errorMessage: action.payload.message || '' 
      };
    default:
      return state;
  }
};

// UI reducer
const uiReducer = (state: UIState, action: Action): UIState => {
  switch (action.type) {
    case 'ui/setSidebarOpen':
      return { ...state, sidebarOpen: action.payload };
    case 'ui/setCurrentTab':
      return { ...state, currentTab: action.payload };
    case 'ui/setSearchTerm':
      return { ...state, searchTerm: action.payload };
    case 'ui/setDebugMode':
      return { ...state, debugMode: action.payload };
    default:
      return state;
  }
};

// Create the store context
const StoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null
});

// Provider component
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook to use the store
export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
