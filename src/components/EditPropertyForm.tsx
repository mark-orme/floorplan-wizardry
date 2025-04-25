import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

/**
 * EditPropertyForm component
 */
const EditPropertyForm = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Property</h1>
        <Button variant="outline" asChild>
          <Link to={`/properties/${id}`}>Cancel</Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{'Property Name'}</Label>
              <Input id="name" defaultValue="Sample Property" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">{'Address'}</Label>
              <Input id="address" defaultValue="123 Main St" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">{'Description'}</Label>
              <Textarea 
                id="description" 
                defaultValue="A beautiful property with modern amenities."
                rows={4}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to={`/properties/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditPropertyForm;
