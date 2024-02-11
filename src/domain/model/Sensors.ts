import {Car} from '@/domain/model/Car';
import {Road} from '@/domain/model/Road';
import {Point, Polygon, Segment, Touch, createPolygon, getIntersection, lerp} from '@/domain/model/utils';

type Sensors = {
  count: number;
  length: number;
  spread: number;

  rays: Segment[];
  readings: (Touch | null)[];
};

const createSensors = (count: number, length: number, spread: number) => ({
  count,
  length,
  spread,
  rays: [],
  readings: [],
});

const generateReading = (ray: Segment, polygon: Polygon): Touch | null => {
  const touches = polygon.reduce<Touch[]>((touches, segment) => {
    const touch = getIntersection(ray, segment);

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

const updateSensors = (car: Car, road: Road, traffic: Car[]): Sensors => {
  const {sensors} = car;
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

  const readings = rays.map(ray => {
    const roadTouches = generateReading(ray, road.borders);

    if (roadTouches) {
      return roadTouches;
    }

    return traffic.reduce<Touch | null>((min, car) => {
      const carTouches = generateReading(ray, createPolygon(car.hitbox));

      if (null === carTouches) {
        return min;
      }

      if (null === min) {
        return carTouches;
      }

      return carTouches.distance < min.distance ? carTouches : min;
    }, null);
  });

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

    drawLine(ctx, rayStart, intersection, 'DarkOrange');
    drawLine(ctx, intersection, rayEnd, 'black');
  }
};

export type {Sensors};
export {drawSensors, createSensors, updateSensors};
