
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { toast } from 'sonner';

// Create a client with consistent defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: import.meta.env.PROD, // Only in production
      retry: 1, // Retry failed queries once by default
      useErrorBoundary: false, // Handle errors via onError by default
    },
    mutations: {
      onError: (error: any) => {
        toast.error(
          error.message || 'An error occurred while processing your request'
        );
      },
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Provider for React Query with consistent configuration
 * Wraps the application with QueryClientProvider
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
