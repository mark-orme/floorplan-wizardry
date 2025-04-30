
/**
 * Property list item interface
 */
export interface PropertyListItem {
  id: string;
  name: string;
  address?: string;
  description?: string;
  status: 'available' | 'sold' | 'pending' | 'reserved' | 'under_construction';
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  created_at: string;
  updated_at: string;
  thumbnail?: string;
  [key: string]: any;
}

/**
 * Property status enum
 */
export enum PropertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  PENDING = 'pending',
  RESERVED = 'reserved',
  UNDER_CONSTRUCTION = 'under_construction'
}
