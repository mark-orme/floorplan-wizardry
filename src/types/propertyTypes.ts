
/**
 * Property types definition
 */

import { UserRole } from '@/lib/supabase';

export enum PropertyStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PUBLISHED = 'published'
}

export interface Property {
  id: string;
  order_id?: string;
  client_name?: string;
  address: string;
  branch_name?: string;
  status: PropertyStatus;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
  user_id?: string;
}

/**
 * Function to check if a user can edit a property
 * @param property The property to check
 * @param userRole The user's role
 * @param userId The user's ID
 * @returns Whether the user can edit the property
 */
export const canEditProperty = (
  property: Property, 
  userRole: UserRole, 
  userId: string
): boolean => {
  // Managers can always edit
  if (userRole === UserRole.MANAGER) {
    return true;
  }

  // Photographers can only edit if they are assigned to the property
  if (userRole === UserRole.PHOTOGRAPHER) {
    return property.user_id === userId || !property.user_id;
  }

  // Default - no edit permission
  return false;
};
