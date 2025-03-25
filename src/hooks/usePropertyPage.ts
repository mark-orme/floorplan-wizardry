
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { UserRole } from '@/lib/supabase';
import { insertTestData } from '@/utils/supabaseSetup';
import { toast } from 'sonner';
import { PropertyListItem } from '@/types/propertyTypes';

export const usePropertyPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Initialize state
  const [authState, setAuthState] = useState({ 
    user: null, 
    userRole: null,
    loading: true,
    hasAccess: false
  });
  
  const [propertyState, setPropertyState] = useState({
    properties: [] as PropertyListItem[],
    isLoading: true
  });
  
  // Get auth context safely
  useEffect(() => {
    try {
      const { user, userRole, loading, hasAccess } = useAuth();
      setAuthState({
        user,
        userRole,
        loading,
        hasAccess: typeof hasAccess === 'function' 
          ? hasAccess([UserRole.PHOTOGRAPHER, UserRole.PROCESSING_MANAGER, UserRole.MANAGER]) 
          : false
      });
    } catch (error) {
      console.error("Error accessing auth context:", error);
      setHasError(true);
      setErrorMessage("Authentication service unavailable");
    }
  }, []);
  
  // Get property management safely
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const { properties, isLoading, listProperties } = usePropertyManagement();
        setPropertyState({
          properties: properties || [],
          isLoading: isLoading || false
        });
        
        if (authState.user && !hasError && typeof listProperties === 'function') {
          await listProperties();
        }
      } catch (error) {
        console.error("Error accessing property management:", error);
        setHasError(true);
        setErrorMessage("Property service unavailable");
      }
    };
    
    loadProperties();
  }, [authState.user, hasError]);

  const handleRowClick = (id: string) => {
    navigate(`/properties/${id}`);
  };

  const handleAddProperty = async () => {
    if (!authState.user) {
      toast.info('Please sign in to create a new property');
      navigate('/auth', { state: { returnTo: '/properties/new' } });
      return;
    }
    
    navigate('/properties/new');
  };

  const handleGoToFloorplans = () => {
    navigate('/floorplans');
  };

  const handleAddTestData = async () => {
    if (!authState.user) {
      toast.info('Please sign in to add test data');
      navigate('/auth', { state: { returnTo: '/properties' } });
      return;
    }
    
    try {
      await insertTestData();
      toast.success('Test data added successfully');
      // Refresh properties after adding test data
      try {
        const { listProperties } = usePropertyManagement();
        if (typeof listProperties === 'function') {
          listProperties();
        }
      } catch (error) {
        console.error("Error refreshing properties:", error);
      }
    } catch (error) {
      console.error('Error adding test data:', error);
      toast.error('Failed to add test data');
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setErrorMessage('');
    try {
      const { listProperties } = usePropertyManagement();
      if (typeof listProperties === 'function') {
        listProperties();
      }
    } catch (error) {
      console.error("Error retrying property load:", error);
      setHasError(true);
      setErrorMessage("Failed to reload properties");
    }
  };

  const filteredProperties = propertyState.properties.filter(prop => {
    if (!prop) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      prop.order_id?.toLowerCase().includes(searchLower) ||
      prop.address?.toLowerCase().includes(searchLower) ||
      prop.client_name?.toLowerCase().includes(searchLower)
    );
  });

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
