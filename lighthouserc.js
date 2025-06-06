
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8080/'],
      startServerCommand: 'npm run preview',
      numberOfRuns: 3,
      settings: {
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        skipAudits: ['uses-http2'],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'aria-required-attr': ['error', { minScore: 1 }],
        'aria-roles': ['error', { minScore: 1 }],
        'color-contrast': ['error', { minScore: 1 }],
        'document-title': ['error', { minScore: 1 }],
        'html-has-lang': ['error', { minScore: 1 }],
        'form-field-multiple-labels': ['error', { minScore: 1 }],
        'label': ['error', { minScore: 1 }],
        'link-name': ['error', { minScore: 1 }],
        'heading-order': ['error', { minScore: 1 }],
        'meta-viewport': ['error', { minScore: 1 }],
        'duplicate-id-active': ['error', { minScore: 1 }],
        'duplicate-id-aria': ['error', { minScore: 1 }],
        'button-name': ['error', { minScore: 1 }],
        'focus-traps': ['error', { minScore: 1 }],
        'focusable-controls': ['error', { minScore: 1 }],
        'interactive-element-affordance': ['error', { minScore: 1 }],
        'logical-tab-order': ['error', { minScore: 1 }],
        'managed-focus': ['error', { minScore: 1 }],
        'offscreen-content-hidden': ['error', { minScore: 1 }],
        'use-landmarks': ['warn', { minScore: 1 }],
      },
    },
  },
};
