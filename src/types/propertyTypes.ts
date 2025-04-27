
export enum PropertyStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PENDING_REVIEW = 'PENDING_REVIEW',
  IN_REVIEW = 'IN_REVIEW',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export interface PropertyListItem {
  id: string;
  order_id: string;
  client_name: string;
  address: string;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
}

export interface Property extends PropertyListItem {
  branch_name?: string;
  notes?: string;
  measurements?: PropertyMeasurements;
  assignedTo?: string;
  metadata?: Record<string, any>;
}

export interface PropertyMeasurements {
  totalArea?: number;
  rooms?: Room[];
}

export interface Room {
  id: string;
  name: string;
  area: number;
  dimensions: {
    width: number;
    length: number;
  };
}

export function canEditProperty(userRole: string, propertyStatus: PropertyStatus): boolean {
  if (userRole === 'ADMIN') return true;
  
  if (userRole === 'MANAGER') {
    return propertyStatus !== PropertyStatus.COMPLETED;
  }
  
  if (userRole === 'PHOTOGRAPHER') {
    return propertyStatus === PropertyStatus.DRAFT || propertyStatus === PropertyStatus.PENDING;
  }
  
  return false;
}
