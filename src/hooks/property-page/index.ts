
import { usePropertyPageAuth } from './usePropertyPageAuth';
import { usePropertyPageData } from './usePropertyPageData';
import { usePropertyPageActions } from './usePropertyPageActions';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';

/**
 * Main hook that combines all property page functionality
 * This maintains the same API as the original usePropertyPage hook
 */
export const usePropertyPage = () => {
  // Initialize all the specialized hooks
  const { authState, hasError: authError, setHasError: setAuthError, navigate } = usePropertyPageAuth();
  
  const { 
    searchTerm,
    setSearchTerm,
    errorMessage,
    hasError: dataError,
    setHasError: setDataError,
    propertyState,
    filteredProperties,
    handleRetry
  } = usePropertyPageData(authState.user);

  const { listProperties } = usePropertyManagement();
  
  const {
    handleRowClick,
    handleAddProperty,
    handleGoToFloorplans,
    handleAddTestData
  } = usePropertyPageActions(authState.user, listProperties);

  // Combine error states
  const hasError = authError || dataError;
  
  // Return the same API as the original hook
  return {
    searchTerm,
    setSearchTerm,
    hasError,
    errorMessage,
    authState,
    propertyState,
    filteredProperties,
    handleRowClick,
    handleAddProperty,
    handleGoToFloorplans,
    handleAddTestData,
    handleRetry
  };
};

// Re-export the individual hooks for more granular usage
export {
  usePropertyPageAuth,
  usePropertyPageData,
  usePropertyPageActions
};
