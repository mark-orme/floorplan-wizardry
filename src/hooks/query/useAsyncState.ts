
/**
 * Custom hook for handling async state with a consistent pattern
 * Returns standardized loading, error, and data states
 */
export function useAsyncState<T>(
  isLoading: boolean,
  isError: boolean,
  error: Error | null,
  data: T | undefined,
  defaultValue: T
) {
  return {
    isLoading,
    isError,
    error,
    data: data ?? defaultValue,
    isSuccess: !isLoading && !isError && data !== undefined,
  };
}
