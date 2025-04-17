
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Pointer, 
  Pencil, 
  Square, 
  Minus, 
  Undo2, 
  Redo2, 
  Trash, 
  Save, 
  Eraser,
  Ruler,
  AlertCircle
} from 'lucide-react';
import { DrawingMode } from '@/constants/drawingModes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { captureMessage } from '@/utils/sentry';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface ToolbarProps {
  activeTool: DrawingMode;
  lineThickness: number;
  lineColor: string;
  onToolChange: (tool: DrawingMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  onDelete: () => void;
  onLineThicknessChange: (thickness: number) => void;
  onLineColorChange: (color: string) => void;
}

/**
 * Toolbar component for canvas drawing tools
 * @param {ToolbarProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  lineThickness,
  lineColor,
  onToolChange,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onDelete,
  onLineThicknessChange,
  onLineColorChange
}: ToolbarProps): JSX.Element => {
  const { t } = useTranslation();

  // Log when the active tool changes to help debug
  useEffect(() => {
    console.log("Active tool in Toolbar:", activeTool);
    
    // Track tool changes in Sentry
    captureMessage("Drawing tool changed", "tool-change", {
      tags: { component: "Toolbar" },
      extra: { tool: activeTool }
    });
  }, [activeTool]);

  const handleStraightLineClick = () => {
    console.log("Straight line tool clicked, current tool:", activeTool);
    
    // Track attempt to change to straight line tool
    captureMessage("Straight line tool clicked", "straight-line-button-click", {
      tags: { component: "Toolbar" },
      extra: { previousTool: activeTool }
    });
    
    onToolChange(DrawingMode.STRAIGHT_LINE);
  };
  
  // Report issues with straight line tool
  const reportStraightLineIssue = () => {
    captureMessage("User reported straight line tool issue", "user-reported-issue", {
      tags: { component: "Toolbar", critical: "true" },
      extra: { 
        activeTool,
        browserInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          windowDimensions: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      }
    });
    
    toast.success(t('common.reportSent', "Issue reported to developers. Thank you!"));
  };

  return (
    <div className="flex flex-wrap gap-2 bg-white rtl-reverse">
      <div className="flex items-center gap-1 rtl-reverse">
        <Button 
          size="sm" 
          variant={activeTool === DrawingMode.SELECT ? 'default' : 'outline'} 
          onClick={() => onToolChange(DrawingMode.SELECT)}
          title={t('canvas.toolbar.select')}
        >
          <Pointer className="h-4 w-4" />
          <span className="ml-1 rtl-margin-right">{t('canvas.toolbar.select')}</span>
        </Button>
        <Button 
          size="sm" 
          variant={activeTool === DrawingMode.DRAW ? 'default' : 'outline'} 
          onClick={() => onToolChange(DrawingMode.DRAW)}
          title={t('canvas.toolbar.draw')}
        >
          <Pencil className="h-4 w-4" />
          <span className="ml-1 rtl-margin-right">{t('canvas.toolbar.draw')}</span>
        </Button>
        <Button 
          size="sm" 
          variant={activeTool === DrawingMode.STRAIGHT_LINE ? 'default' : 'outline'} 
          onClick={handleStraightLineClick}
          title={t('canvas.toolbar.straightLine')}
          data-test-id="straight-line-button"
          className={activeTool === DrawingMode.STRAIGHT_LINE ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
        >
          <Minus className="h-4 w-4" />
          <span className="ml-1 rtl-margin-right">{t('canvas.toolbar.straightLine')}</span>
        </Button>
        <Button 
          size="sm" 
          variant={activeTool === DrawingMode.WALL ? 'default' : 'outline'} 
          onClick={() => onToolChange(DrawingMode.WALL)}
          title={t('canvas.toolbar.wall')}
        >
          <Ruler className="h-4 w-4" />
          <span className="ml-1 rtl-margin-right">{t('canvas.toolbar.wall')}</span>
        </Button>
        <Button 
          size="sm" 
          variant={activeTool === DrawingMode.ERASER ? 'default' : 'outline'} 
          onClick={() => onToolChange(DrawingMode.ERASER)}
          title={t('canvas.toolbar.eraser')}
        >
          <Eraser className="h-4 w-4" />
          <span className="ml-1 rtl-margin-right">{t('canvas.toolbar.eraser')}</span>
        </Button>
        
        {/* Add a button to report line tool issues */}
        {activeTool === DrawingMode.STRAIGHT_LINE && (
          <Button 
            size="sm" 
            variant="outline" 
            className="ml-2 text-amber-600 border-amber-600 rtl-margin-right"
            onClick={reportStraightLineIssue}
            title={t('common.reportIssue', "Report Issue with Line Tool")}
          >
            <AlertCircle className="h-4 w-4 mr-1 rtl-margin-left" />
            <span className="text-xs">{t('common.reportIssue', "Report Issue")}</span>
          </Button>
        )}
      </div>
      
      <Separator orientation="vertical" className="h-8" />
      
      <div className="flex items-center gap-1 rtl-reverse">
        <Button size="sm" variant="outline" onClick={onUndo} title={t('common.undo', "Undo")}>
          <Undo2 className="h-4 w-4 rtl-mirror" />
        </Button>
        <Button size="sm" variant="outline" onClick={onRedo} title={t('common.redo', "Redo")}>
          <Redo2 className="h-4 w-4 rtl-mirror" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-8" />
      
      <div className="flex items-center gap-1 rtl-reverse">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onDelete} 
          title={t('canvas.toolbar.delete')}
          className="bg-red-50 border-red-200 hover:bg-red-100"
        >
          <Trash className="h-4 w-4 text-red-500" />
          <span className="ml-1 rtl-margin-right text-red-500">{t('canvas.toolbar.delete')}</span>
        </Button>
        <Button size="sm" variant="outline" onClick={onSave} title={t('common.save', "Save Canvas")}>
          <Save className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-8" />
      
      <div className="flex items-center gap-2 rtl-reverse">
        <div className="flex flex-col gap-1">
          <Label htmlFor="line-thickness" className="text-xs">{t('canvas.toolbar.thickness')}</Label>
          <Input
            id="line-thickness"
            type="number"
            min="1"
            max="20"
            value={lineThickness}
            onChange={(e) => onLineThicknessChange(Number(e.target.value))}
            className="w-16 h-8"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <Label htmlFor="line-color" className="text-xs">{t('canvas.toolbar.color')}</Label>
          <Input
            id="line-color"
            type="color"
            value={lineColor}
            onChange={(e) => onLineColorChange(e.target.value)}
            className="w-8 h-8 p-0"
          />
        </div>
      </div>
    </div>
  );
};
