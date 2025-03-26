
import { FloorPlan } from './floorPlanTypes';
import { UserRole } from '@/lib/supabase';

/**
 * Property status enum
 */
export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  COMPLETED = 'completed'
}

/**
 * Full property interface
 */
export interface Property {
  id: string;
  order_id: string;
  address: string;
  client_name: string;
  branch_name?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: PropertyStatus;
  floor_plans: FloorPlan[];
  assigned_to?: string;
  notes?: string;
}

/**
 * Property list item interface (for list views)
 */
export interface PropertyListItem {
  id: string;
  order_id: string;
  address: string;
  client_name: string;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

/**
 * Check if user can edit a property
 * @param property - The property to check
 * @param userRole - The user's role
 * @param userId - The user's ID
 * @returns Boolean indicating if user can edit the property
 */
export const canEditProperty = (
  property: Property | PropertyListItem, 
  userRole: UserRole | null, 
  userId: string
): boolean => {
  if (!userRole) return false;
  
  // Managers can edit any property
  if (userRole === UserRole.MANAGER) return true;
  
  // Processing managers can only edit properties in review or completed status
  if (userRole === UserRole.PROCESSING_MANAGER) {
    return property.status !== PropertyStatus.DRAFT;
  }
  
  // Photographers can only edit their own drafts
  if (userRole === UserRole.PHOTOGRAPHER) {
    return 'created_by' in property 
      ? property.created_by === userId && property.status === PropertyStatus.DRAFT
      : false;
  }
  
  return false;
};

/**
 * Check if user can view a property
 * @param property - The property to check
 * @param userRole - The user's role
 * @param userId - The user's ID
 * @returns Boolean indicating if user can view the property
 */
export const canViewProperty = (
  property: Property | PropertyListItem, 
  userRole: UserRole | null, 
  userId: string
): boolean => {
  if (!userRole) return false;
  
  // Managers can view any property
  if (userRole === UserRole.MANAGER) return true;
  
  // Processing managers can view properties in review or completed status
  if (userRole === UserRole.PROCESSING_MANAGER) {
    return property.status !== PropertyStatus.DRAFT;
  }
  
  // Photographers can only view their own properties
  if (userRole === UserRole.PHOTOGRAPHER) {
    return 'created_by' in property ? property.created_by === userId : false;
  }
  
  return false;
};
