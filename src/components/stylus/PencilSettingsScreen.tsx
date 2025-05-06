
import React, { useState, useCallback } from 'react';

interface PencilSettingsScreenProps {
  minPressure: number;
  maxPressure: number;
  color: string;
  width: number;
  setMinPressure: (value: number) => void;
  setMaxPressure: (value: number) => void;
  setColor: (color: string) => void;
  setWidth: (width: number) => void;
}

export const PencilSettingsScreen: React.FC<PencilSettingsScreenProps> = ({
  minPressure,
  maxPressure,
  color,
  width,
  setMinPressure,
  setMaxPressure,
  setColor,
  setWidth
}) => {
  const handleMinPressureChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMinPressure(isNaN(value) ? 0 : value);
  }, [setMinPressure]);
  
  const handleMaxPressureChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setMaxPressure(isNaN(value) ? 100 : value);
  }, [setMaxPressure]);
  
  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  }, [setColor]);
  
  const handleWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setWidth(isNaN(value) ? 1 : value);
  }, [setWidth]);
  
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Pencil Settings</h2>
      
      <div className="mb-2">
        <label htmlFor="minPressure" className="block text-sm font-medium text-gray-700">
          Min Pressure
        </label>
        <input
          type="number"
          id="minPressure"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={minPressure}
          onChange={handleMinPressureChange}
        />
      </div>
      
      <div className="mb-2">
        <label htmlFor="maxPressure" className="block text-sm font-medium text-gray-700">
          Max Pressure
        </label>
        <input
          type="number"
          id="maxPressure"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={maxPressure}
          onChange={handleMaxPressureChange}
        />
      </div>
      
      <div className="mb-2">
        <label htmlFor="color" className="block text-sm font-medium text-gray-700">
          Color
        </label>
        <input
          type="color"
          id="color"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={color}
          onChange={handleColorChange}
        />
      </div>
      
      <div className="mb-2">
        <label htmlFor="width" className="block text-sm font-medium text-gray-700">
          Width
        </label>
        <input
          type="number"
          id="width"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={width}
          onChange={handleWidthChange}
        />
      </div>
    </div>
  );
};

// Add this empty component to avoid issues with imports
export const PencilCalibrationDialog: React.FC = () => {
  return <div>Pencil Calibration Dialog</div>;
};
