
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  className?: string;
}

export function ColorPicker({ 
  color, 
  onChange, 
  presetColors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00'],
  className 
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("w-10 h-10 p-1 rounded-md", className)}
          style={{ backgroundColor: color }}
          aria-label="Pick a color"
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-2">
          <div className="flex justify-between">
            <h4 className="text-sm font-medium">Color Picker</h4>
            <div 
              className="w-8 h-8 rounded-md border"
              style={{ backgroundColor: color }}
            />
          </div>
          
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 cursor-pointer"
          />
          
          <div className="grid grid-cols-6 gap-2 mt-2">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                className={`w-8 h-8 rounded-md border ${color === presetColor ? 'ring-2 ring-primary' : ''}`}
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  onChange(presetColor);
                  setOpen(false);
                }}
                aria-label={`Color: ${presetColor}`}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
