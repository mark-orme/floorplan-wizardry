
import React from 'react';

// Mock components for lucide icons
const createIconComponent = (name: string) => {
  const IconComponent = ({ size = 24, color = "currentColor", ...props }: {
    size?: number;
    color?: string;
    [key: string]: any;
  }) => {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
        {...props}
      >
        <rect x="0" y="0" width="24" height="24" fill="none" stroke="none" />
        <text x="12" y="12" fontSize="8" textAnchor="middle" dominantBaseline="middle" fill={color}>{name}</text>
      </svg>
    );
  };
  
  IconComponent.displayName = name;
  return IconComponent;
};

// Create mock icons for all the icons we need
export const Eye = createIconComponent('Eye');
export const EyeOff = createIconComponent('EyeOff');
export const Lock = createIconComponent('Lock');
export const Unlock = createIconComponent('Unlock');
export const Trash = createIconComponent('Trash');
export const Layers = createIconComponent('Layers');
export const PlusCircle = createIconComponent('PlusCircle');
export const Grid = createIconComponent('Grid');
export const RefreshCw = createIconComponent('RefreshCw');
export const Home = createIconComponent('Home');
export const Bug = createIconComponent('Bug');
export const Calculator = createIconComponent('Calculator');
export const Eraser = createIconComponent('Eraser');
export const Hammer = createIconComponent('Hammer');
export const MousePointer = createIconComponent('MousePointer');
export const Pencil = createIconComponent('Pencil');
export const Ruler = createIconComponent('Ruler');
export const Square = createIconComponent('Square');
export const Type = createIconComponent('Type');
