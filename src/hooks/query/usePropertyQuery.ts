
import { createQueryHook, createMutationHook } from './useQueryHook';
import { supabase } from '@/lib/supabase';
import { Property, PropertyListItem, PropertyStatus } from '@/types/propertyTypes';
import { useAsyncState } from './useAsyncState';
import { QueryKey } from '@tanstack/react-query';

// Generate query keys for properties
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const, 
  list: (filters: object) => [...propertyKeys.lists(), { ...filters }] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
};

// Define query parameters type for properties
interface ListPropertiesParams {
  userId?: string;
  userRole?: string;
  filters?: {
    status?: PropertyStatus[];
    searchTerm?: string;
  };
}

// Define the query function
const fetchProperties = async ({ userId, userRole, filters }: ListPropertiesParams): Promise<PropertyListItem[]> => {
  if (!userId) {
    return [];
  }

  let query = supabase.from('properties').select();

  // Apply filters based on role
  if (userRole === 'photographer') {
    query = query.eq('created_by', userId);
  } else if (userRole === 'processing_manager') {
    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    } else {
      query = query.in('status', [PropertyStatus.PENDING_REVIEW, PropertyStatus.COMPLETED]);
    }
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as PropertyListItem[];
};

// Define the get property function
const fetchProperty = async (id: string): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Property not found');
  }

  return data as Property;
};

// Create the hooks using our factory
export const useListProperties = createQueryHook(
  fetchProperties,
  (params: ListPropertiesParams): QueryKey => propertyKeys.list(params.filters || {} as any)
);

export const useProperty = createQueryHook(
  fetchProperty,
  (id: string): QueryKey => propertyKeys.detail(id)
);

// Extended hook with additional functionality
export function usePropertiesQuery(params: ListPropertiesParams) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useListProperties(params);

  // Use standardized state hook
  const state = useAsyncState(
    isLoading,
    isError,
    error as Error | null,
    data,
    []
  );

  // Filter properties client-side if searchTerm is provided
  const filteredProperties = params.filters?.searchTerm
    ? state.data.filter(prop => {
        const searchLower = params.filters?.searchTerm?.toLowerCase() || '';
        return (
          prop.order_id?.toLowerCase().includes(searchLower) ||
          prop.address?.toLowerCase().includes(searchLower) ||
          prop.client_name?.toLowerCase().includes(searchLower)
        );
      })
    : state.data;

  return {
    ...state,
    properties: filteredProperties,
    refetch,
  };
}
