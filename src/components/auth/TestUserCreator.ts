
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

interface TestUserOptions {
  email?: string;
  password?: string;
  metadata?: Record<string, any>;
}

export class TestUserCreator {
  private supabaseUrl: string;
  private supabaseKey: string;
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
  }
  
  /**
   * Creates a test user for development and testing purposes
   */
  async createTestUser(options: TestUserOptions = {}) {
    try {
      const supabase = createClient(this.supabaseUrl, this.supabaseKey);
      
      // Generate unique test credentials if not provided
      const email = options.email || `test-${nanoid(6)}@example.com`;
      const password = options.password || `Password${nanoid(8)}`;
      
      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options.metadata || {
            is_test_user: true,
            created_at: new Date().toISOString(),
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Store test user info securely (only in development)
      if (process.env.NODE_ENV !== 'production') {
        const userInfo = {
          id: data.user?.id || '',
          email,
          password,
          created: new Date().toISOString()
        };
        
        localStorage.setItem('dev_test_user', JSON.stringify(userInfo));
      }
      
      return {
        success: true,
        user: data.user,
        credentials: {
          email,
          password
        }
      };
    } catch (error) {
      console.error('Error creating test user:', error);
      return {
        success: false,
        error
      };
    }
  }
}
