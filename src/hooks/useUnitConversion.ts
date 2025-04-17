
import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getMeasurementSystem } from '@/i18n/config';

export type MeasurementUnit = 'metric' | 'imperial';
export type DistanceUnit = 'm' | 'ft';
export type AreaUnit = 'm²' | 'ft²';

// Conversion constants
const METER_TO_FEET = 3.28084;
const SQ_METER_TO_SQ_FEET = 10.7639;

export const useUnitConversion = () => {
  const { t } = useTranslation();
  const [overrideSystem, setOverrideSystem] = useState<MeasurementUnit | null>(null);
  
  // Get current measurement system (from locale or override)
  const measurementSystem = useMemo(() => {
    return overrideSystem || getMeasurementSystem();
  }, [overrideSystem]);
  
  // Get current distance unit
  const distanceUnit = useMemo((): DistanceUnit => {
    return measurementSystem === 'metric' ? 'm' : 'ft';
  }, [measurementSystem]);
  
  // Get current area unit
  const areaUnit = useMemo((): AreaUnit => {
    return measurementSystem === 'metric' ? 'm²' : 'ft²';
  }, [measurementSystem]);
  
  // Format distance based on current unit system
  const formatDistance = useCallback((meters: number): string => {
    if (measurementSystem === 'imperial') {
      const feet = meters * METER_TO_FEET;
      return `${feet.toFixed(2)}${t('canvas.measurement.feet')}`;
    }
    return `${meters.toFixed(2)}${t('canvas.measurement.meters')}`;
  }, [measurementSystem, t]);
  
  // Format area based on current unit system
  const formatArea = useCallback((squareMeters: number): string => {
    if (measurementSystem === 'imperial') {
      const squareFeet = squareMeters * SQ_METER_TO_SQ_FEET;
      return `${squareFeet.toFixed(2)}${t('canvas.measurement.sqFeet')}`;
    }
    return `${squareMeters.toFixed(2)}${t('canvas.measurement.sqMeters')}`;
  }, [measurementSystem, t]);
  
  // Convert meters to current unit
  const convertDistance = useCallback((meters: number): number => {
    if (measurementSystem === 'imperial') {
      return meters * METER_TO_FEET;
    }
    return meters;
  }, [measurementSystem]);
  
  // Convert square meters to current unit
  const convertArea = useCallback((squareMeters: number): number => {
    if (measurementSystem === 'imperial') {
      return squareMeters * SQ_METER_TO_SQ_FEET;
    }
    return squareMeters;
  }, [measurementSystem]);
  
  return {
    measurementSystem,
    setMeasurementSystem: setOverrideSystem,
    distanceUnit,
    areaUnit,
    formatDistance,
    formatArea,
    convertDistance,
    convertArea
  };
};
