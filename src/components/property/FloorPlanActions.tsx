import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface FloorPlanActionsProps {
  floorPlanId: string;
  propertyId: string;
  canEdit: boolean;
  canDelete: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const FloorPlanActions: React.FC<FloorPlanActionsProps> = ({
  floorPlanId,
  propertyId,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
  className
}) => {
  const router = useRouter();
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      router.push(`/properties/${propertyId}/floor-plans/${floorPlanId}/edit`);
    }
  };
  
  const handleDelete = async () => {
    try {
      // Call API to delete floor plan
      const response = await fetch(`/api/properties/${propertyId}/floor-plans/${floorPlanId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete floor plan');
      }
      
      toast.success('Floor plan deleted successfully');
      
      if (onDelete) {
        onDelete();
      } else {
        router.refresh();
      }
    } catch (error) {
      let errorMessage: string;
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else {
        errorMessage = 'An unknown error occurred';
      }
      
      console.error('Error deleting floor plan:', errorMessage);
      toast.error(`Error: ${errorMessage}`);
    }
  };
  
  return (
    <div className={`flex space-x-2 ${className || ''}`}>
      {canEdit && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleEdit}
          aria-label="Edit floor plan"
        >
          Edit
        </Button>
      )}
      
      {canDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="sm"
              aria-label="Delete floor plan"
            >
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                floor plan and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
