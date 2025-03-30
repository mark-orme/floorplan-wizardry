
/**
 * Floor Plan Actions component
 * Displays action buttons and controls for the floor plan
 */
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Send } from "lucide-react";
import { UserRole } from "@/lib/supabase";
import { PropertyStatus } from "@/types/propertyTypes";
import { handleError } from "@/utils/errorHandling";
import { toast } from "sonner";

interface FloorPlanActionsProps {
  /** Whether the current user can edit the property */
  canEdit: boolean;
  /** The role of the current user */
  userRole: UserRole;
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
      handleError(error, {
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
            <Eye className="h-3 w-3 mr-1" />
            View Only
          </Badge>
        )}
      </div>
      {(userRole === UserRole.MANAGER || userRole === UserRole.PHOTOGRAPHER) && (
        <Button 
          disabled={isSubmitting} 
          variant="default" 
          onClick={() => handleStatusChange(PropertyStatus.PENDING_REVIEW)}
        >
          <Send className="h-4 w-4 mr-2" />
          Submit for Review
        </Button>
      )}
    </div>
  );
};
