import React, { FC, Suspense, useState, useEffect } from 'react';
// Replace CircleSquare with alternative icons
import { Circle, Square, Pen, Eraser } from 'lucide-react';
import { DrawingMode } from '@/constants/drawingModes';
import { useDrawingContext } from '@/contexts/DrawingContext';
import { useCanvas } from '@/contexts/CanvasContext';

// Define a type for the props of BasicShapes
interface BasicShapesProps {
  // Define props here
}

// Define a type for the props of DrawingTools
interface DrawingToolsProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
  // Define props here
}

// Define a type for the props of DoorTool
interface DoorToolProps {
  // Define props here
}

// Define a type for the props of WindowTool
interface WindowToolProps {
  // Define a type for the props of WindowTool
}

// Define a type for the props of StairTool
interface StairToolProps {
  // Define props here
}

// Define a type for the props of ColumnTool
interface ColumnToolProps {
  // Define props here
}

// Define a type for the props of AnnotationTool
interface AnnotationToolProps {
  // Define props here
}

// Define a type for the props of OtherTool
interface OtherToolProps {
  // Define props here
}

// Define a type for the props of SelectTool
interface SelectToolProps {
  // Define props here
}

// Define a type for the props of DrawTool
interface DrawToolProps {
  // Define props here
}

// Define a type for the props of StraightLineTool
interface StraightLineToolProps {
  // Define props here
}

// Define a type for the props of RectangleTool
interface RectangleToolProps {
  // Define props here
}

// Define a type for the props of CircleTool
interface CircleToolProps {
  // Define props here
}

// Define a type for the props of HandTool
interface HandToolProps {
  // Define props here
}

// Define a type for the props of ZoomTool
interface ZoomToolProps {
  // Define props here
}

// Define a type for the props of DimensionTool
interface DimensionToolProps {
  // Define props here
}

// Define a type for the props of RoomLabelTool
interface RoomLabelToolProps {
  // Define props here
}

// Define a type for the props of PencilTool
interface PencilToolProps {
  // Define props here
}

// Define a type for the props of ShapeTool
interface ShapeToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
  // Define props here
}

// Define a type for the props of DoorTool
interface DoorToolProps {
  // Define props here
}

// Define a type for the props of WindowTool
interface WindowToolProps {
  // Define props here
}

// Define a type for the props of StairTool
interface StairToolProps {
  // Define props here
}

// Define a type for the props of ColumnTool
interface ColumnToolProps {
  // Define props here
}

// Define a type for the props of AnnotationTool
interface AnnotationToolProps {
  // Define props here
}

// Define a type for the props of OtherTool
interface OtherToolProps {
  // Define props here
}

// Define a type for the props of SelectTool
interface SelectToolProps {
  // Define props here
}

// Define a type for the props of DrawTool
interface DrawToolProps {
  // Define props here
}

// Define a type for the props of StraightLineTool
interface StraightLineToolProps {
  // Define props here
}

// Define a type for the props of RectangleTool
interface RectangleToolProps {
  // Define props here
}

// Define a type for the props of CircleTool
interface CircleToolProps {
  // Define props here
}

// Define a type for the props of HandTool
interface HandToolProps {
  // Define props here
}

// Define a type for the props of ZoomTool
interface ZoomToolProps {
  // Define props here
}

// Define a type for the props of DimensionTool
interface DimensionToolProps {
  // Define props here
}

// Define a type for the props of RoomLabelTool
interface RoomLabelToolProps {
  // Define props here
}

// Define a type for the props of PencilTool
interface PencilToolProps {
  // Define props here
}

// Define a type for the props of ShapeTool
interface ShapeToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
  // Define props here
}

// Define a type for the props of DoorTool
interface DoorToolProps {
  // Define props here
}

// Define a type for the props of WindowTool
interface WindowToolProps {
  // Define props here
}

// Define a type for the props of StairTool
interface StairToolProps {
  // Define props here
}

// Define a type for the props of ColumnTool
interface ColumnToolProps {
  // Define props here
}

// Define a type for the props of AnnotationTool
interface AnnotationToolProps {
  // Define props here
}

// Define a type for the props of OtherTool
interface OtherToolProps {
  // Define props here
}

// Define a type for the props of SelectTool
interface SelectToolProps {
  // Define props here
}

