
/**
 * Sentry core functionality
 * @module utils/sentry/core
 */
import * as Sentry from '@sentry/react';

// Track Sentry initialization state
let sentryInitialized = false;

/**
 * Set Sentry initialization state
 * @param {boolean} state - Whether Sentry is initialized
 */
export function setSentryInitialized(state: boolean): void {
  sentryInitialized = state;
}

/**
 * Check if Sentry is initialized
 * @returns {boolean} Whether Sentry is initialized
 */
export function isSentryInitialized(): boolean {
  return sentryInitialized;
}
