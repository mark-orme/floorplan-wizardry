
import { useState, useEffect } from 'react';

interface PropertyPageData {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  location: string;
}

export const usePropertyPageData = (propertyId: string) => {
  const [data, setData] = useState<PropertyPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setData({
        id: propertyId,
        title: 'Sample Property',
        description: 'A beautiful property',
        images: [],
        price: 250000,
        location: 'Sample Location'
      });
      setLoading(false);
    }, 1000);
  }, [propertyId]);
  
  return { data, loading, error };
};

// Export the correct hook name
export const usePropertyPage = usePropertyPageData;
