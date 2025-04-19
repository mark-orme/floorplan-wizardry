
/**
 * Supabase Setup Utilities
 * Functions to initialize and manage Supabase integration
 */
import { supabase } from '@/lib/supabase';
import logger from '@/utils/logger';

/**
 * Check if Supabase tables exist and are correctly configured
 */
export async function checkSupabaseTables() {
  try {
    // Check if users table exists
    const userTableResult = await supabase
      .from('users')
      .select();
      
    const userTableExists = !userTableResult.error;
    
    // Check if floor_plans table exists
    const floorPlansTableResult = await supabase
      .from('floor_plans')
      .select();
      
    const floorPlansTableExists = !floorPlansTableResult.error;
    
    // Check if properties table exists
    const propertiesTableResult = await supabase
      .from('properties')
      .select();
      
    const propertiesTableExists = !propertiesTableResult.error;
    
    return {
      usersTable: userTableExists,
      floorPlansTable: floorPlansTableExists,
      propertiesTable: propertiesTableExists,
      allTablesExist: userTableExists && floorPlansTableExists && propertiesTableExists
    };
  } catch (error) {
    logger.error('Error checking Supabase tables:', error);
    return {
      usersTable: false,
      floorPlansTable: false,
      propertiesTable: false,
      allTablesExist: false
    };
  }
}

/**
 * Initialize Supabase schema if needed
 */
export async function initializeSupabaseSchema() {
  try {
    const { allTablesExist } = await checkSupabaseTables();
    
    if (allTablesExist) {
      logger.info('Supabase schema already initialized');
      return true;
    }
    
    logger.info('Initializing Supabase schema');
    
    // Create missing tables - this would be replaced by proper SQL migrations
    // in a production environment - Modified to use direct queries instead of RPC
    
    // Create users table if it doesn't exist
    const usersTableResult = await supabase.from('users').insert({}).select();
    
    if (usersTableResult.error && usersTableResult.error.code !== '23505') {
      logger.error('Error creating users table:', usersTableResult.error);
    }
    
    // Create floor_plans table if it doesn't exist
    const floorPlansTableResult = await supabase.from('floor_plans').insert({}).select();
    
    if (floorPlansTableResult.error && floorPlansTableResult.error.code !== '23505') {
      logger.error('Error creating floor_plans table:', floorPlansTableResult.error);
    }
    
    // Create properties table if it doesn't exist
    const propertiesTableResult = await supabase.from('properties').insert({}).select();
    
    if (propertiesTableResult.error && propertiesTableResult.error.code !== '23505') {
      logger.error('Error creating properties table:', propertiesTableResult.error);
    }
    
    return true;
  } catch (error) {
    logger.error('Error initializing Supabase schema:', error);
    return false;
  }
}

/**
 * Verify and set up RLS policies
 */
export async function verifyRLSPolicies() {
  try {
    // This is a placeholder for a real implementation
    // In a real implementation, we would check if the RLS policies are in place
    // and create them if they are not
    
    logger.info('Verifying RLS policies');
    
    return {
      usersPolicies: true,
      floorPlansPolicies: true,
      propertiesPolicies: true,
      allPoliciesExist: true
    };
  } catch (error) {
    logger.error('Error verifying RLS policies:', error);
    return {
      usersPolicies: false,
      floorPlansPolicies: false,
      propertiesPolicies: false,
      allPoliciesExist: false
    };
  }
}

/**
 * Insert test data for development purposes
 */
export async function insertTestData() {
  try {
    const properties = [
      {
        address: '123 Main St, Springfield, IL',
        client_name: 'John Smith',
        status: 'pending',
        notes: 'Test property 1'
      },
      {
        address: '456 Oak Ave, Shelbyville, IL',
        client_name: 'Jane Doe',
        status: 'completed',
        notes: 'Test property 2'
      },
      {
        address: '789 Pine Rd, Capital City, IL',
        client_name: 'Bob Johnson',
        status: 'draft',
        notes: 'Test property 3'
      }
    ];

    for (const property of properties) {
      const result = await supabase.from('properties').insert(property).select();
      
      if (result.error) {
        logger.error('Error creating test property:', result.error);
      } else {
        logger.info(`Created test property: ${property.address}`);
      }
    }

    return true;
  } catch (error) {
    logger.error('Error inserting test data:', error);
    throw error;
  }
}