// Define a type for the props of DrawTool
interface DrawToolProps {
  // Define props here
}

// Define a type for the props of StraightLineTool
interface StraightLineToolProps {
  // Define props here
}

// Define a type for the props of RectangleTool
interface RectangleToolProps {
  // Define props here
}

// Define a type for the props of CircleTool
interface CircleToolProps {
  // Define props here
}

// Define a type for the props of HandTool
interface HandToolProps {
  // Define props here
}

// Define a type for the props of ZoomTool
interface ZoomToolProps {
  // Define props here
}

// Define a type for the props of DimensionTool
interface DimensionToolProps {
  // Define props here
}

// Define a type for the props of RoomLabelTool
interface RoomLabelToolProps {
  // Define props here
}

// Define a type for the props of PencilTool
interface PencilToolProps {
  // Define props here
}

// Define a type for the props of ShapeTool
interface ShapeToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
  // Define props here
}

// Define a type for the props of DoorTool
interface DoorToolProps {
  // Define props here
}

// Define a type for the props of WindowTool
interface WindowToolProps {
  // Define props here
}

// Define a type for the props of StairTool
interface StairToolProps {
  // Define props here
}

// Define a type for the props of ColumnTool
interface ColumnToolProps {
  // Define props here
}

// Define a type for the props of AnnotationTool
interface AnnotationToolProps {
  // Define props here
}

// Define a type for the props of OtherTool
interface OtherToolProps {
  // Define props here
}

// Define a type for the props of SelectTool
interface SelectToolProps {
  // Define props here
}

// Define a type for the props of DrawTool
interface DrawToolProps {
  // Define props here
}

// Define a type for the props of StraightLineTool
interface StraightLineToolProps {
  // Define props here
}

// Define a type for the props of RectangleTool
interface RectangleToolProps {
  // Define props here
}

// Define a type for the props of CircleTool
interface CircleToolProps {
  // Define props here
}

// Define a type for the props of HandTool
interface HandToolProps {
  // Define props here
}

// Define a type for the props of ZoomTool
interface ZoomToolProps {
  // Define props here
}

// Define a type for the props of DimensionTool
interface DimensionToolProps {
  // Define props here
}

// Define a type for the props of RoomLabelTool
interface RoomLabelToolProps {
  // Define props here
}

// Define a type for the props of PencilTool
interface PencilToolProps {
  // Define props here
}

// Define a type for the props of ShapeTool
interface ShapeToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
  // Define props here
}

// Define a type for the props of DoorTool
interface DoorToolProps {
  // Define props here
}

// Define a type for the props of WindowTool
interface WindowToolProps {
  // Define props here
}

// Define a type for the props of StairTool
interface StairToolProps {
  // Define props here
}

// Define a type for the props of ColumnTool
interface ColumnToolProps {
  // Define props here
}

// Define a type for the props of AnnotationTool
interface AnnotationToolProps {
  // Define props here
}

// Define a type for the props of OtherTool
interface OtherToolProps {
  // Define props here
}

// Define a type for the props of SelectTool
interface SelectToolProps {
  // Define props here
}

// Define a type for the props of DrawTool
interface DrawToolProps {
  // Define props here
}

// Define a type for the props of StraightLineTool
interface StraightLineToolProps {
  // Define props here
}

// Define a type for the props of RectangleTool
interface RectangleToolProps {
  // Define props here
}

// Define a type for the props of CircleTool
interface CircleToolProps {
  // Define props here
}

// Define a type for the props of HandTool
interface HandToolProps {
  // Define props here
}

// Define a type for the props of ZoomTool
interface ZoomToolProps {
  // Define props here
}

// Define a type for the props of DimensionTool
interface DimensionToolProps {
  // Define props here
}

// Define a type for the props of RoomLabelTool
interface RoomLabelToolProps {
  // Define props here
}

// Define a type for the props of PencilTool
interface PencilToolProps {
  // Define props here
}

// Define a type for the props of ShapeTool
interface ShapeToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
  // Define props here
}

// Define a type for the props of DoorTool
interface DoorToolProps {
  // Define props here
}

// Define a type for the props of WindowTool
interface WindowToolProps {
  // Define props here
}

