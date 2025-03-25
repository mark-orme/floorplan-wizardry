
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Grid } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingErrorWrapper } from '@/components/LoadingErrorWrapper';

const PropertyFormSchema = z.object({
  order_id: z.string().min(1, 'Order ID is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  client_name: z.string().min(2, 'Client name is required'),
  branch_name: z.string().optional()
});

type PropertyFormValues = z.infer<typeof PropertyFormSchema>;

const PropertyForm = () => {
  const { createProperty } = usePropertyManagement();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Check authentication after auth loading is complete
    if (!authLoading) {
      if (!user) {
        toast.error('You must be logged in to create a property');
        navigate('/auth', { state: { returnTo: '/properties/new' } });
      } else {
        setIsLoading(false);
      }
    }
  }, [user, authLoading, navigate]);

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

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/properties')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
        <Button variant="outline" size="sm" onClick={() => navigate('/floorplans')}>
          <Grid className="mr-2 h-4 w-4" />
          Floor Plan Editor
        </Button>
      </div>

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
                <FormField
                  control={form.control}
                  name="order_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. ORD-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 123 Main St, City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="client_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branch_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Downtown Office" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate('/properties')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Property'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </LoadingErrorWrapper>
    </div>
  );
};

export default PropertyForm;
