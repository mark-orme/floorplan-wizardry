
import React, { useEffect, useState } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { 
  Pencil, 
  MousePointer, 
  Square, 
  ArrowRight, 
  Hand, 
  Type, 
  Eraser, 
  Ruler
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ToolVisualizerProps {
  tool: DrawingMode;
  isApplePencil?: boolean;
}

export const ToolVisualizer: React.FC<ToolVisualizerProps> = ({ 
  tool,
  isApplePencil = false
}) => {
  const { t } = useTranslation();
  const [hint, setHint] = useState<string>('');
  const [showHint, setShowHint] = useState(false);
  
  // Set contextual hint based on current tool
  useEffect(() => {
    let newHint = '';
    
    switch (tool) {
      case DrawingMode.SELECT:
        newHint = t('canvas.tooltips.select');
        break;
      case DrawingMode.DRAW:
        newHint = isApplePencil ? 
          t('canvas.tooltips.draw_pencil', 'Draw with pressure sensitivity. Press harder for thicker lines.') : 
          t('canvas.tooltips.draw');
        break;
      case DrawingMode.STRAIGHT_LINE:
        newHint = t('canvas.tooltips.straightLine');
        break;
      case DrawingMode.WALL:
        newHint = t('canvas.tooltips.wall');
        break;
      case DrawingMode.ROOM:
        newHint = t('canvas.tooltips.room', 'Click and drag to create a room.');
        break;
      case DrawingMode.ERASER:
        newHint = t('canvas.tooltips.eraser');
        break;
      case DrawingMode.TEXT:
        newHint = t('canvas.tooltips.text', 'Click to add text, type to edit.');
        break;
      case DrawingMode.HAND:
        newHint = t('canvas.tooltips.hand', 'Click and drag to pan the canvas.');
        break;
      case DrawingMode.MEASURE:
        newHint = t('canvas.tooltips.measure', 'Click and drag to measure distance.');
        break;
      default:
        newHint = t('toolVisualizer.defaultHint');
    }
    
    setHint(newHint);
    
    // Show hint for 5 seconds when tool changes
    setShowHint(true);
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [tool, isApplePencil, t]);
  
  // Get the appropriate icon for the current tool
  const getToolIcon = () => {
    switch (tool) {
      case DrawingMode.SELECT:
        return <MousePointer className="h-5 w-5" />;
      case DrawingMode.DRAW:
        return <Pencil className="h-5 w-5" />;
      case DrawingMode.STRAIGHT_LINE:
      case DrawingMode.WALL:
        return <ArrowRight className="h-5 w-5" />;
      case DrawingMode.ROOM:
        return <Square className="h-5 w-5" />;
      case DrawingMode.ERASER:
        return <Eraser className="h-5 w-5" />;
      case DrawingMode.TEXT:
        return <Type className="h-5 w-5" />;
      case DrawingMode.HAND:
        return <Hand className="h-5 w-5" />;
      case DrawingMode.MEASURE:
        return <Ruler className="h-5 w-5" />;
      default:
        return <MousePointer className="h-5 w-5" />;
    }
  };
  
  return (
    <>
      {/* Persistent tool indicator */}
      <div className="fixed top-16 left-4 flex items-center gap-2 bg-white/90 text-black px-3 py-2 rounded-lg shadow-md">
        {getToolIcon()}
        <span className="font-medium">
          {tool.charAt(0).toUpperCase() + tool.slice(1).toLowerCase()}
        </span>
      </div>
      
      {/* Contextual hint */}
      {showHint && (
        <div className="fixed top-28 left-4 max-w-sm bg-black/80 text-white px-4 py-2 rounded-lg shadow-md animate-fade-in">
          {hint}
        </div>
      )}
      
      {/* Keyboard shortcuts reminder */}
      <div className="fixed bottom-16 left-4 bg-white/80 text-xs text-gray-600 px-2 py-1 rounded-md">
        <div className="flex flex-col gap-1">
          <div>⌘Z / Ctrl+Z: {t('common.undo', 'Undo')}</div>
          <div>⌘⇧Z / Ctrl+Shift+Z: {t('common.redo', 'Redo')}</div>
          <div>Delete / Backspace: {t('common.remove', 'Remove')}</div>
          <div>Esc: {t('common.deselect', 'Deselect')}</div>
        </div>
      </div>
    </>
  );
};