// Define a type for the props of StairTool
interface StairToolProps {
  // Define props here
}

// Define a type for the props of ColumnTool
interface ColumnToolProps {
  // Define props here
}

// Define a type for the props of AnnotationTool
interface AnnotationToolProps {
  // Define props here
}

// Define a type for the props of OtherTool
interface OtherToolProps {
  // Define props here
}

// Define a type for the props of SelectTool
interface SelectToolProps {
  // Define props here
}

// Define a type for the props of DrawTool
interface DrawToolProps {
  // Define props here
}

// Define a type for the props of StraightLineTool
interface StraightLineToolProps {
  // Define props here
}

// Define a type for the props of RectangleTool
interface RectangleToolProps {
  // Define props here
}

// Define a type for the props of CircleTool
interface CircleToolProps {
  // Define props here
}

// Define a type for the props of HandTool
interface HandToolProps {
  // Define props here
}

// Define a type for the props of ZoomTool
interface ZoomToolProps {
  // Define props here
}

// Define a type for the props of DimensionTool
interface DimensionToolProps {
  // Define props here
}

// Define a type for the props of RoomLabelTool
interface RoomLabelToolProps {
  // Define props here
}

// Define a type for the props of PencilTool
interface PencilToolProps {
  // Define props here
}

// Define a type for the props of ShapeTool
interface ShapeToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
  // Define props here
}

// Define a type for the props of DoorTool
interface DoorToolProps {
  // Define props here
}

// Define a type for the props of WindowTool
interface WindowToolProps {
  // Define props here
}

// Define a type for the props of StairTool
interface StairToolProps {
  // Define props here
}

// Define a type for the props of ColumnTool
interface ColumnToolProps {
  // Define props here
}

// Define a type for the props of AnnotationTool
interface AnnotationToolProps {
  // Define props here
}

// Define a type for the props of OtherTool
interface OtherToolProps {
  // Define props here
}

// Define a type for the props of SelectTool
interface SelectToolProps {
  // Define props here
}

// Define a type for the props of DrawTool
interface DrawToolProps {
  // Define props here
}

// Define a type for the props of StraightLineTool
interface StraightLineToolProps {
  // Define props here
}

// Define a type for the props of RectangleTool
interface RectangleToolProps {
  // Define props here
}

// Define a type for the props of CircleTool
interface CircleToolProps {
  // Define props here
}

// Define a type for the props of HandTool
interface HandToolProps {
  // Define props here
}

// Define a type for the props of ZoomTool
interface ZoomToolProps {
  // Define props here
}

// Define a type for the props of DimensionTool
interface DimensionToolProps {
  // Define props here
}

// Define a type for the props of RoomLabelTool
interface RoomLabelToolProps {
  // Define props here
}

// Define a type for the props of PencilTool
interface PencilToolProps {
  // Define props here
}

// Define a type for the props of ShapeTool
interface ShapeToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
  // Define props here
}

// Define a type for the props of DoorTool
interface DoorToolProps {
  // Define props here
}

// Define a type for the props of WindowTool
interface WindowToolProps {
  // Define props here
}

// Define a type for the props of StairTool
interface StairToolProps {
  // Define props here
}

// Define a type for the props of ColumnTool
interface ColumnToolProps {
  // Define props here
}

// Define a type for the props of AnnotationTool
interface AnnotationToolProps {
  // Define props here
}

// Define a type for the props of OtherTool
interface OtherToolProps {
  // Define props here
}

// Define a type for the props of SelectTool
interface SelectToolProps {
  // Define props here
}

// Define a type for the props of DrawTool
interface DrawToolProps {
  // Define props here
}

// Define a type for the props of StraightLineTool
interface StraightLineToolProps {
  // Define props here
}

// Define a type for the props of RectangleTool
interface RectangleToolProps {
  // Define props here
}

// Define a type for the props of CircleTool
interface CircleToolProps {
  // Define props here
}

// Define a type for the props of HandTool
interface HandToolProps {
  // Define props here
}

// Define a type for the props of ZoomTool
interface ZoomToolProps {
  // Define props here
}

// Define a type for the props of DimensionTool
interface DimensionToolProps {
  // Define props here
}

// Define a type for the props of RoomLabelTool
interface RoomLabelToolProps {
  // Define props here
}

