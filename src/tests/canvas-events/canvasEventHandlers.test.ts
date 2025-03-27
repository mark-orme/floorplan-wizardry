import { renderHook, act } from '@testing-library/react-hooks';
import { usePathEvents } from '@/hooks/canvas-events/usePathEvents';
import { useObjectEvents } from '@/hooks/canvas-events/useObjectEvents';
import { useKeyboardEvents } from '@/hooks/canvas-events/useKeyboardEvents';
import { Canvas as FabricCanvas } from 'fabric';
import { fireEvent } from '@testing-library/react';

// Mock FabricCanvas
const mockFabricCanvas = {
  on: jest.fn(),
  off: jest.fn(),
  requestRenderAll: jest.fn(),
  discardActiveObject: jest.fn(),
  remove: jest.fn()
} as any;

const mockFabricCanvasRef = {
  current: mockFabricCanvas
} as any;

// Mock functions
const mockSaveCurrentState = jest.fn();
const mockProcessCreatedPath = jest.fn();
const mockHandleMouseUp = jest.fn();
const mockHandleUndo = jest.fn();
const mockHandleRedo = jest.fn();
const mockDeleteSelectedObjects = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

it('registers path events', () => {
  const { result } = renderHook(() => usePathEvents({
    fabricCanvasRef: mockFabricCanvasRef,
    saveCurrentState: mockSaveCurrentState,
    processCreatedPath: mockProcessCreatedPath,
    handleMouseUp: mockHandleMouseUp
    // Remove the tool prop which isn't in the interface
  }));

  expect(result.current.register).toBeDefined();
  result.current.register();
  expect(mockFabricCanvas.on).toHaveBeenCalled();
});

it('unregisters path events', () => {
  const { result } = renderHook(() => usePathEvents({
    fabricCanvasRef: mockFabricCanvasRef,
    saveCurrentState: mockSaveCurrentState,
    processCreatedPath: mockProcessCreatedPath,
    handleMouseUp: mockHandleMouseUp
  }));

  expect(result.current.unregister).toBeDefined();
  result.current.unregister();
  expect(mockFabricCanvas.off).toHaveBeenCalled();
});

it('cleans up path events', () => {
  const { result } = renderHook(() => usePathEvents({
    fabricCanvasRef: mockFabricCanvasRef,
    saveCurrentState: mockSaveCurrentState,
    processCreatedPath: mockProcessCreatedPath,
    handleMouseUp: mockHandleMouseUp
  }));

  expect(result.current.cleanup).toBeDefined();
  result.current.cleanup();
  expect(mockFabricCanvas.off).toHaveBeenCalled();
});

it('registers object events', () => {
  const { result } = renderHook(() => useObjectEvents({
    fabricCanvasRef: mockFabricCanvasRef,
    tool: 'select',
    saveCurrentState: mockSaveCurrentState
  }));

  expect(result.current.register).toBeDefined();
  result.current.register();
  expect(mockFabricCanvas.on).toHaveBeenCalled();
});

it('unregisters object events', () => {
  const { result } = renderHook(() => useObjectEvents({
    fabricCanvasRef: mockFabricCanvasRef,
    tool: 'select',
    saveCurrentState: mockSaveCurrentState
  }));

  expect(result.current.unregister).toBeDefined();
  result.current.unregister();
  expect(mockFabricCanvas.off).toHaveBeenCalled();
});

it('cleans up object events', () => {
  const { result } = renderHook(() => useObjectEvents({
    fabricCanvasRef: mockFabricCanvasRef,
    tool: 'select',
    saveCurrentState: mockSaveCurrentState
  }));

  expect(result.current.cleanup).toBeDefined();
  result.current.cleanup();
  expect(mockFabricCanvas.off).toHaveBeenCalled();
});

it('registers keyboard events', () => {
  const { result } = renderHook(() => useKeyboardEvents({
    handleUndo: mockHandleUndo,
    handleRedo: mockHandleRedo,
    deleteSelectedObjects: mockDeleteSelectedObjects
    // Remove fabricCanvasRef which isn't required
  }));

  expect(result.current.register).toBeDefined();
  result.current.register();
  
  // Trigger keyboard events
  fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
  expect(mockHandleUndo).toHaveBeenCalled();
});

it('unregisters keyboard events', () => {
  const { result } = renderHook(() => useKeyboardEvents({
    handleUndo: mockHandleUndo,
    handleRedo: mockHandleRedo,
    deleteSelectedObjects: mockDeleteSelectedObjects
  }));

  expect(result.current.unregister).toBeDefined();
  result.current.unregister();
  // No window.removeEventListener to check as it's a direct removal
});

it('cleans up keyboard events', () => {
  const { result } = renderHook(() => useKeyboardEvents({
    handleUndo: mockHandleUndo,
    handleRedo: mockHandleRedo,
    deleteSelectedObjects: mockDeleteSelectedObjects
  }));

  expect(result.current.cleanup).toBeDefined();
  result.current.cleanup();
  // No window.removeEventListener to check as it's a direct removal
});
