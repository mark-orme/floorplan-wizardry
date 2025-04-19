
import { PropertyStatus } from '@/lib/supabase';

/**
 * Property data interface
 */
export interface Property {
  id: string;
  name: string;
  address: string;
  description?: string;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  assignedTo?: string;
}

/**
 * Property form data interface
 */
export interface PropertyFormData {
  name: string;
  address: string;
  description?: string;
  status?: PropertyStatus;
}
