import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiOutlineEye, AiOutlineSend } from 'react-icons/ai';
import { PropertyStatus } from "@/types/propertyTypes";
import { handleError } from "@/utils/errorHandling";
import { toast } from "sonner";

interface FloorPlanActionsProps {
  /** Whether the current user can edit the property */
  canEdit: boolean;
  /** The role of the current user */
  userRole: string;
  /** Whether a status change submission is in progress */
  isSubmitting: boolean;
  /** Handler for property status changes */
  onStatusChange: (status: PropertyStatus) => Promise<void>;
}

export const FloorPlanActions = ({
  canEdit,
  userRole,
  isSubmitting,
  onStatusChange
}: FloorPlanActionsProps) => {
  /**
   * Handle status change with error handling
   * @param {PropertyStatus} newStatus - The new status to set
   */
  const handleStatusChange = async (newStatus: PropertyStatus) => {
    try {
      await onStatusChange(newStatus);
      toast.success("Status updated successfully");
    } catch (error) {
      handleError(error, 'error', {
        component: 'FloorPlanActions',
        operation: 'status-change',
        context: { newStatus }
      });
    }
  };
  
  return (
    <div className="flex items-center justify-between w-full">
      <div>
        {!canEdit && (
          <Badge variant="outline">
            <AiOutlineEye className="h-3 w-3 mr-1" />
            View Only
          </Badge>
        )}
      </div>
      {(userRole === 'MANAGER' || userRole === 'PHOTOGRAPHER') && (
        <Button 
          disabled={isSubmitting} 
          variant="default" 
          onClick={() => handleStatusChange(PropertyStatus.PENDING_REVIEW)}
        >
          <AiOutlineSend className="h-4 w-4 mr-2" />
          Submit for Review
        </Button>
      )}
    </div>
  );
};
