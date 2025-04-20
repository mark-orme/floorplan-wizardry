
export interface Point {
  x: number;
  y: number;
}

export interface Line {
  start: Point;
  end: Point;
}

export interface LineSegment {
  p1: Point;
  p2: Point;
}

export interface WorkerMessageData {
  type: string;
  payload: any;
}
