
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { captureMessage, captureError } from "@/utils/sentry";

interface CollaborationToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  isMobile?: boolean;
}

export const CollaborationToggle = ({ enabled, onToggle, isMobile }: CollaborationToggleProps) => {
  const handleCollaborationToggle = (enabled: boolean) => {
    try {
      onToggle(enabled);
      toast.info(enabled ? 'Real-time collaboration enabled' : 'Real-time collaboration disabled');
      captureMessage(`Collaboration ${enabled ? 'enabled' : 'disabled'}`, 'collaboration-toggle');
    } catch (error) {
      captureError(error, 'collaboration-toggle-error');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="collaboration-mode"
        checked={enabled}
        onCheckedChange={handleCollaborationToggle}
      />
      <Label htmlFor="collaboration-mode" className={isMobile ? "text-sm" : ""}>
        Real-time Collaboration
      </Label>
    </div>
  );
};
