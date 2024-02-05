import {Car} from '@/domain/model/Car';
import {Road} from '@/domain/model/Road';
import {Point, Segment, Touch, getIntersection, lerp} from '@/domain/model/utils';

type Sensors = {
  count: number;
  length: number;
  spread: number;

  rays: Segment[];
  readings: (Touch | null)[];
};

const generateReading = (ray: Segment, road: Road): Touch | null => {
  const touches = road.borders.reduce<Touch[]>((touches, border) => {
    const touch = getIntersection(ray, border);

    if (null === touch) {
      return touches;
    }

    return [...touches, touch];
  }, []);

  if (touches.length === 0) {
    return null;
  }

  return touches.reduce((min, touch) => (touch.distance < min.distance ? touch : min), touches[0]);
};

const updateSensors = (sensors: Sensors, car: Car, road: Road): Sensors => {
  const rays = Array.from({length: sensors.count}, (_, i) => {
    const angle =
      lerp(sensors.spread / 2, -sensors.spread / 2, sensors.count === 1 ? 0.5 : i / (sensors.count - 1)) +
      car.position.angle;
    const start = {x: car.position.x, y: car.position.y};
    const end = {
      x: car.position.x - Math.sin(angle) * sensors.length,
      y: car.position.y - Math.cos(angle) * sensors.length,
    };

    return [start, end] as Segment;
  });

  const readings = rays.map(ray => generateReading(ray, road));

  return {...sensors, rays, readings};
};

const drawLine = (ctx: CanvasRenderingContext2D, start: Point, end: Point, color: string) => {
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;

  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
};

const drawSensors = (sensors: Sensors, ctx: CanvasRenderingContext2D) => {
  for (let i = 0; i < sensors.count; i++) {
    const rayStart = sensors.rays[i][0];
    const rayEnd = sensors.rays[i][1];
    const intersection = sensors.readings[i] ? (sensors.readings[i] as Touch) : sensors.rays[i][1];

    drawLine(ctx, rayStart, intersection, 'yellow');
    drawLine(ctx, intersection, rayEnd, 'black');
  }
};

export type {Sensors};
export {drawSensors, updateSensors};
