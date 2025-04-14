
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { PropertyStatus } from '@/types/propertyTypes';

/**
 * Insert test data into Supabase for development purposes
 */
export const insertTestData = async (): Promise<void> => {
  try {
    // Check if we have test data already
    const { data } = await supabase
      .from('properties')
      .select()
      .limit(1);
      
    if (data && data.length > 0) {
      toast.info('Test data already exists');
      return;
    }

    // Sample properties for testing
    const testProperties = [
      {
        order_id: 'ORD-2023-001',
        address: '123 Main Street, London',
        client_name: 'John Smith',
        branch_name: 'Central London',
        status: PropertyStatus.DRAFT,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: 'Large Victorian property with garden',
        user_id: 'current-user-id', // This will be replaced below
        name: '123 Main Street',
        type: 'residential',
        bedrooms: 3,
        bathrooms: 2,
        area: 1500,
        floorPlans: JSON.stringify([])
      },
      {
        order_id: 'ORD-2023-002',
        address: '456 Park Avenue, Manchester',
        client_name: 'Jane Doe',
        branch_name: 'Manchester North',
        status: PropertyStatus.PENDING_REVIEW,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: 'Modern apartment in city center',
        user_id: 'current-user-id', // This will be replaced below
        name: '456 Park Avenue',
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 1,
        area: 850,
        floorPlans: JSON.stringify([])
      },
      {
        order_id: 'ORD-2023-003',
        address: '789 River Road, Birmingham',
        client_name: 'Robert Johnson',
        branch_name: 'Birmingham South',
        status: PropertyStatus.COMPLETED,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: 'Commercial property with parking',
        user_id: 'current-user-id', // This will be replaced below
        name: '789 River Road',
        type: 'commercial',
        bedrooms: 0,
        bathrooms: 2,
        area: 2500,
        floorPlans: JSON.stringify([])
      }
    ];

    // Get current user ID
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || 'anonymous-user';

    // Update properties with the current user ID
    const propertiesWithUserId = testProperties.map(property => ({
      ...property,
      user_id: userId,
      userId: userId
    }));

    // Insert the test properties
    const { error } = await supabase
      .from('properties')
      .insert(propertiesWithUserId);

    if (error) {
      throw error;
    }

    toast.success('Test data inserted successfully');
  } catch (error: any) {
    console.error('Error inserting test data:', error);
    toast.error(`Failed to insert test data: ${error.message || 'Unknown error'}`);
  }
};
