
import { useQuery, useMutation, UseMutationOptions, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Factory function to create query hooks with consistent error handling and loading states
 * @param queryFn - The function that fetches data
 * @param queryKeyFn - Function that generates a query key based on params
 * @returns A configured useQuery hook with better typing and error handling
 */
export function createQueryHook<TData, TParams = void, TError = Error>(
  queryFn: (params: TParams) => Promise<TData>,
  queryKeyFn: (params: TParams) => QueryKey
) {
  return (
    params: TParams,
    options?: Omit<UseQueryOptions<TData, TError, TData, QueryKey>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery({
      queryKey: queryKeyFn(params),
      queryFn: () => queryFn(params),
      meta: {
        onError: (error: TError) => {
          const message = error instanceof Error ? error.message : 'An error occurred';
          toast.error(message);
        }
      },
      ...options,
    });
  };
}

/**
 * Factory function to create mutation hooks with consistent error handling
 * @param mutationFn - The function that performs the mutation
 * @returns A configured useMutation hook with better typing and error handling
 */
export function createMutationHook<TData, TVariables, TError = Error>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  mutationKeyFn?: (variables: TVariables) => QueryKey
) {
  return (
    options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
  ) => {
    return useMutation({
      mutationFn,
      meta: {
        onError: (error: TError) => {
          const message = error instanceof Error ? error.message : 'An error occurred';
          toast.error(message);
        }
      },
      ...options,
    });
  };
}
