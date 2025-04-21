
# Floor Plan Application - Getting Started

Welcome to the Floor Plan Application! This guide will help you get started with the application, whether you're using it as a end user or developing new features.

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/floorplan-app.git

# Navigate to the project directory
cd floorplan-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Basic Usage

1. Open the application in your browser (usually at http://localhost:8080)
2. Create a new floor plan from the home page
3. Use the toolbar to select drawing tools (walls, rooms, furniture)
4. Draw your floor plan by clicking and dragging on the canvas
5. Save your work using the Save button in the toolbar

## Core Components

### Canvas

The canvas is the main drawing area where you create and edit floor plans.

```jsx
import { FloorPlanCanvas } from '@/components/canvas/FloorPlanCanvas';

function MyComponent() {
  const handleCanvasReady = (canvas) => {
    console.log('Canvas is ready');
  };

  return (
    <FloorPlanCanvas
      width={800}
      height={600}
      onCanvasReady={handleCanvasReady}
    />
  );
}
```

### Tools

Various tools are available for drawing and editing floor plans:

- **Select Tool**: Select and modify objects
- **Wall Tool**: Draw walls by clicking and dragging
- **Room Tool**: Create rooms by drawing a polygon
- **Furniture Tool**: Add furniture items to the floor plan

```jsx
import { ToolSelector } from '@/components/tools/ToolSelector';
import { DrawingMode } from '@/constants/drawingModes';

function MyComponent() {
  const [tool, setTool] = useState(DrawingMode.SELECT);

  return (
    <ToolSelector
      activeTool={tool}
      onToolChange={setTool}
    />
  );
}
```

## Key Hooks

The application provides several custom hooks for common functionality:

### useCanvasToolManager

Manages the active tool and its settings.

```jsx
import { useCanvasToolManager } from '@/hooks/canvas/useCanvasToolManager';

function MyComponent() {
  const { setTool, tool, lineColor, setLineColor } = useCanvasToolManager({
    canvas: myCanvas,
    initialTool: DrawingMode.WALL
  });

  return (
    <>
      <button onClick={() => setTool(DrawingMode.SELECT)}>Select</button>
      <button onClick={() => setTool(DrawingMode.WALL)}>Draw Wall</button>
    </>
  );
}
```

### useAreaCalculation

Calculates the area of rooms or selected shapes.

```jsx
import { useAreaCalculation } from '@/hooks/canvas/useAreaCalculation';

function MyComponent() {
  const { calculateArea } = useAreaCalculation(canvas);

  const handleCalculateArea = async () => {
    const { areaM2 } = await calculateArea();
    console.log(`Total area: ${areaM2} square meters`);
  };

  return (
    <button onClick={handleCalculateArea}>Calculate Area</button>
  );
}
```

### useVirtualizedCanvas

Provides canvas optimization through virtualization.

```jsx
import { useVirtualizedCanvas } from '@/hooks/useVirtualizedCanvas';

function MyComponent() {
  const {
    virtualizationEnabled,
    toggleVirtualization,
    performanceMetrics
  } = useVirtualizedCanvas(canvasRef, {
    enabled: true,
    autoToggle: true
  });

  return (
    <>
      <button onClick={toggleVirtualization}>
        {virtualizationEnabled ? 'Disable' : 'Enable'} Virtualization
      </button>
      <div>FPS: {performanceMetrics.fps}</div>
    </>
  );
}
```

## Security Features

The application includes several security features:

### CSRF Protection

All state-changing operations are protected against CSRF attacks.

```jsx
import { fetchWithCsrf } from '@/utils/security/csrfProtection';

// Use this instead of regular fetch for state-changing operations
const handleSave = async () => {
  const response = await fetchWithCsrf('/api/save', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  
  // Handle response
};
```

### Data Encryption

Sensitive data can be encrypted before storage.

```jsx
import { encryptData, generateEncryptionKey } from '@/utils/security/encryption';

const handleEncrypt = async () => {
  const key = await generateEncryptionKey('user-password');
  const encrypted = await encryptData(sensitiveData, key);
  
  // Store encrypted data
};
```

## Performance Optimization

### Using Web Workers

CPU-intensive operations can be offloaded to web workers.

```jsx
import { useWebWorker } from '@/hooks/useWebWorker';

function MyComponent() {
  const {
    postMessage,
    result,
    isProcessing
  } = useWebWorker('/workers/geometry-worker.js');

  const handleCalculate = () => {
    postMessage({
      type: 'calculateArea',
      payload: { points }
    });
  };

  return (
    <>
      <button onClick={handleCalculate} disabled={isProcessing}>
        Calculate
      </button>
      {result && <div>Result: {result.data.payload.area}</div>}
    </>
  );
}
```

## Advanced Topics

### Customizing the Grid

The grid can be customized for different scales and appearances.

```jsx
import { SimpleGrid } from '@/components/canvas/grid/SimpleGrid';

function MyComponent() {
  return (
    <SimpleGrid
      canvas={canvas}
      gridSize={50}
      gridColor="#e0e0e0"
      showControls={true}
    />
  );
}
```

### Integrating with External Services

The application can be integrated with external services for additional functionality.

```jsx
import { exportToService } from '@/utils/exportService';

const handleExport = async () => {
  const canvasData = canvas.toJSON();
  await exportToService(canvasData, 'my-floor-plan');
};
```

## Next Steps

- Check out the [Architecture Document](./architecture.md) for more details
- Explore the [API Reference](./api-reference.md) for comprehensive documentation
- See the [Example Projects](./examples.md) for inspiration
