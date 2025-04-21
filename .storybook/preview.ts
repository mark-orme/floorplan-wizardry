
import type { Preview } from "@storybook/react";
import { withA11y } from '@storybook/addon-a11y';
import { initialize, mswLoader } from 'msw-storybook-addon';
import '../src/index.css'; // Import your global CSS

// Initialize MSW
initialize({
  onUnhandledRequest: 'bypass',
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            reviewOnFail: true
          },
          {
            id: 'heading-order',
            reviewOnFail: true
          }
        ]
      },
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
        }
      },
      manual: true
    },
    layout: 'fullscreen',
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
      },
      defaultViewport: 'desktop',
    },
  },
  decorators: [withA11y],
  loaders: [mswLoader],
};

export default preview;
