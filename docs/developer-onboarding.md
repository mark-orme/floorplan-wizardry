
# FloorPlan Designer Developer Onboarding

Welcome to the FloorPlan Designer project! This guide will help you get set up and productive quickly.

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd floorplan-designer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test             # Run all tests
   npm test -- -w       # Watch mode
   npm test -- -t "tool" # Run tests matching "tool"
   ```

## 📋 Recommended VS Code Setup

### Extensions

For the best development experience, we recommend installing these VS Code extensions:

- **ESLint** (`dbaeumer.vscode-eslint`) - Integrates ESLint into VS Code
- **Prettier** (`esbenp.prettier-vscode`) - Code formatter
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) - Autocomplete for Tailwind
- **Error Lens** (`usernamehw.errorlens`) - Inline error display
- **Jest Runner** (`firsttris.vscode-jest-runner`) - Run tests directly from editor
- **SVG Viewer** (`cssho.vscode-svgviewer`) - Preview SVG files
- **Import Cost** (`wix.vscode-import-cost`) - Display import sizes
- **GitHub Copilot** (`github.copilot`) - AI pair programming

### Workspace Settings

Create a `.vscode/settings.json` file with these recommended settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "typescript", "typescriptreact"],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

## 🧪 Test Commands

Our project uses Vitest for testing. Here are some useful commands:

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Run tests in a specific file
npm test -- src/hooks/__tests__/useDrawingTool.test.ts

# Run tests with a specific name
npm test -- -t "should validate drawing tool"

# Update snapshots
npm test -- -u

# Show test coverage
npm test -- --coverage
```

## 🔧 Debugging

### Console Debugging

We use a custom logger utility that extends console logging:

```typescript
import logger from "@/utils/logger";

// Different log levels
logger.info("Operation completed", { details: "some data" });
logger.warning("Something unusual happened");
logger.error("Operation failed", { error: err });
```

### VS Code Debugging

1. Create a `.vscode/launch.json` file:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/vitest",
      "args": ["run", "--no-threads", "${relativeFile}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

2. Set breakpoints in your code
3. Start debugging by pressing F5 or selecting the debug configuration

## 📚 Code Structure

Our codebase follows a modular structure:

- **components/** - React components
- **hooks/** - Custom React hooks
- **utils/** - Utility functions
- **types/** - TypeScript type definitions
- **constants/** - Application constants
- **contexts/** - React contexts

## 🔍 Type Safety Guidelines

1. **Always use DrawingMode enum** for tool selection:
   ```typescript
   // Good
   setTool(DrawingMode.DRAW);
   
   // Bad
   setTool("draw");
   ```

2. **Use explicit return types** for all functions and hooks:
   ```typescript
   // Good
   function calculateArea(width: number, height: number): number {
     return width * height;
   }
   
   // Bad
   function calculateArea(width: number, height: number) {
     return width * height;
   }
   ```

3. **Use interfaces** for complex object shapes:
   ```typescript
   // Good
   interface Point {
     x: number;
     y: number;
   }
   
   function moveTo(point: Point): void {
     // Implementation
   }
   
   // Bad
   function moveTo(point: { x: number, y: number }): void {
     // Implementation
   }
   ```

## 🐛 Common Issues and Solutions

### Canvas Not Rendering

If the canvas isn't rendering properly:

1. Check browser console for errors
2. Ensure the canvas container has dimensions (height/width)
3. Verify that `fabricCanvasRef.current` exists before using it
4. Try the emergency canvas implementation: `<EmergencyCanvas />`

### ESLint Errors

- **"DrawingTool should be imported from '@/types/core/DrawingTool'"**  
  Fix: Change import path as indicated

- **"Invalid DrawingMode enum value"**  
  Fix: Use values from the DrawingMode enum instead of string literals

## 🔄 Pull Request Process

1. Create a branch: `feature/your-feature-name`
2. Make changes following our coding standards
3. Add tests for new functionality
4. Run `npm test` to ensure all tests pass
5. Submit a PR with a clear description of changes

## 📞 Getting Help

- **Slack Channel**: #floorplan-dev
- **Team Lead**: Jane Smith (jane@example.com)
- **Code Questions**: Create a discussion in GitHub
