
import * as Sentry from '@sentry/react';
import { toast } from 'sonner';
import { ErrorSeverity, ErrorContext, ErrorReportingOptions } from '@/types/core/error/errorTypes';
import logger from '@/utils/logger';

export const handleError = (
  error: Error | unknown,
  severity: ErrorSeverity = 'error',
  context: ErrorContext = {}
): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);

  // Log to console and Papertrail in development
  if (process.env.NODE_ENV === 'development') {
    logger.error(errorMessage, { severity, ...context });
  }

  // Show user-friendly toast
  toast.error(errorMessage);

  // Report to Sentry
  Sentry.withScope((scope) => {
    scope.setLevel(severity === 'critical' ? 'fatal' : severity);
    scope.setTags({
      component: context.component || 'unknown',
      operation: context.operation || 'unknown'
    });
    scope.setExtras(context);

    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(errorMessage);
    }
  });
};

export const captureError = (
  error: Error | unknown,
  errorType: string,
  options: ErrorReportingOptions = {}
): void => {
  Sentry.withScope((scope) => {
    if (options.level) {
      scope.setLevel(options.level);
    }
    if (options.tags) {
      scope.setTags(options.tags);
    }
    if (options.extra) {
      scope.setExtras(options.extra);
    }
    if (options.user) {
      scope.setUser(options.user);
    }

    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(String(error));
    }
  });
};
