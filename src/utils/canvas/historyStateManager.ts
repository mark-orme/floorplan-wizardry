
/**
 * History state management utilities
 * Functions for managing canvas history states
 */
import { toast } from 'sonner';

/**
 * Interface for history state manager
 */
export interface HistoryState {
  past: string[];
  current: number;
  future: string[];
}

/**
 * Create a new history state
 * @returns Empty history state
 */
export const createInitialHistoryState = (): HistoryState => ({
  past: [],
  current: -1,
  future: []
});

/**
 * Add a state to history
 * @param history Current history state
 * @param newState New state to add
 * @param maxStates Maximum number of states to keep
 * @returns Updated history state
 */
export const addStateToHistory = (
  history: HistoryState,
  newState: string,
  maxStates: number
): HistoryState => {
  // Create new history object to avoid mutations
  const newHistory = { ...history };
  
  // Remove future states if we're not at the end of history
  if (newHistory.current < newHistory.past.length - 1) {
    newHistory.past = newHistory.past.slice(0, newHistory.current + 1);
  }
  
  // Add new state to history
  newHistory.past.push(newState);
  
  // Update current index
  newHistory.current = newHistory.past.length - 1;
  
  // Clear future since we added a new state
  newHistory.future = [];
  
  // Limit history size
  if (newHistory.past.length > maxStates) {
    newHistory.past.shift();
    newHistory.current--;
  }
  
  return newHistory;
};

/**
 * Move to previous state in history
 * @param history Current history state
 * @returns Updated history and previous state
 */
export const moveBackInHistory = (
  history: HistoryState
): { newHistory: HistoryState; previousState: string | null } => {
  // If there's nothing to undo
  if (history.current <= 0) {
    return { newHistory: history, previousState: null };
  }
  
  // Create new history object to avoid mutations
  const newHistory = { ...history };
  
  // Move to previous state
  const currentState = newHistory.past[newHistory.current];
  newHistory.current--;
  
  // Add current state to future
  newHistory.future = [currentState, ...newHistory.future];
  
  // Return new history and previous state
  return { 
    newHistory,
    previousState: newHistory.past[newHistory.current] 
  };
};

/**
 * Move to next state in history
 * @param history Current history state
 * @returns Updated history and next state
 */
export const moveForwardInHistory = (
  history: HistoryState
): { newHistory: HistoryState; nextState: string | null } => {
  // If there's nothing to redo
  if (history.future.length === 0) {
    return { newHistory: history, nextState: null };
  }
  
  // Create new history object to avoid mutations
  const newHistory = { ...history };
  
  // Get first item from future
  const [nextState, ...remainingFuture] = newHistory.future;
  
  // Move to next state
  newHistory.current++;
  newHistory.future = remainingFuture;
  
  // Return new history and next state
  return { 
    newHistory,
    nextState 
  };
};

/**
 * Check if undo is available
 * @param history Current history state
 * @returns Whether undo is available
 */
export const canUndo = (history: HistoryState): boolean => {
  return history.current > 0;
};

/**
 * Check if redo is available
 * @param history Current history state
 * @returns Whether redo is available
 */
export const canRedo = (history: HistoryState): boolean => {
  return history.future.length > 0;
};

/**
 * Show toast for history operations
 * @param operation Operation name ('undo' or 'redo')
 * @param success Whether operation was successful
 */
export const showHistoryActionToast = (operation: 'undo' | 'redo', success: boolean): void => {
  if (success) {
    toast.success(`${operation === 'undo' ? 'Undo' : 'Redo'} successful`);
  } else {
    toast.info(`Nothing to ${operation}`);
  }
};
