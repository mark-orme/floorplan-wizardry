
import { createClient } from '@supabase/supabase-js';

// Create a supabase client with appropriate configuration
const supabaseClient = createClient(
  process.env.SUPABASE_URL || 'https://example.supabase.co',
  process.env.SUPABASE_KEY || 'public-anon-key'
);

/**
 * Initialize application on first load
 */
export async function initializeApp() {
  try {
    // Check if app is already initialized
    const { data, error } = await supabaseClient
      .from('app_settings')
      .select('initialized')
      .eq('id', 'app-settings')
      .single();
    
    if (error) {
      console.error('Error checking app initialization:', error.message);
      return false;
    }
    
    if (data && data.initialized) {
      console.log('App already initialized');
      return true;
    }
    
    // Initialize the app
    const { error: updateError } = await supabaseClient
      .from('app_settings')
      .update({ initialized: true, initialized_at: new Date().toISOString() })
      .eq('id', 'app-settings');
    
    if (updateError) {
      console.error('Error initializing app:', updateError.message);
      return false;
    }
    
    console.log('App initialized successfully');
    return true;
  } catch (err) {
    console.error('Unexpected error during app initialization:', err);
    return false;
  }
}

/**
 * Get application settings
 */
export async function getAppSettings() {
  try {
    const { data, error } = await supabaseClient
      .from('app_settings')
      .select('*')
      .eq('id', 'app-settings')
      .single();
    
    if (error) {
      console.error('Error fetching app settings:', error.message);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Unexpected error fetching app settings:', err);
    return null;
  }
}

/**
 * Insert test data for development
 */
export async function insertTestData() {
  try {
    // Implementation would go here
    console.log('Inserting test data');
    return true;
  } catch (err) {
    console.error('Error inserting test data:', err);
    return false;
  }
}
