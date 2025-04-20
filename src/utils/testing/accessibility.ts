
import { Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

export const runAccessibilityAudit = async (page: Page, options = {}) => {
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  return accessibilityScanResults.violations;
};
