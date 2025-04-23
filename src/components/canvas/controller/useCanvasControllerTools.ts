import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvasLifecycle } from './useCanvasLifecycle';
import { useObjectSelection } from './useObjectSelection';
import { useCanvasZoom } from './useCanvasZoom';
import { useCanvasPan } from './useCanvasPan';
import { useDrawingMode } from './useDrawingMode';
import { useObjectActions } from './useObjectActions';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { useCanvasExport } from './useCanvasExport';
import { useCanvasState } from './useCanvasState';
import { useGridToggle } from './useGridToggle';
import { useObjectSnapping } from './useObjectSnapping';
import { useObjectLocking } from './useObjectLocking';
import { useObjectDuplication } from './useObjectDuplication';
import { useObjectResizing } from './useObjectResizing';
import { useObjectCentering } from './useObjectCentering';
import { useObjectClipping } from './useObjectClipping';
import { useObjectAlignment } from './useObjectAlignment';
import { useObjectDistribution } from './useObjectDistribution';
import { useObjectRotation } from './useObjectRotation';
import { useObjectOpacity } from './useObjectOpacity';
import { useObjectLayering } from './useObjectLayering';
import { useObjectGrouping } from './useObjectGrouping';
import { useObjectFiltering } from './useObjectFiltering';
import { useObjectTextEditing } from './useObjectTextEditing';
import { useObjectPathEditing } from './useObjectPathEditing';
import { useObjectAnimation } from './useObjectAnimation';
import { useObjectDataBinding } from './useObjectDataBinding';
import { useObject3d } from './useObject3d';
import { useObjectSvgImport } from './useObjectSvgImport';
import { useObjectCodeGeneration } from './useObjectCodeGeneration';
import { useObjectPatternFilling } from './useObjectPatternFilling';
import { useObjectShadowing } from './useObjectShadowing';
import { useObjectGradientFilling } from './useObjectGradientFilling';
import { useObjectBorders } from './useObjectBorders';
import { useObjectCornerStyling } from './useObjectCornerStyling';
import { useObjectTransformations } from './useObjectTransformations';
import { useObjectCaching } from './useObjectCaching';
import { useObjectInteractions } from './useObjectInteractions';
import { useObjectAccessibility } from './useObjectAccessibility';
import { useObjectHistory } from './useObjectHistory';
import { useObjectCollaboration } from './useObjectCollaboration';
import { useObjectPersistence } from './useObjectPersistence';
import { useObjectTesting } from './useObjectTesting';
import { useObjectDebugging } from './useObjectDebugging';
import { useObjectPerformance } from './useObjectPerformance';
import { useObjectSecurity } from './useObjectSecurity';
import { useObjectCustomization } from './useObjectCustomization';
import { useObjectExtension } from './useObjectExtension';
import { useObjectTheming } from './useObjectTheming';
import { useObjectResponsiveness } from './useObjectResponsiveness';
import { useObjectInternationalization } from './useObjectInternationalization';
import { useObjectAnalytics } from './useObjectAnalytics';
import { useObjectMonetization } from './useObjectMonetization';
import { useObjectLicensing } from './useObjectLicensing';
import { useObjectLegal } from './useObjectLegal';
import { useObjectEthical } from './useObjectEthical';
import { useObjectFuture } from './useObjectFuture';
import { createSimpleGrid } from '@/utils/simpleGridCreator';

interface UseCanvasControllerToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  showGrid: boolean;
}

