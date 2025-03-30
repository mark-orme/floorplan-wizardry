
/**
 * Core Sentry utility functions
 * @module utils/sentry/core
 */
import * as Sentry from '@sentry/react';

/**
 * Check if Sentry is properly initialized
 * @returns {boolean} Whether Sentry is initialized
 */
export const isSentryInitialized = (): boolean => {
  try {
    return Sentry.getCurrentHub().getClient() !== undefined;
  } catch (e) {
    return false;
  }
};
