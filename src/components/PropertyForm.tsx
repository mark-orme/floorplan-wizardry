
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';
import { PropertyFormHeader } from '@/components/property/PropertyFormHeader';
import { PropertyFormFields, PropertyFormSchema, PropertyFormValues } from '@/components/property/PropertyFormFields';
import { PropertyFormActions } from '@/components/property/PropertyFormActions';

const PropertyForm = () => {
  const { createProperty } = usePropertyManagement();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [authContextError, setAuthContextError] = useState(false);
  let authData = { user: null, loading: true };
  
  try {
    authData = useAuth();
  } catch (error) {
    console.error('Auth context error in PropertyForm:', error);
    setAuthContextError(true);
  }
  
  const { user, loading: authLoading } = authData;

  useEffect(() => {
    if (authContextError) {
      toast.error('Authentication error. Please try again.');
      navigate('/properties');
      return;
    }
    
    if (!authLoading) {
      if (!user) {
        toast.error('You must be logged in to create a property');
        navigate('/auth', { state: { returnTo: '/properties/new' } });
      } else {
        setIsLoading(false);
      }
    }
  }, [user, authLoading, navigate, authContextError]);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(PropertyFormSchema),
    defaultValues: {
      order_id: '',
      address: '',
      client_name: '',
      branch_name: ''
    }
  });

  const onSubmit = async (values: PropertyFormValues) => {
    if (!user) {
      toast.error('You must be logged in to create a property');
      navigate('/auth', { state: { returnTo: '/properties/new' } });
      return;
    }

    setIsSubmitting(true);
    try {
      const newProperty = await createProperty(
        values.order_id,
        values.address,
        values.client_name,
        values.branch_name || ''
      );

      if (newProperty) {
        toast.success('Property created successfully');
        navigate(`/properties/${newProperty.id}`);
      } else {
        toast.error('Failed to create property');
        setHasError(true);
      }
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Failed to create property');
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    form.reset();
  };

  const navigateBack = () => navigate('/properties');
  const navigateToFloorplans = () => navigate('/floorplans');

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <PropertyFormHeader 
        navigateBack={navigateBack} 
        navigateToFloorplans={navigateToFloorplans} 
      />

      <LoadingErrorWrapper
        isLoading={isLoading || authLoading}
        hasError={hasError}
        errorMessage="Error creating property. Please try again."
        onRetry={handleRetry}
      >
        <Card>
          <CardHeader>
            <CardTitle>Create New Property</CardTitle>
            <CardDescription>
              Enter the property details to create a new floor plan
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <PropertyFormFields form={form} />
              </CardContent>
              
              <PropertyFormActions 
                isSubmitting={isSubmitting} 
                onCancel={navigateBack} 
              />
            </form>
          </Form>
        </Card>
      </LoadingErrorWrapper>
    </div>
  );
};

export default PropertyForm;
