
/**
 * Hook for managing property state in the central store
 * @module store/hooks/usePropertyStore
 */
import { useCallback } from 'react';
import { useStore } from '../index';
import * as propertyActions from '../actions/propertyActions';

/**
 * Hook that provides access to property state and actions
 * @returns Property state and action dispatchers
 */
export const usePropertyStore = () => {
  const { state, dispatch } = useStore();
  const propertyState = state.property;

  const setProperties = useCallback((properties: any[]) => {
    dispatch(propertyActions.setProperties(properties));
  }, [dispatch]);

  const setCurrentProperty = useCallback((property: any) => {
    dispatch(propertyActions.setCurrentProperty(property));
  }, [dispatch]);

  const setLoading = useCallback((isLoading: boolean) => {
    dispatch(propertyActions.setPropertyLoading(isLoading));
  }, [dispatch]);

  const setError = useCallback((hasError: boolean, message: string = '') => {
    dispatch(propertyActions.setPropertyError(hasError, message));
  }, [dispatch]);

  return {
    // State
    properties: propertyState.properties,
    currentProperty: propertyState.currentProperty,
    isLoading: propertyState.isLoading,
    hasError: propertyState.hasError,
    errorMessage: propertyState.errorMessage,
    
    // Actions
    setProperties,
    setCurrentProperty,
    setLoading,
    setError
  };
};
