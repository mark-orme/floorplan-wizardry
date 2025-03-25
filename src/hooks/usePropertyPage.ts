
import { useState, useEffect, useCallback } from 'react';
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
  
  // Get auth context properly
  const { user, userRole, loading: authLoading } = useAuth();
  const hasAccess = userRole ? [UserRole.PHOTOGRAPHER, UserRole.PROCESSING_MANAGER, UserRole.MANAGER].includes(userRole) : false;
  
  // Initialize property management hook once
  const propertyManagement = usePropertyManagement();
  const { properties, isLoading: propertiesLoading, listProperties } = propertyManagement;
  
  // Combine auth and property loading states
  const isLoading = authLoading || propertiesLoading;
  
  // Load properties when user is authenticated
  useEffect(() => {
    const loadProperties = async () => {
      if (!user) return;
      
      try {
        await listProperties();
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

  const handleRowClick = useCallback((id: string) => {
    navigate(`/properties/${id}`);
  }, [navigate]);

  const handleAddProperty = useCallback(async () => {
    if (!user) {
      toast.info('Please sign in to create a new property');
      navigate('/auth', { state: { returnTo: '/properties/new' } });
      return;
    }
    
    navigate('/properties/new');
  }, [navigate, user]);

  const handleGoToFloorplans = useCallback(() => {
    navigate('/floorplans');
  }, [navigate]);

  const handleAddTestData = useCallback(async () => {
    if (!user) {
      toast.info('Please sign in to add test data');
      navigate('/auth', { state: { returnTo: '/properties' } });
      return;
    }
    
    try {
      await insertTestData();
      toast.success('Test data added successfully');
      // Refresh properties list
      if (listProperties) {
        await listProperties();
      }
    } catch (error) {
      console.error('Error adding test data:', error);
      toast.error('Failed to add test data');
    }
  }, [navigate, user, listProperties]);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
    if (user && listProperties) {
      listProperties().catch(error => {
        console.error("Error retrying property load:", error);
        setHasError(true);
        setErrorMessage("Failed to reload properties");
      });
    }
  }, [user, listProperties]);

  const filteredProperties = (properties || []).filter(prop => {
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
    authState: {
      user,
      userRole,
      loading: authLoading,
      hasAccess
    },
    propertyState: {
      properties: properties || [],
      isLoading: propertiesLoading
    },
    filteredProperties,
    handleRowClick,
    handleAddProperty,
    handleGoToFloorplans,
    handleAddTestData,
    handleRetry
  };
};