// Define a type for the props of PencilTool
interface PencilToolProps {
  // Define props here
}

// Define a type for the props of ShapeTool
interface ShapeToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
  // Define props here
}

// Define a type for the props of DoorTool
interface DoorToolProps {
  // Define props here
}

// Define a type for the props of WindowTool
interface WindowToolProps {
  // Define props here
}

// Define a type for the props of StairTool
interface StairToolProps {
  // Define props here
}

// Define a type for the props of ColumnTool
interface ColumnToolProps {
  // Define props here
}

// Define a type for the props of AnnotationTool
interface AnnotationToolProps {
  // Define props here
}

// Define a type for the props of OtherTool
interface OtherToolProps {
  // Define props here
}

// Define a type for the props of SelectTool
interface SelectToolProps {
  // Define props here
}

// Define a type for the props of DrawTool
interface DrawToolProps {
  // Define props here
}

// Define a type for the props of StraightLineTool
interface StraightLineToolProps {
  // Define props here
}

// Define a type for the props of RectangleTool
interface RectangleToolProps {
  // Define props here
}

// Define a type for the props of CircleTool
interface CircleToolProps {
  // Define props here
}

// Define a type for the props of HandTool
interface HandToolProps {
  // Define props here
}

// Define a type for the props of ZoomTool
interface ZoomToolProps {
  // Define props here
}

// Define a type for the props of DimensionTool
interface DimensionToolProps {
  // Define props here
}

// Define a type for the props of RoomLabelTool
interface RoomLabelToolProps {
  // Define props here
}

// Define a type for the props of PencilTool
interface PencilToolProps {
  // Define props here
}

// Define a type for the props of ShapeTool
interface ShapeToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
  // Define props here
}

// Define a type for the props of DoorTool
interface DoorToolProps {
  // Define props here
}

// Define a type for the props of WindowTool
interface WindowToolProps {
  // Define props here
}

// Define a type for the props of StairTool
interface StairToolProps {
  // Define props here
}

// Define a type for the props of ColumnTool
interface ColumnToolProps {
  // Define props here
}

// Define a type for the props of AnnotationTool
interface AnnotationToolProps {
  // Define props here
}

// Define a type for the props of OtherTool
interface OtherToolProps {
  // Define props here
}

// Define a type for the props of SelectTool
interface SelectToolProps {
  // Define props here
}

// Define a type for the props of DrawTool
interface DrawToolProps {
  // Define props here
}

// Define a type for the props of StraightLineTool
interface StraightLineToolProps {
  // Define props here
}

// Define a type for the props of RectangleTool
interface RectangleToolProps {
  // Define props here
}

// Define a type for the props of CircleTool
interface CircleToolProps {
  // Define props here
}

// Define a type for the props of HandTool
interface HandToolProps {
  // Define props here
}

// Define a type for the props of ZoomTool
interface ZoomToolProps {
  // Define props here
}

// Define a type for the props of DimensionTool
interface DimensionToolProps {
  // Define props here
}

// Define a type for the props of RoomLabelTool
interface RoomLabelToolProps {
  // Define props here
}

// Define a type for the props of PencilTool
interface PencilToolProps {
  // Define props here
}

// Define a type for the props of ShapeTool
interface ShapeToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
  // Define props here
}

// Define a type for the props of DoorTool
interface DoorToolProps {
  // Define props here
}

// Define a type for the props of WindowTool
interface WindowToolProps {
  // Define props here
}

// Define a type for the props of StairTool
interface StairToolProps {
  // Define props here
}

// Define a type for the props of ColumnTool
interface ColumnToolProps {
  // Define props here
}

// Define a type for the props of AnnotationTool
interface AnnotationToolProps {
  // Define props here
}

// Define a type for the props of OtherTool
interface OtherToolProps {
  // Define props here
}

// Define a type for the props of SelectTool
interface SelectToolProps {
  // Define props here
}

// Define a type for the props of DrawTool
interface DrawToolProps {
  // Define props here
}

// Define a type for the props of StraightLineTool
interface StraightLineToolProps {
  // Define props here
}

// Define a type for the props of RectangleTool
interface RectangleToolProps {
  // Define props here
}

// Define a type for the props of CircleTool
interface CircleToolProps {
  // Define props here
}

