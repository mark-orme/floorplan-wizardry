
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';
import { PropertyHeader } from '@/components/properties/PropertyHeader';
import { PropertySearch } from '@/components/properties/PropertySearch';
import { PropertyList } from '@/components/properties/PropertyList';
import { EmptyState } from '@/components/properties/EmptyState';
import { WelcomeSection } from '@/components/properties/WelcomeSection';
import { useAuth } from '@/contexts/AuthContext';
import { usePropertyStore } from '@/store/hooks/usePropertyStore';
import { useUIStore } from '@/store/hooks/useUIStore';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';

const Properties = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  
  // Get state from our new store
  const { 
    properties, 
    isLoading: propertiesLoading, 
    hasError, 
    errorMessage, 
    setProperties, 
    setLoading, 
    setError 
  } = usePropertyStore();
  
  const { searchTerm, setSearchTerm } = useUIStore();
  
  // We still use the original hooks but will migrate their functionality gradually
  const { listProperties, getProperty } = usePropertyManagement();

  // Load properties when component mounts
  useEffect(() => {
    const loadProperties = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const propertyList = await listProperties();
        setProperties(propertyList || []);
        setError(false, '');
      } catch (error) {
        console.error("Error loading properties:", error);
        setError(true, "Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    
    if (user && !hasError) {
      loadProperties();
    }
  }, [user, hasError, listProperties, setProperties, setLoading, setError]);

  // Filter properties based on search term
  const filteredProperties = (properties || []).filter(prop => {
    if (!prop) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      prop.order_id?.toLowerCase().includes(searchLower) ||
      prop.address?.toLowerCase().includes(searchLower) ||
      prop.client_name?.toLowerCase().includes(searchLower)
    );
  });

  // Handler functions
  const handleRetry = async () => {
    setError(false, '');
    if (user) {
      setLoading(true);
      try {
        const propertyList = await listProperties();
        setProperties(propertyList || []);
      } catch (error) {
        console.error("Error retrying property load:", error);
        setError(true, "Failed to reload properties");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRowClick = (id: string) => {
    navigate(`/properties/${id}`);
  };

  const handleAddProperty = () => {
    navigate('/properties/new');
  };

  const handleGoToFloorplans = () => {
    navigate('/floorplans');
  };

  const handleAddTestData = async () => {
    // Implementation would go here
    console.log("Adding test data");
  };

  const renderContent = () => {
    if (!user) {
      return (
        <WelcomeSection 
          onSignIn={() => navigate('/auth')} 
          onGoToFloorplans={handleGoToFloorplans} 
        />
      );
    }

    if (filteredProperties.length === 0) {
      return (
        <EmptyState 
          searchTerm={searchTerm}
          onAddProperty={handleAddProperty}
          onAddTestData={handleAddTestData}
          onGoToFloorplans={handleGoToFloorplans}
        />
      );
    }

    return (
      <PropertyList 
        properties={filteredProperties} 
        onRowClick={handleRowClick} 
      />
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <PropertyHeader 
        isAuthenticated={!!user}
        userRole={userRole}
        onAddProperty={handleAddProperty}
        onGoToFloorplans={handleGoToFloorplans}
      />

      {user && (
        <PropertySearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}

      <LoadingErrorWrapper
        isLoading={propertiesLoading || (user && !user.id)}
        hasError={hasError}
        errorMessage={errorMessage}
        onRetry={handleRetry}
      >
        {renderContent()}
      </LoadingErrorWrapper>
    </div>
  );
};

export default Properties;
