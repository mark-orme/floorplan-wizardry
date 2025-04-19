
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Layers, User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Toolbar } from './Toolbar';
import { DrawingMode } from '@/constants/drawingModes';
import { useAuth } from '@/contexts/AuthContext';

interface FloorPlanEditorToolbarProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onClear?: () => void;
  onSave?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  children?: React.ReactNode;
}

export const FloorPlanEditorToolbar: React.FC<FloorPlanEditorToolbarProps> = ({
  onUndo,
  onRedo,
  onClear,
  onSave,
  canUndo,
  canRedo,
  children
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col border-b bg-background">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/properties')}
            className="flex items-center gap-2"
          >
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Properties</span>
          </Button>
          {!user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/auth')}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>

      {/* Drawing tools toolbar */}
      <Toolbar
        activeTool={DrawingMode.SELECT}
        lineThickness={2}
        lineColor="#000000"
        onToolChange={() => {}}
        onUndo={onUndo}
        onRedo={onRedo}
        onClear={onClear}
        onSave={onSave}
        onDelete={() => {}}
        onLineThicknessChange={() => {}}
        onLineColorChange={() => {}}
      />
      
      {children}
    </div>
  );
};
