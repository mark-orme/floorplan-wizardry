
import { StrokeTypeLiteral, Stroke } from '@/types/floor-plan/unifiedTypes';
import { asStrokeType } from '@/utils/typeAdapters';
import { createTestPoint } from './createTestPoint';

/**
 * Create a test stroke
 * @param partialStroke Partial stroke data
 * @returns Test stroke
 */
export function createTestStroke(partialStroke: Partial<Stroke> = {}): Stroke {
  const type = partialStroke.type || asStrokeType('line');
  const thickness = partialStroke.thickness || 2;
  
  return {
    id: partialStroke.id || 'stroke-test',
    points: partialStroke.points || [createTestPoint(0, 0), createTestPoint(100, 100)],
    type,
    color: partialStroke.color || '#000000',
    thickness,
    width: partialStroke.width || thickness // Width should equal thickness if not provided
  };
}
