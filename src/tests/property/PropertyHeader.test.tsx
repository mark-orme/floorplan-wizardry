
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PropertyHeader } from '@/components/property/PropertyHeader';
import { PropertyStatus } from '@/types/propertyTypes';

// Define property type for the component
interface Property {
  order_id: string;
  status: PropertyStatus;
  address: string;
}

describe('PropertyHeader Component', () => {
  test('renders property details correctly', () => {
    // Given
    const property: Property = {
      order_id: 'ORD-12345',
      status: PropertyStatus.DRAFT,
      address: '123 Test Street, City'
    };
    
    // When
    render(<PropertyHeader property={property} />);
    
    // Then
    expect(screen.getByText('ORD-12345')).toBeInTheDocument();
    expect(screen.getByText('123 Test Street, City')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });
  
  test('renders correct badge for PENDING_REVIEW status', () => {
    // Given
    const property: Property = {
      order_id: 'ORD-12345',
      status: PropertyStatus.PENDING_REVIEW,
      address: '123 Test Street, City'
    };
    
    // When
    render(<PropertyHeader property={property} />);
    
    // Then
    expect(screen.getByText('In Review')).toBeInTheDocument();
  });
  
  test('renders correct badge for COMPLETED status', () => {
    // Given
    const property: Property = {
      order_id: 'ORD-12345',
      status: PropertyStatus.COMPLETED,
      address: '123 Test Street, City'
    };
    
    // When
    render(<PropertyHeader property={property} />);
    
    // Then
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
  
  test('renders correct badge for ARCHIVED status', () => {
    // Given
    const property: Property = {
      order_id: 'ORD-12345',
      status: PropertyStatus.ARCHIVED,
      address: '123 Test Street, City'
    };
    
    // When
    render(<PropertyHeader property={property} />);
    
    // Then
    expect(screen.getByText('Archived')).toBeInTheDocument();
  });
  
  test('displays client name if available', () => {
    // Given
    const property = {
      order_id: 'ORD-12345',
      status: PropertyStatus.DRAFT,
      address: '123 Test Street, City',
      client_name: 'Test Client Ltd'
    };
    
    // When
    render(<PropertyHeader property={property} />);
    
    // Then
    expect(screen.getByText('Test Client Ltd')).toBeInTheDocument();
  });
});
