
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: [
    "../src/stories/**/*.mdx",
    "../src/stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-themes"
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  core: {
    disableTelemetry: true,
  },
  // Add accessibility features
  a11y: {
    // Enable accessibility checks in all stories by default
    enabled: true,
    // Fail on any accessibility violations
    config: {
      rules: [
        {
          // Critical rules should cause immediate failures
          id: 'critical',
          reviewOnFail: true,
        },
      ],
    },
  },
};

export default config;
