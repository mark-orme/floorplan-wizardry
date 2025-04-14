
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'grid',  // Custom type for grid-related changes
        'canvas' // Custom type for canvas-related changes
      ]
    ],
    'subject-case': [0], // Turn off case checking
    'body-max-line-length': [0], // Allow longer body lines for detailed explanations
  }
};