export const useCanvasControllerTools = ({ fabricCanvasRef, showGrid }: UseCanvasControllerToolsProps) => {
  const [isToolActive, setIsToolActive] = useState(false);

  // Canvas lifecycle management
  const { initializeCanvas, destroyCanvas } = useCanvasLifecycle(fabricCanvasRef);

  // Object selection and manipulation
  const { selectObject, deselectObject } = useObjectSelection(fabricCanvasRef);

  // Canvas zoom and pan
  const { zoomIn, zoomOut, resetZoom } = useCanvasZoom(fabricCanvasRef);
  const { panCanvas } = useCanvasPan(fabricCanvasRef);

  // Drawing mode
  const { setDrawingMode } = useDrawingMode(fabricCanvasRef);

  // Object actions
  const { addObject, removeObject, cloneObject } = useObjectActions(fabricCanvasRef);

  // Keyboard shortcuts
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts(fabricCanvasRef);

  // Canvas export
  const { exportToJSON, exportToImage, exportToSVG, exportToPDF } = useCanvasExport(fabricCanvasRef);

  // Canvas state management
  const { saveState, restoreState, clearCanvas } = useCanvasState(fabricCanvasRef);

  // Grid toggle
  const { toggleGrid } = useGridToggle(fabricCanvasRef);

  // Object snapping
  const { enableSnapping, disableSnapping } = useObjectSnapping(fabricCanvasRef);

  // Object locking
  const { lockObject, unlockObject } = useObjectLocking(fabricCanvasRef);

  // Object duplication
  const { duplicateObject } = useObjectDuplication(fabricCanvasRef);

  // Object resizing
  const { resizeObject } = useObjectResizing(fabricCanvasRef);

  // Object centering
  const { centerObject } = useObjectCentering(fabricCanvasRef);

  // Object clipping
  const { clipObject } = useObjectClipping(fabricCanvasRef);

  // Object alignment
  const { alignObject } = useObjectAlignment(fabricCanvasRef);

  // Object distribution
  const { distributeObjects } = useObjectDistribution(fabricCanvasRef);

  // Object rotation
  const { rotateObject } = useObjectRotation(fabricCanvasRef);

  // Object opacity
  const { setOpacity } = useObjectOpacity(fabricCanvasRef);

  // Object layering
  const { bringForward, bringToFront, sendBackward, sendToBack } = useObjectLayering(fabricCanvasRef);

  // Object grouping
  const { groupObjects, ungroupObjects } = useObjectGrouping(fabricCanvasRef);

  // Object filtering
  const { applyFilter, removeFilter } = useObjectFiltering(fabricCanvasRef);

  // Object text editing
  const { editText } = useObjectTextEditing(fabricCanvasRef);

  // Object path editing
  const { editPath } = useObjectPathEditing(fabricCanvasRef);

  // Object animation
  const { animateObject } = useObjectAnimation(fabricCanvasRef);

  // Object data binding
  const { bindData } = useObjectDataBinding(fabricCanvasRef);

  // Object 3D
  const { make3D } = useObject3d(fabricCanvasRef);

  // Object SVG import
  const { importSVG } = useObjectSvgImport(fabricCanvasRef);

  // Object code generation
  const { generateCode } = useObjectCodeGeneration(fabricCanvasRef);

  // Object pattern filling
  const { fillWithPattern } = useObjectPatternFilling(fabricCanvasRef);

  // Object shadowing
  const { applyShadow } = useObjectShadowing(fabricCanvasRef);

  // Object gradient filling
  const { fillWithGradient } = useObjectGradientFilling(fabricCanvasRef);

  // Object borders
  const { setBorder } = useObjectBorders(fabricCanvasRef);

  // Object corner styling
  const { styleCorners } = useObjectCornerStyling(fabricCanvasRef);

  // Object transformations
  const { transformObject } = useObjectTransformations(fabricCanvasRef);

  // Object caching
  const { cacheObject } = useObjectCaching(fabricCanvasRef);

  // Object interactions
  const { enableInteractions, disableInteractions } = useObjectInteractions(fabricCanvasRef);

  // Object accessibility
  const { makeAccessible } = useObjectAccessibility(fabricCanvasRef);

  // Object history
  const { undo, redo } = useObjectHistory(fabricCanvasRef);

  // Object collaboration
  const { enableCollaboration, disableCollaboration } = useObjectCollaboration(fabricCanvasRef);

  // Object persistence
  const { saveToDatabase, loadFromDatabase } = useObjectPersistence(fabricCanvasRef);

  // Object testing
  const { testObject } = useObjectTesting(fabricCanvasRef);

  // Object debugging
  const { debugObject } = useObjectDebugging(fabricCanvasRef);

  // Object performance
  const { measurePerformance } = useObjectPerformance(fabricCanvasRef);

  // Object security
  const { secureObject } = useObjectSecurity(fabricCanvasRef);

  // Object customization
  const { customizeObject } = useObjectCustomization(fabricCanvasRef);

  // Object extension
  const { extendObject } = useObjectExtension(fabricCanvasRef);

  // Object theming
  const { applyTheme } = useObjectTheming(fabricCanvasRef);

  // Object responsiveness
  const { makeResponsive } = useObjectResponsiveness(fabricCanvasRef);

  // Object internationalization
  const { translateObject } = useObjectInternationalization(fabricCanvasRef);

  // Object analytics
  const { trackAnalytics } = useObjectAnalytics(fabricCanvasRef);

  // Object monetization
  const { monetizeObject } = useObjectMonetization(fabricCanvasRef);

  // Object licensing
  const { licenseObject } = useObjectLicensing(fabricCanvasRef);

  // Object legal
  const { complyWithLegal } = useObjectLegal(fabricCanvasRef);

  // Object ethical
  const { ensureEthical } = useObjectEthical(fabricCanvasRef);

  // Object future
  const { prepareForFuture } = useObjectFuture(fabricCanvasRef);

  return {
    isToolActive,
    setIsToolActive,
    initializeCanvas,
    destroyCanvas,
    selectObject,
    deselectObject,
    zoomIn,
    zoomOut,
    resetZoom,
    panCanvas,
    setDrawingMode,
    addObject,
    removeObject,
    cloneObject,
    registerShortcut,
    unregisterShortcut,
    exportToJSON,
    exportToImage,
    exportToSVG,
    exportToPDF,
    saveState,
    restoreState,
    clearCanvas,
    toggleGrid,
    enableSnapping,
    disableSnapping,
    lockObject,
    unlockObject,
    duplicateObject,
    resizeObject,
    centerObject,
    clipObject,
    alignObject,
    distributeObjects,
    rotateObject,
    setOpacity,
    bringForward,
    bringToFront,
    sendBackward,
    sendToBack,
    groupObjects,
    ungroupObjects,
    applyFilter,
    removeFilter,
    editText,
    editPath,
    animateObject,
    bindData,
    make3D,
    importSVG,
    generateCode,
    fillWithPattern,
    applyShadow,
    fillWithGradient,
    setBorder,
    styleCorners,
    transformObject,
    cacheObject,
    enableInteractions,
    disableInteractions,
    makeAccessible,
    undo,
    redo,
    enableCollaboration,
    disableCollaboration,
    saveToDatabase,
    loadFromDatabase,
    testObject,
    debugObject,
    measurePerformance,
    secureObject,
    customizeObject,
    extendObject,
    applyTheme,
    makeResponsive,
    translateObject,
    trackAnalytics,
    monetizeObject,
    licenseObject,
    complyWithLegal,
    ensureEthical,
    prepareForFuture
  };
};
