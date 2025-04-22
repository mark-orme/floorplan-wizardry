
import { useState, useEffect, useCallback } from 'react';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { PropertyListItem } from '@/types/propertyTypes';
import { toast } from 'sonner';

/**
 * Hook for handling property data for the property page
 * @param {any} user - The current authenticated user
 * @returns {Object} Object containing property data state and handlers
 */
export const usePropertyPageData = (user: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasError, setHasError] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  
  // Initialize property management hook once at the top level
  const propertyManagement = usePropertyManagement();
  const { isLoading: propertiesLoading, listProperties } = propertyManagement;

  /**
   * Load properties when user is authenticated
   */
  useEffect(() => {
    const loadProperties = async () => {
      if (!user) return;
      
      try {
        const result = await listProperties();
        setProperties(result || []);
      } catch (error) {
        console.error("Error loading properties:", error);
        setHasError(true);
        setErrorMessage("Failed to load properties");
      }
    };
    
    if (user && !hasError) {
      loadProperties();
    }
  }, [user, hasError, listProperties]);

  /**
   * Filter properties based on search term
   */
  const filteredProperties = (properties || []).filter(prop => {
    if (!prop) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      prop.order_id?.toLowerCase().includes(searchLower) ||
      prop.address?.toLowerCase().includes(searchLower) ||
      prop.client_name?.toLowerCase().includes(searchLower)
    );
  });

  /**
   * Retry loading properties after an error
   */
  const handleRetry = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
    if (user && listProperties) {
      listProperties()
        .then(result => {
          setProperties(result || []);
        })
        .catch(error => {
          console.error("Error retrying property load:", error);
          setHasError(true);
          setErrorMessage("Failed to reload properties");
        });
    }
  }, [user, listProperties]);

  return {
    searchTerm,
    setSearchTerm,
    errorMessage,
    hasError,
    setHasError,
    propertyState: {
      properties: properties || [],
      isLoading: propertiesLoading
    },
    filteredProperties,
    handleRetry
  };
};
