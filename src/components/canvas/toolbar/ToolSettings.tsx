
/**
 * Canvas tool settings component
 * @module components/canvas/toolbar/ToolSettings
 */
import React from 'react';
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Underline
} from 'lucide-react';
import { ToolbarGroup } from './ToolbarGroup';
import { ToolbarItem } from './ToolbarItem';

export interface ToolSettingsProps {
  /** Active drawing tool */
  activeTool: string;
  /** Font family */
  fontFamily?: string;
  /** Font size */
  fontSize?: number;
  /** Text alignment */
  textAlign?: 'left' | 'center' | 'right';
  /** Whether text is bold */
  isBold?: boolean;
  /** Whether text is italic */
  isItalic?: boolean;
  /** Whether text is underlined */
  isUnderlined?: boolean;
  /** Font family change handler */
  onFontFamilyChange?: (fontFamily: string) => void;
  /** Font size change handler */
  onFontSizeChange?: (fontSize: number) => void;
  /** Text alignment change handler */
  onTextAlignChange?: (align: 'left' | 'center' | 'right') => void;
  /** Bold toggle handler */
  onBoldToggle?: () => void;
  /** Italic toggle handler */
  onItalicToggle?: () => void;
  /** Underline toggle handler */
  onUnderlineToggle?: () => void;
}

/**
 * Tool settings component for text formatting
 * @param props Component props
 * @returns Rendered component
 */
export const ToolSettings: React.FC<ToolSettingsProps> = ({
  activeTool,
  fontFamily = 'Arial',
  fontSize = 14,
  textAlign = 'left',
  isBold = false,
  isItalic = false,
  isUnderlined = false,
  onFontFamilyChange,
  onFontSizeChange,
  onTextAlignChange,
  onBoldToggle,
  onItalicToggle,
  onUnderlineToggle
}) => {
  // Only show text settings if text tool is active
  if (activeTool !== 'text') return null;
  
  return (
    <ToolbarGroup title="Text Settings">
      {/* Font family selector */}
      <select
        className="p-1 text-xs border rounded"
        value={fontFamily}
        onChange={e => onFontFamilyChange?.(e.target.value)}
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
        <option value="Verdana">Verdana</option>
      </select>
      
      {/* Font size selector */}
      <select
        className="p-1 text-xs border rounded"
        value={fontSize}
        onChange={e => onFontSizeChange?.(Number(e.target.value))}
      >
        {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60].map(size => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      
      {/* Text style buttons */}
      <div className="flex">
        <ToolbarItem
          icon={<Bold size={16} />}
          label="Bold"
          active={isBold}
          onClick={onBoldToggle}
        />
        
        <ToolbarItem
          icon={<Italic size={16} />}
          label="Italic"
          active={isItalic}
          onClick={onItalicToggle}
        />
        
        <ToolbarItem
          icon={<Underline size={16} />}
          label="Underline"
          active={isUnderlined}
          onClick={onUnderlineToggle}
        />
      </div>
      
      {/* Text alignment buttons */}
      <div className="flex">
        <ToolbarItem
          icon={<AlignLeft size={16} />}
          label="Left"
          active={textAlign === 'left'}
          onClick={() => onTextAlignChange?.('left')}
        />
        
        <ToolbarItem
          icon={<AlignCenter size={16} />}
          label="Center"
          active={textAlign === 'center'}
          onClick={() => onTextAlignChange?.('center')}
        />
        
        <ToolbarItem
          icon={<AlignRight size={16} />}
          label="Right"
          active={textAlign === 'right'}
          onClick={() => onTextAlignChange?.('right')}
        />
      </div>
    </ToolbarGroup>
  );
};
