
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
// Remove Next.js import and use normal button behavior
// import { useRouter } from 'next/navigation';

interface FloorPlanActionsProps {
  propertyId?: string;
  floorPlanId?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  canEdit: boolean;
  isLoading?: boolean;
}

export const FloorPlanActions: React.FC<FloorPlanActionsProps> = ({
  propertyId,
  floorPlanId,
  onEdit,
  onDelete,
  onDownload,
  canEdit,
  isLoading = false
}) => {
  // const router = useRouter();

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      // Use location instead of Next.js router
      window.location.href = `/properties/${propertyId}/floor-plans/${floorPlanId}/edit`;
    }
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        onDelete();
      } else {
        toast.success("Floor plan deleted");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error deleting floor plan");
    }
  };

  return (
    <div className="flex gap-2">
      {canEdit && (
        <>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleEdit}
            disabled={isLoading}
          >
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete
          </Button>
        </>
      )}
      <Button 
        variant="secondary" 
        size="sm"
        onClick={onDownload}
        disabled={isLoading}
      >
        Download
      </Button>
    </div>
  );
};
