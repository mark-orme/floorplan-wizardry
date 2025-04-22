
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WelcomeSection } from '@/components/properties/WelcomeSection';
import { PropertyHeader } from '@/components/properties/PropertyHeader';
import { EmptyState } from '@/components/properties/EmptyState';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = false;
  const userRole = null;
  
  // Handle sign in
  const handleSignIn = () => {
    console.log('Sign in clicked');
  };
  
  // Handle add property
  const handleAddProperty = () => {
    console.log('Add property clicked');
  };
  
  // Handle go to floor plans
  const handleGoToFloorplans = () => {
    navigate('/floorplans');
  };
  
  // Handle add test data
  const handleAddTestData = () => {
    console.log('Add test data clicked');
  };
  
  return (
    <div className="container mx-auto p-4">
      <PropertyHeader 
        isAuthenticated={isAuthenticated} 
        userRole={userRole} 
        onAddProperty={handleAddProperty} 
        onGoToFloorplans={handleGoToFloorplans} 
      />
      
      {!isAuthenticated ? (
        <WelcomeSection 
          onSignIn={handleSignIn} 
          onGoToFloorplans={handleGoToFloorplans} 
        />
      ) : (
        <EmptyState 
          searchTerm="" 
          onAddProperty={handleAddProperty} 
          onAddTestData={handleAddTestData} 
          onGoToFloorplans={handleGoToFloorplans} 
        />
      )}
    </div>
  );
};

export default Index;
