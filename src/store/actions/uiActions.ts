
/**
 * UI-related action creators
 * @module store/actions/uiActions
 */
import { Action } from '../index';

export const setSidebarOpen = (isOpen: boolean): Action => ({
  type: 'ui/setSidebarOpen',
  payload: isOpen
});

export const setCurrentTab = (tab: string): Action => ({
  type: 'ui/setCurrentTab',
  payload: tab
});

export const setSearchTerm = (term: string): Action => ({
  type: 'ui/setSearchTerm',
  payload: term
});

export const setDebugMode = (enabled: boolean): Action => ({
  type: 'ui/setDebugMode',
  payload: enabled
});
