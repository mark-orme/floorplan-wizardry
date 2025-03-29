
/**
 * Property-related action creators
 * @module store/actions/propertyActions
 */
import { Action } from '../index';

export const setProperties = (properties: any[]): Action => ({
  type: 'property/setProperties',
  payload: properties
});

export const setCurrentProperty = (property: any): Action => ({
  type: 'property/setCurrentProperty',
  payload: property
});

export const setPropertyLoading = (isLoading: boolean): Action => ({
  type: 'property/setLoading',
  payload: isLoading
});

export const setPropertyError = (hasError: boolean, message: string = ''): Action => ({
  type: 'property/setError',
  payload: { hasError, message }
});
