
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
