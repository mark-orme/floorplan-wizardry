
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { insertTestData } from '@/utils/supabaseSetup';
import { toast } from 'sonner';

/**
 * Hook for handling property page actions
 */
export const usePropertyPageActions = (
  user: any,
  listProperties: () => Promise<any>
) => {
  // Always call hooks at the top level
  const navigate = useNavigate();

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

  return {
    handleRowClick,
    handleAddProperty,
    handleGoToFloorplans,
    handleAddTestData
  };
};
