
// Define user roles for the application
export enum UserRole {
  USER = 'user',
  PHOTOGRAPHER = 'photographer',
  PROCESSING_MANAGER = 'processing_manager',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

// Define property statuses for the application
export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// Create a basic supabase client (placeholder)
export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signIn: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null })
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        order: () => ({
          ascending: false,
          descending: false
        })
      }),
      order: () => ({
        ascending: false,
        descending: false
      }),
      in: () => ({
        order: () => ({
          ascending: false,
          descending: false
        })
      })
    }),
    insert: () => ({
      select: async () => ({ data: null, error: null })
    }),
    update: () => ({
      eq: async () => ({ data: null, error: null })
    })
  })
};

// Add these utilities for the lib/index.ts exports
export const isSecureConnection = () => window.location.protocol === 'https:';
export const isSupabaseConfigured = true;