// Define a type for the props of HandTool
interface HandToolProps {
  // Define props here
}

// Define a type for the props of ZoomTool
interface ZoomToolProps {
  // Define props here
}

// Define a type for the props of DimensionTool
interface DimensionToolProps {
  // Define props here
}

// Define a type for the props of RoomLabelTool
interface RoomLabelToolProps {
  // Define props here
}

// Define a type for the props of PencilTool
interface PencilToolProps {
  // Define props here
}

// Define a type for the props of ShapeTool
interface ShapeToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
  // Define props here
}

// Define a type for the props of DoorTool
interface DoorToolProps {
  // Define props here
}

// Define a type for the props of WindowTool
interface WindowToolProps {
  // Define props here
}

// Define a type for the props of StairTool
interface StairToolProps {
  // Define props here
}

// Define a type for the props of ColumnTool
interface ColumnToolProps {
  // Define props here
}

// Define a type for the props of AnnotationTool
interface AnnotationToolProps {
  // Define props here
}

// Define a type for the props of OtherTool
interface OtherToolProps {
  // Define props here
}

// Define a type for the props of SelectTool
interface SelectToolProps {
  // Define props here
}

// Define a type for the props of DrawTool
interface DrawToolProps {
  // Define props here
}

// Define a type for the props of StraightLineTool
interface StraightLineToolProps {
  // Define props here
}

// Define a type for the props of RectangleTool
interface RectangleToolProps {
  // Define props here
}

// Define a type for the props of CircleTool
interface CircleToolProps {
  // Define props here
}

// Define a type for the props of HandTool
interface HandToolProps {
  // Define props here
}

// Define a type for the props of ZoomTool
interface ZoomToolProps {
  // Define props here
}

// Define a type for the props of DimensionTool
interface DimensionToolProps {
  // Define props here
}

// Define a type for the props of RoomLabelTool
interface RoomLabelToolProps {
  // Define props here
}

// Define a type for the props of PencilTool
interface PencilToolProps {
  // Define props here
}

// Define a type for the props of ShapeTool
interface ShapeToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
  // Define props here
}

// Define a type for the props of DoorTool
interface DoorToolProps {
  // Define props here
}

// Define a type for the props of WindowTool
interface WindowToolProps {
  // Define props here
}

// Define a type for the props of StairTool
interface StairToolProps {
  // Define props here
}

// Define a type for the props of ColumnTool
interface ColumnToolProps {
  // Define props here
}

// Define a type for the props of AnnotationTool
interface AnnotationToolProps {
  // Define props here
}

// Define a type for the props of OtherTool
interface OtherToolProps {
  // Define props here
}

// Define a type for the props of SelectTool
interface SelectToolProps {
  // Define props here
}

// Define a type for the props of DrawTool
interface DrawToolProps {
  // Define props here
}

// Define a type for the props of StraightLineTool
interface StraightLineToolProps {
  // Define props here
}

// Define a type for the props of RectangleTool
interface RectangleToolProps {
  // Define props here
}

// Define a type for the props of CircleTool
interface CircleToolProps {
  // Define props here
}

// Define a type for the props of HandTool
interface HandToolProps {
  // Define props here
}

// Define a type for the props of ZoomTool
interface ZoomToolProps {
  // Define props here
}

// Define a type for the props of DimensionTool
interface DimensionToolProps {
  // Define props here
}

// Define a type for the props of RoomLabelTool
interface RoomLabelToolProps {
  // Define props here
}

// Define a type for the props of PencilTool
interface PencilToolProps {
  // Define props here
}

// Define a type for the props of ShapeTool
interface ShapeToolProps {
  // Define props here
}

// Define a type for the props of PanTool
interface PanToolProps {
  // Define props here
}

// Define a type for the props of EraserTool
interface EraserToolProps {
  // Define props here
}

// Define a type for the props of MeasureTool
interface MeasureToolProps {
  // Define props here
}

// Define a type for the props of TextTool
interface TextToolProps {
  // Define props here
}

// Define a type for the props of LineTool
interface LineToolProps {
  // Define props here
}

// Define a type for the props of WallTool
interface WallToolProps {
  // Define props here
}

// Define a type for the props of RoomTool
interface RoomToolProps {
