
/**
 * Authentication feature exports
 * @module features/auth
 */

// Re-export components
export { LoginForm } from './components/LoginForm';
export { SignupForm } from './components/SignupForm';
export { AuthLayout } from './components/AuthLayout';
export { AuthHeader } from './components/AuthHeader';

// Re-export context and hooks
export { useAuth, AuthProvider } from './context/AuthContext';
export { default as RoleGuard } from './components/RoleGuard';

// Re-export types
export type { User, UserRole } from './types';
