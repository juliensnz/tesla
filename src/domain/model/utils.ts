type UUID = string;

type Point = {x: number; y: number};
type Segment = [Point, Point];
type Polygon = Segment[];

type Touch = {
  x: number;
  y: number;
  distance: number;
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const getIntersection = (segment1: Segment, segment2: Segment): Touch | null => {
  const [a, b] = segment1;
  const [c, d] = segment2;

  const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
  const uTop = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
  const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);
  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), distance: t};
    }
  }
  return null;
};

const createPolygon = (points: Point[]): Polygon => {
  return points.map((point, i) => [point, points[(i + 1) % points.length]]);
};

const hasIntersection = (polygon1: Polygon, polygon2: Polygon): boolean => {
  return polygon1.some(segment1 => polygon2.some(segment2 => getIntersection(segment1, segment2) !== null));
};

export {lerp, getIntersection, hasIntersection, createPolygon};

export type {UUID, Point, Segment, Touch};
