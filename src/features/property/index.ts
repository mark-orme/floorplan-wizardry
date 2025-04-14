
/**
 * Property feature exports
 * @module features/property
 */

// Import from existing components
export { PropertyHeader } from '@/components/property/PropertyHeader';
export { PropertyDetailsTab } from '@/components/property/PropertyDetailsTab';
export { PropertyFloorPlanTab } from '@/components/property/PropertyFloorPlanTab';
export { PropertyList } from '@/components/properties/PropertyList';
export { PropertySearch } from '@/components/properties/PropertySearch';
export { EmptyState } from '@/components/properties/EmptyState';
export { WelcomeSection } from '@/components/properties/WelcomeSection';

// Export hooks
export { 
  useProperty, 
  useListProperties, 
  usePropertiesQuery 
} from '@/hooks/query/usePropertyQuery';

// Types
export type { Property, PropertyStatus } from '@/types/propertyTypes';
