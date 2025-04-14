
# Lib Directory

This directory contains library integrations and external service wrappers.

## Structure

This directory wraps third-party libraries and services:

- `supabase.ts` - Supabase client and utilities
- `utils.ts` - General utility functions
- Other third-party services or APIs

## Usage Guidelines

1. Each file should provide a clean API for a specific external service
2. Handle initialization and configuration internally
3. Provide TypeScript types for function parameters and return values
4. Export client instances, utility functions, and types through barrel files (index.ts)

## Example

```tsx
// Good example - supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getUser() {
  return supabase.auth.getUser();
}
```
