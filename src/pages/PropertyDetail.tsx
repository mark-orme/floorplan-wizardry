
import React from 'react';
import { useParams } from 'react-router-dom';
import { FloorPlanEditor } from '@/components/FloorPlanEditor';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Detail: {id}</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-4">
        <FloorPlanEditor />
      </div>
    </div>
  );
};

export default PropertyDetail;
