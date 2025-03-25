
import { useNavigate } from 'react-router-dom';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';
import { PropertyHeader } from '@/components/properties/PropertyHeader';
import { PropertySearch } from '@/components/properties/PropertySearch';
import { PropertyList } from '@/components/properties/PropertyList';
import { EmptyState } from '@/components/properties/EmptyState';
import { WelcomeSection } from '@/components/properties/WelcomeSection';
import { usePropertyPage } from '@/hooks/usePropertyPage';

const Properties = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    hasError,
    errorMessage,
    authState,
    propertyState,
    filteredProperties,
    handleRowClick,
    handleAddProperty,
    handleGoToFloorplans,
    handleAddTestData,
    handleRetry
  } = usePropertyPage();

  const renderContent = () => {
    if (!authState.user) {
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
        isAuthenticated={!!authState.user}
        userRole={authState.userRole}
        onAddProperty={handleAddProperty}
        onGoToFloorplans={handleGoToFloorplans}
      />

      {authState.user && (
        <PropertySearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}

      <LoadingErrorWrapper
        isLoading={propertyState.isLoading || (authState.user && authState.loading)}
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
