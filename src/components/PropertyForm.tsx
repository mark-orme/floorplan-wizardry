
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { usePropertyCreate } from '@/hooks/property/usePropertyCreate';
import { captureError } from '@/utils/sentryUtils';
import { validateAndSanitizeForm, appSchemas, trackValidationFailure } from '@/utils/validation/inputValidation';
import { Security } from '@/utils/security';

const PropertyForm = () => {
  const { createProperty } = usePropertyCreate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();
  
  const [authContextError, setAuthContextError] = useState(false);
  let authData = { user: null, loading: true };
  
  try {
    authData = useAuth();
  } catch (error) {
    console.error('Auth context error in PropertyForm:', error);
    setAuthContextError(true);
    captureError(error, 'property-form-auth-context-error', {
      context: {
        component: 'PropertyForm',
        operation: 'initialization'
      }
    });
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

    // Sanitize and validate input data
    const validationResult = validateAndSanitizeForm(
      values, 
      appSchemas.property.create
    );

    if (!validationResult.valid) {
      // Track validation failure
      if (user) {
        trackValidationFailure(user.id, validationResult, {
          component: 'PropertyForm',
          operation: 'create-property',
          route: '/properties/new'
        });
      }

      // Show toast with validation errors
      toast.error(validationResult.message || 'Please check the form for errors');
      
      // Update form errors
      if (validationResult.fields) {
        Object.entries(validationResult.fields).forEach(([field, errors]) => {
          if (errors.length > 0) {
            form.setError(field as any, { 
              type: 'manual', 
              message: errors[0] 
            });
          }
        });
      }
      
      return;
    }

    // Apply input sanitization for extra security
    const sanitizedData = {
      order_id: Security.Input.sanitizeHtml(values.order_id),
      address: Security.Input.sanitizeHtml(values.address),
      client_name: Security.Input.sanitizeHtml(values.client_name),
      branch_name: values.branch_name ? Security.Input.sanitizeHtml(values.branch_name) : undefined
    };

    setIsSubmitting(true);
    try {
      // Make sure all required fields are present and not undefined
      const propertyData = {
        order_id: sanitizedData.order_id,
        address: sanitizedData.address,
        client_name: sanitizedData.client_name,
        branch_name: sanitizedData.branch_name
      };
      
      const newProperty = await createProperty(propertyData);

      if (newProperty) {
        toast.success('Property created successfully');
        navigate(`/properties/${newProperty.id}`);
      } else {
        toast.error('Failed to create property');
        setHasError(true);
      }
    } catch (error) {
      captureError(error, 'property-create-error', {
        context: {
          component: 'PropertyForm',
          operation: 'create-property',
          route: '/properties/new'
        },
        extra: {
          formValues: JSON.stringify(values)
        }
      });
      
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
