
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { LINE_COLORS } from "@/constants/colorConstants";

/**
 * Line settings constants
 * @constant {Object}
 */
const LINE_SETTINGS = {
  /**
   * Minimum line thickness in pixels
   * @constant {number}
   */
  MIN_THICKNESS: 1,
  
  /**
   * Maximum line thickness in pixels
   * @constant {number}
   */
  MAX_THICKNESS: 10,
  
  /**
   * Line thickness step size
   * @constant {number}
   */
  THICKNESS_STEP: 1,
  
  /**
   * Default CSS class for slider width
   * @constant {string}
   */
  SLIDER_WIDTH_CLASS: "w-28",
  
  /**
   * Default CSS class for color picker
   * @constant {string}
   */
  COLOR_PICKER_CLASS: "w-8 h-8 p-1 border rounded cursor-pointer",
  
  /**
   * Container background CSS class
   * @constant {string}
   */
  CONTAINER_CLASS: "flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-2 rounded border",
  
  /**
   * Group wrapper CSS class
   * @constant {string}
   */
  GROUP_CLASS: "flex flex-col gap-1",
  
  /**
   * Label CSS class
   * @constant {string}
   */
  LABEL_CLASS: "text-xs font-medium"
};

export interface LineSettingsProps {
  thickness: number;
  color: string;
  onThicknessChange: (thickness: number) => void;
  onColorChange: (color: string) => void;
}

/**
 * Component for adjusting line thickness and color in the drawing toolbar
 */
export const LineSettings = ({
  thickness,
  color,
  onThicknessChange,
  onColorChange
}: LineSettingsProps) => {
  return (
    <div className={LINE_SETTINGS.CONTAINER_CLASS}>
      <div className={LINE_SETTINGS.GROUP_CLASS}>
        <Label htmlFor="thickness" className={LINE_SETTINGS.LABEL_CLASS}>Thickness: {thickness}px</Label>
        <Slider
          id="thickness"
          min={LINE_SETTINGS.MIN_THICKNESS}
          max={LINE_SETTINGS.MAX_THICKNESS}
          step={LINE_SETTINGS.THICKNESS_STEP}
          value={[thickness]}
          onValueChange={(values) => onThicknessChange(values[0])}
          className={LINE_SETTINGS.SLIDER_WIDTH_CLASS}
        />
      </div>
      
      <div className={LINE_SETTINGS.GROUP_CLASS}>
        <Label htmlFor="color" className={LINE_SETTINGS.LABEL_CLASS}>Color</Label>
        <input
          id="color"
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className={LINE_SETTINGS.COLOR_PICKER_CLASS}
        />
      </div>
    </div>
  );
};
