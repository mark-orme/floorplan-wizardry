
import { useState } from 'react';

// Basic UI store implementation
export function useUIStore() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return {
    searchTerm,
    setSearchTerm
  };
}
