
import { Button } from '@/components/ui/button';
import { AiOutlineArrowLeft, AiOutlineAppstore } from 'react-icons/ai';

interface PropertyFormHeaderProps {
  navigateBack: () => void;
  navigateToFloorplans: () => void;
}

export const PropertyFormHeader = ({ navigateBack, navigateToFloorplans }: PropertyFormHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Button variant="outline" size="sm" onClick={navigateBack}>
        <AiOutlineArrowLeft className="mr-2 h-4 w-4" />
        Back to Properties
      </Button>
      <Button variant="outline" size="sm" onClick={navigateToFloorplans}>
        <AiOutlineAppstore className="mr-2 h-4 w-4" />
        Floor Plan Editor
      </Button>
    </div>
  );
};
