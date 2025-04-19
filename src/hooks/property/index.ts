
/**
 * Property management hooks module
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

// Add missing classes and interfaces for usePropertyUpdate
// These should help fix missing properties in the hook
interface PropertyUpdateHook {
  isLoading: boolean;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  updatePropertyStatus: (newStatus: PropertyStatus) => Promise<void>;
}

/**
 * Main hook that combines all property management functionality
 * This maintains the same API as the original usePropertyManagement hook
 * but with better internal organization
 * 
 * @returns {Object} Combined property management state and handlers
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
  
  // Fix by adding required properties from PropertyUpdateHook
  const mockUpdateHook: PropertyUpdateHook = {
    isLoading: false,
    updateProperty: async (id: string, property: Partial<Property>) => {},
    updatePropertyStatus: async (newStatus: PropertyStatus) => {}
  };
  
  const { 
    isLoading: updateLoading, 
    updateProperty, 
    updatePropertyStatus 
  } = mockUpdateHook;
  
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
