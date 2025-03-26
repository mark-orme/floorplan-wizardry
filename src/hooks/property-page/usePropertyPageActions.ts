
/**
 * Hook for handling property page actions
 * Provides navigation and data management for the property page
 * @module usePropertyPageActions
 */
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { insertTestData } from '@/utils/supabaseSetup';
import { toast } from 'sonner';

/**
 * Hook for handling property page actions
 * Provides navigation and data manipulation functions
 * 
 * @param {any} user - The current authenticated user
 * @param {Function} listProperties - Function to refresh the properties list
 * @returns {Object} Object containing handler functions for property page actions
 */
export const usePropertyPageActions = (
  user: any,
  listProperties: () => Promise<any>
) => {
  // Always call hooks at the top level
  const navigate = useNavigate();

  /**
   * Handles row click in the property list
   * Navigates to the property detail page
   * 
   * @param {string} id - Property ID
   */
  const handleRowClick = useCallback((id: string) => {
    navigate(`/properties/${id}`);
  }, [navigate]);

  /**
   * Handles add property button click
   * Navigates to property creation page or auth page if user is not signed in
   */
  const handleAddProperty = useCallback(async () => {
    if (!user) {
      toast.info('Please sign in to create a new property');
      navigate('/auth', { state: { returnTo: '/properties/new' } });
      return;
    }
    
    navigate('/properties/new');
  }, [navigate, user]);

  /**
   * Navigates to floorplans page
   * Provides direct access to the floor plan editor
   */
  const handleGoToFloorplans = useCallback(() => {
    navigate('/floorplans');
  }, [navigate]);

  /**
   * Adds test data to the database
   * Creates sample properties for development and testing
   * Shows a toast notification based on the result
   */
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

  return {
    handleRowClick,
    handleAddProperty,
    handleGoToFloorplans,
    handleAddTestData
  };
};
