
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid } from 'lucide-react';

interface PropertyFormHeaderProps {
  navigateBack: () => void;
  navigateToFloorplans: () => void;
}

export const PropertyFormHeader = ({ navigateBack, navigateToFloorplans }: PropertyFormHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Button variant="outline" size="sm" onClick={navigateBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Properties
      </Button>
      <Button variant="outline" size="sm" onClick={navigateToFloorplans}>
        <Grid className="mr-2 h-4 w-4" />
        Floor Plan Editor
      </Button>
    </div>
  );
};
