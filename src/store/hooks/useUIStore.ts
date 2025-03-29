
/**
 * Hook for managing UI state in the central store
 * @module store/hooks/useUIStore
 */
import { useCallback } from 'react';
import { useStore } from '../index';
import * as uiActions from '../actions/uiActions';

/**
 * Hook that provides access to UI state and actions
 * @returns UI state and action dispatchers
 */
export const useUIStore = () => {
  const { state, dispatch } = useStore();
  const uiState = state.ui;

  const setSidebarOpen = useCallback((isOpen: boolean) => {
    dispatch(uiActions.setSidebarOpen(isOpen));
  }, [dispatch]);

  const setCurrentTab = useCallback((tab: string) => {
    dispatch(uiActions.setCurrentTab(tab));
  }, [dispatch]);

  const setSearchTerm = useCallback((term: string) => {
    dispatch(uiActions.setSearchTerm(term));
  }, [dispatch]);

  const setDebugMode = useCallback((enabled: boolean) => {
    dispatch(uiActions.setDebugMode(enabled));
  }, [dispatch]);

  return {
    // State
    sidebarOpen: uiState.sidebarOpen,
    currentTab: uiState.currentTab,
    searchTerm: uiState.searchTerm,
    debugMode: uiState.debugMode,
    
    // Actions
    setSidebarOpen,
    setCurrentTab,
    setSearchTerm,
    setDebugMode
  };
};
