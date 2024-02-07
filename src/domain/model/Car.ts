import {Controls} from '@/components/hooks/useControls';
import {Road} from '@/domain/model/Road';
import {Point, createPolygon, hasIntersection} from '@/domain/model/utils';

type Car = {
  position: {
    x: number;
    y: number;
    angle: number;
  };
  size: {
    width: number;
    height: number;
  };
  motion: {
    speed: number;
    acceleration: number;
    maxSpeed: number;
    friction: number;
  };
  damaged: boolean;
  hitbox: [Point, Point, Point, Point];
};

const createCar = (x: number, y: number, width: number, height: number, maxSpeed: number = 3): Car => ({
  position: {x, y, angle: 0},
  size: {width, height},
  motion: {
    speed: 0,
    acceleration: 0.2,
    maxSpeed,
    friction: 0.05,
  },
  damaged: false,
  hitbox: [
    {x: x - width / 2, y: y - height / 2},
    {x: x + width / 2, y: y - height / 2},
    {x: x + width / 2, y: y + height / 2},
    {x: x - width / 2, y: y + height / 2},
  ],
});

const drawCar = (car: Car, ctx: CanvasRenderingContext2D) => {
  if (car.damaged) {
    ctx.fillStyle = 'red';
  } else {
    ctx.fillStyle = 'black';
  }
  ctx.beginPath();
  ctx.moveTo(car.hitbox[0].x, car.hitbox[0].y);
  for (let i = 1; i < car.hitbox.length; i++) {
    ctx.lineTo(car.hitbox[i].x, car.hitbox[i].y);
  }
  ctx.fill();
};

const updateSpeed = (car: Car, controls: Controls): number => {
  if (car.motion.speed > car.motion.maxSpeed) {
    return car.motion.maxSpeed;
  }
  if (car.motion.speed < -car.motion.maxSpeed / 2) {
    return -car.motion.maxSpeed / 2;
  }

  if (controls.forward) {
    return car.motion.speed + car.motion.acceleration;
  }

  if (controls.reverse) {
    return car.motion.speed - car.motion.acceleration;
  }

  if (Math.abs(car.motion.speed) < car.motion.friction) {
    return 0;
  }
  if (car.motion.speed > 0 && !controls.forward) {
    return car.motion.speed - car.motion.friction;
  }
  if (car.motion.speed < 0 && !controls.reverse) {
    return car.motion.speed + car.motion.friction;
  }

  return car.motion.speed;
};

const updateAngle = (car: Car, controls: Controls): number => {
  if (car.motion.speed === 0) {
    return car.position.angle;
  }

  const flip = car.motion.speed < 0 ? -1 : 1;

  if (controls.left) {
    return car.position.angle + 0.03 * flip;
  }
  if (controls.right) {
    return car.position.angle - 0.03 * flip;
  }

  return car.position.angle;
};

const moveCar = (car: Car, controls: Controls): Car => {
  const newSpeed = updateSpeed(car, controls);
  const newAngle = updateAngle(car, controls);

  const newXPosition = car.position.x - newSpeed * Math.sin(newAngle);
  const newYPosition = car.position.y - newSpeed * Math.cos(newAngle);

  return {
    ...car,
    motion: {...car.motion, speed: newSpeed},
    position: {...car.position, y: newYPosition, x: newXPosition, angle: newAngle},
  };
};

const getCarHitBox = (car: Car): [Point, Point, Point, Point] => {
  const rad = Math.hypot(car.size.width, car.size.height) / 2;
  const alpha = Math.atan2(car.size.width, car.size.height);

  return [
    {
      x: car.position.x - rad * Math.sin(car.position.angle + alpha),
      y: car.position.y - rad * Math.cos(car.position.angle + alpha),
    },
    {
      x: car.position.x - rad * Math.sin(car.position.angle - alpha),
      y: car.position.y - rad * Math.cos(car.position.angle - alpha),
    },
    {
      x: car.position.x - rad * Math.sin(Math.PI + car.position.angle + alpha),
      y: car.position.y - rad * Math.cos(Math.PI + car.position.angle + alpha),
    },
    {
      x: car.position.x - rad * Math.sin(Math.PI + car.position.angle - alpha),
      y: car.position.y - rad * Math.cos(Math.PI + car.position.angle - alpha),
    },
  ];
};

const assessDamages = (car: Car, road: Road, traffic: Car[]): boolean => {
  return (
    road.borders.some(border => hasIntersection(createPolygon(car.hitbox), createPolygon(border))) ||
    traffic.some(otherCar => hasIntersection(createPolygon(car.hitbox), createPolygon(otherCar.hitbox)))
  );
};

const updateCar = (car: Car, controls: Controls, road: Road, traffic: Car[]): Car => {
  const movedCar = !car.damaged ? moveCar(car, controls) : car;

  return {...movedCar, hitbox: getCarHitBox(movedCar), damaged: car.damaged || assessDamages(movedCar, road, traffic)};
};

export type {Car};
export {drawCar, updateCar, createCar};
