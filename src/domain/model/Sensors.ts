import {Car} from '@/domain/model/Car';
import {lerp} from '@/domain/model/utils';

type Point = {x: number; y: number};
type Segment = [Point, Point];

type Sensors = {
  count: number;
  length: number;
  spread: number;

  rays: Segment[];
};

const updateSensors = (sensors: Sensors, car: Car): Sensors => {
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

  return {...sensors, rays};
};

const drawSensors = (sensors: Sensors, ctx: CanvasRenderingContext2D) => {
  for (let i = 0; i < sensors.count; i++) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'yellow';
    ctx.moveTo(sensors.rays[i][0].x, sensors.rays[i][0].y);
    ctx.lineTo(sensors.rays[i][1].x, sensors.rays[i][1].y);
    ctx.stroke();
  }
};

export type {Sensors};
export {drawSensors, updateSensors};
