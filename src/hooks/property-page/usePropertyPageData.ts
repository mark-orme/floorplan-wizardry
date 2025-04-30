
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PropertyListItem } from '@/types/property-types';
import { usePropertyData } from './usePropertyData';

/**
 * Hook for managing property page data
 */
export const usePropertyPageData = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Get the base property data hook
  const propertyData = usePropertyData();
  const { properties, loading, error, refreshProperties } = propertyData;
  
  // Load properties on mount
  useEffect(() => {
    refreshProperties();
  }, [refreshProperties]);
  
  // Sort and filter properties
  const sortedAndFilteredProperties = properties
    .filter(property => !activeFilter || property.status === activeFilter)
    .sort((a, b) => {
      const aValue = a[sortBy as keyof PropertyListItem];
      const bValue = b[sortBy as keyof PropertyListItem];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      return 0;
    });
  
  // Handle filter changes
  const handleFilterChange = (filter: string | null) => {
    setActiveFilter(filter);
  };
  
  // Handle sort changes
  const handleSortChange = (field: string) => {
    if (field === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };
  
  return {
    properties: sortedAndFilteredProperties,
    loading,
    error,
    activeFilter,
    sortBy,
    sortDirection,
    handleFilterChange,
    handleSortChange,
    refreshData: refreshProperties,
    ...propertyData
  };
};

export default usePropertyPageData;
