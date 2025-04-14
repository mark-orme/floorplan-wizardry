
/**
 * Authentication feature exports
 * @module features/auth
 */

// Import existing components from their current locations
export { default as RoleGuard } from '@/components/RoleGuard';

// Re-export from existing contexts
export { useCanvasContext } from '@/contexts/CanvasContext';

// Types (these will need to be updated when the actual types are defined)
export type User = any;
export type UserRole = any;
