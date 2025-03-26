
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface PropertyFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export const PropertyFormActions = ({ isSubmitting, onCancel }: PropertyFormActionsProps) => {
  return (
    <CardFooter className="flex justify-between">
      <Button 
        variant="outline" 
        type="button"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Property'}
      </Button>
    </CardFooter>
  );
};
