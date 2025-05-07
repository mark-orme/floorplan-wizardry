import { useQuery } from '@tanstack/react-query';

export interface PropertyQueryParams {
  id?: string;
  slug?: string;
  includeDetails?: boolean;
}

export const usePropertyQuery = ({ id, slug, includeDetails = true }: PropertyQueryParams) => {
  return useQuery({
    queryKey: ['property', id || slug || ''],
    queryFn: async () => {
      // Safety check to ensure we have an identifier
      if (!id && !slug) {
        throw new Error("Either property ID or slug must be provided");
      }

      // Use a non-nullable identifier for the API call
      const identifier = id || slug || '';
      
      // For now, just simulate a property fetch
      const mockProperty = {
        id: identifier,
        name: 'Sample Property',
        description: 'A beautiful property with modern amenities',
        price: 350000,
        bedrooms: 3,
        bathrooms: 2,
        address: '123 Main St, Anytown',
        status: 'available',
        userId: 'user123'
      };
      
      return mockProperty;
    },
    enabled: !!(id || slug)  // Only enable the query if we have an identifier
  });
};
