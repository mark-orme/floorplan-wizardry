
# Authentication Feature

This module handles all authentication-related functionality including:

- User login and registration
- Session management
- Auth context and hooks
- Role-based access control

## Components

- `LoginForm` - Form for user login
- `SignupForm` - Form for user registration
- `AuthLayout` - Layout wrapper for auth pages

## Hooks

- `useAuth` - Hook for accessing authentication context
- `useAuthGuard` - Hook for protecting routes

## Usage

Import components and hooks directly from the feature:

```tsx
import { useAuth, LoginForm } from '@/features/auth';
```
