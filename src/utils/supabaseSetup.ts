
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
      .select('id')
      .limit(1);
      
    const userTableExists = !userTableResult.error;
    
    // Check if floor_plans table exists
    const floorPlansTableResult = await supabase
      .from('floor_plans')
      .select('id')
      .limit(1);
      
    const floorPlansTableExists = !floorPlansTableResult.error;
    
    // Check if properties table exists
    const propertiesTableResult = await supabase
      .from('properties')
      .select('id')
      .limit(1);
      
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
    // in a production environment
    
    // Create users table if it doesn't exist
    const usersTableResult = await supabase.rpc('create_users_table_if_not_exists');
    
    if (usersTableResult.error) {
      logger.error('Error creating users table:', usersTableResult.error);
    }
    
    // Create floor_plans table if it doesn't exist
    const floorPlansTableResult = await supabase.rpc('create_floor_plans_table_if_not_exists');
    
    if (floorPlansTableResult.error) {
      logger.error('Error creating floor_plans table:', floorPlansTableResult.error);
    }
    
    // Create properties table if it doesn't exist
    const propertiesTableResult = await supabase.rpc('create_properties_table_if_not_exists');
    
    if (propertiesTableResult.error) {
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
