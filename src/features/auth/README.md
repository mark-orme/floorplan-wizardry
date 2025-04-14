
# Authentication Feature

This directory contains all components, hooks, and utilities related to user authentication.

## Structure

- `components/`: Authentication-related components like login forms
- `hooks/`: Custom hooks for authentication state and operations
- `utils/`: Authentication-specific utility functions
- `types/`: TypeScript type definitions for authentication data

## Responsibilities

- User login/logout functionality
- Authentication state management
- Role-based access control
- Token management and refresh
- Security utilities related to authentication

## Usage

```tsx
import { RoleGuard } from '@/features/auth';
import { useAuth } from '@/features/auth';
```
