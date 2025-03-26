
/**
 * Re-exports all property management hooks for a unified API
 * @module property
 */

import { useState } from 'react';
import { Property, PropertyListItem, PropertyStatus } from '@/types/propertyTypes';
import { FloorPlan } from '@/types/floorPlanTypes';
import { usePropertyBase } from './usePropertyBase';
import { usePropertyCreate } from './usePropertyCreate';
import { usePropertyQuery } from './usePropertyQuery';
import { usePropertyUpdate } from './usePropertyUpdate';
import { usePropertyFloorPlan } from './usePropertyFloorPlan';

/**
 * Main hook that combines all property management functionality
 * This maintains the same API as the original usePropertyManagement hook
 * but with better internal organization
 */
export const usePropertyManagement = () => {
  // Initialize all the specialized hooks - always at the top level
  const { isLoading: createLoading, createProperty } = usePropertyCreate();
  const { 
    properties, 
    currentProperty, 
    isLoading: queryLoading, 
    listProperties, 
    getProperty 
  } = usePropertyQuery();
  const { 
    isLoading: updateLoading, 
    updateProperty, 
    updatePropertyStatus 
  } = usePropertyUpdate();
  const { saveFloorPlans } = usePropertyFloorPlan();
  
  // Combine loading states
  const isLoading = createLoading || queryLoading || updateLoading;
  
  // Return the same API as the original hook
  return {
    properties,
    currentProperty,
    isLoading,
    createProperty,
    listProperties,
    getProperty,
    updateProperty,
    updatePropertyStatus,
    saveFloorPlans
  };
};

// Export individual hooks for more granular usage
export {
  usePropertyBase,
  usePropertyCreate,
  usePropertyQuery,
  usePropertyUpdate,
  usePropertyFloorPlan
};
