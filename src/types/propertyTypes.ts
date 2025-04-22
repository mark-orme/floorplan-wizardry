
/**
 * Property related type definitions
 */

import { UserRole, PropertyStatus as SupabasePropertyStatus } from '@/lib/supabase';

// Re-export PropertyStatus to ensure consistency
export { PropertyStatus } from '@/lib/supabase';

// Property list item interface
export interface PropertyListItem {
  id: string;
  order_id?: string;
  orderId?: string;
  address: string;
  client_name?: string;
  clientName?: string;
  status: SupabasePropertyStatus;
  updated_at?: string;
  updatedAt?: string;
}

// Property detail interface
export interface Property extends PropertyListItem {
  description?: string;
  notes?: string;
  assignedUser?: string;
  assigned_user?: string;
  createdAt?: string;
  created_at?: string;
}

// Floorplan interface for property details
export interface PropertyFloorPlan {
  id: string;
  propertyId: string;
  name: string;
  level: number;
  data: any;
  createdAt?: string;
  updatedAt?: string;
}

// Optional access check function interface
export interface AccessCheck {
  canEdit: boolean;
  canApprove: boolean;
  canDelete: boolean;
}

// Helper to standardize property object with both camelCase and snake_case props
export const normalizeProperty = (property: any): Property => {
  return {
    id: property.id,
    order_id: property.order_id || property.orderId,
    orderId: property.orderId || property.order_id,
    address: property.address,
    client_name: property.client_name || property.clientName,
    clientName: property.clientName || property.client_name,
    status: property.status,
    updated_at: property.updated_at || property.updatedAt,
    updatedAt: property.updatedAt || property.updated_at,
    description: property.description,
    notes: property.notes,
    assignedUser: property.assignedUser || property.assigned_user,
    assigned_user: property.assigned_user || property.assignedUser,
    createdAt: property.createdAt || property.created_at,
    created_at: property.created_at || property.createdAt
  };
};
