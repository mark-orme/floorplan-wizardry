
/**
 * Property feature exports
 * @module features/property
 */

// Re-export components
export { PropertyList } from './components/PropertyList';
export { PropertyHeader } from './components/PropertyHeader';
export { PropertySearch } from './components/PropertySearch';
export { PropertyDetailsTab } from './components/PropertyDetailsTab';
export { PropertyFloorPlanTab } from './components/PropertyFloorPlanTab';
export { EmptyState } from './components/EmptyState';
export { WelcomeSection } from './components/WelcomeSection';

// Re-export hooks
export { usePropertyQuery } from './hooks/usePropertyQuery';
export { usePropertyManagement } from './hooks/usePropertyManagement';
export { propertyKeys } from './hooks/usePropertyQuery';

// Re-export types
export { PropertyStatus, canEditProperty } from './types';
export type { Property, PropertyListItem } from './types';
