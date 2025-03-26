
/**
 * Type definitions for database schema
 * @module databaseTypes
 */
import { DBSchema } from 'idb';
import { FloorPlanStorageModel } from './floorPlanTypes';

/**
 * IndexedDB Schema definition
 * @interface FloorPlanDBSchema
 */
export interface FloorPlanDBSchema extends DBSchema {
  floorPlans: {
    key: string;
    value: {
      id: string;
      data: FloorPlanStorageModel[];
    };
  };
}

/**
 * IndexedDB Constants
 */
export const DB_NAME = 'FloorPlanDB';
export const STORE_NAME = 'floorPlans';
