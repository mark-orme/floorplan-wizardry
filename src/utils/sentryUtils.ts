
import * as Sentry from '@sentry/react';

export interface SentryMessageOptions {
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

export function captureMessage(message: string, options: SentryMessageOptions): void;
export function captureMessage(
  message: string,
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug',
  tags?: Record<string, string>
): void;
export function captureMessage(
  message: string, 
  levelOrOptions: SentryMessageOptions | string = 'info'
): void {
  if (typeof levelOrOptions === 'string') {
    Sentry.captureMessage(message, { level: levelOrOptions as Sentry.SeverityLevel });
  } else {
    const { level = 'info', tags, extra } = levelOrOptions;
    Sentry.captureMessage(message, {
      level: level as Sentry.SeverityLevel,
      tags,
      extra
    });
  }
}

export interface ErrorReportOptions {
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  context?: string;
  component?: string;
}

export function captureError(error: Error | unknown, options?: ErrorReportOptions): void {
  Sentry.withScope((scope) => {
    if (options) {
      if (options.level) {
        scope.setLevel(options.level as Sentry.SeverityLevel);
      }
      if (options.tags) {
        scope.setTags(options.tags);
      }
      if (options.extra) {
        scope.setExtras(options.extra);
      }
      if (options.context) {
        scope.setContext('error_context', { context: options.context });
      }
      if (options.component) {
        scope.setTag('component', options.component);
      }
    }

    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(String(error));
    }
  });
}

export function withErrorMonitoring(component: React.ComponentType<any>, componentName: string): React.ComponentType<any> {
  return Sentry.withErrorBoundary(component, {
    fallback: (props) => {
      return React.createElement('div', {
        className: 'error-boundary p-4 bg-red-50 text-red-700 rounded-md'
      }, [
        React.createElement('h3', { className: 'font-bold' }, `Something went wrong in ${componentName}`),
        React.createElement('p', {}, props.error?.message || 'Unknown error'),
        React.createElement('button', {
          className: 'px-4 py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700',
          onClick: props.resetError
        }, 'Try again')
      ]);
    }
  });
}
