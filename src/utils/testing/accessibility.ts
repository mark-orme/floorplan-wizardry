import { Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';

export interface AccessibilityViolation {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    failureSummary: string;
  }>;
}

export interface AccessibilityAuditOptions {
  excludeSelectors?: string[];
  includeSelectors?: string[];
  tags?: string[];
  rules?: {
    [key: string]: {
      enabled: boolean;
      level?: 'error' | 'warning';
    };
  };
}

export const runAccessibilityAudit = async (page: Page, options?: AccessibilityAuditOptions): Promise<AccessibilityViolation[]> => {
  let builder = new AxeBuilder({ page });

  // Set default WCAG tags if none provided
  builder = builder.withTags(
    options?.tags || ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
  );

  // Configure rules if provided
  if (options?.rules) {
    Object.entries(options.rules).forEach(([ruleId, config]) => {
      builder = builder.configure({
        rules: [{
          id: ruleId,
          enabled: config.enabled,
          level: config.level || 'error'
        }]
      });
    });
  }

  // Apply selector filters
  if (options?.excludeSelectors) {
    builder = builder.exclude(options.excludeSelectors);
  }

  if (options?.includeSelectors) {
    builder = builder.include(options.includeSelectors);
  }

  const results = await builder.analyze();
  return results.violations;
};

export const generateA11yReport = (violations: AccessibilityViolation[]) => {
  return violations.map(violation => ({
    id: violation.id,
    impact: violation.impact,
    description: violation.description,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.map(node => ({
      html: node.html,
      failureSummary: node.failureSummary
    }))
  }));
};

export const saveViolationsReport = (violations: AccessibilityViolation[], reportPath: string) => {
  const reportDir = path.dirname(reportPath);
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  fs.writeFileSync(
    reportPath,
    JSON.stringify(violations, null, 2)
  );
};
