export enum UserRole {
  USER = 'user',
  PHOTOGRAPHER = 'photographer',
  PROCESSING_MANAGER = 'processing_manager',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

// Re-export PropertyStatus from canvas-types to keep them together
export { PropertyStatus } from './canvas-types';
