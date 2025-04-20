
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

export const runAccessibilityAudit = async (page: Page, options?: {
  excludeSelectors?: string[];
  includeSelectors?: string[];
}): Promise<AccessibilityViolation[]> => {
  let builder = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);

  if (options?.excludeSelectors) {
    builder = builder.exclude(options.excludeSelectors);
  }

  if (options?.includeSelectors) {
    builder = builder.include(options.includeSelectors);
  }

  const results = await builder.analyze();
  return results.violations;
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
