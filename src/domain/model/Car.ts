import {Controls} from '@/components/hooks/useControls';

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
};

const createCar = (x: number, y: number, width: number, height: number): Car => ({
  position: {x, y, angle: 0},
  size: {width, height},
  motion: {
    speed: 0,
    acceleration: 0.2,
    maxSpeed: 3,
    friction: 0.05,
  },
});

const drawCar = (car: Car, ctx: CanvasRenderingContext2D) => {
  ctx.save();
  ctx.translate(car.position.x, car.position.y);
  ctx.rotate(-car.position.angle);

  ctx.beginPath();
  ctx.rect(-car.size.width / 2, -car.size.height / 2, car.size.width, car.size.height);
  ctx.fill();

  ctx.restore();
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

const updateCar = (car: Car, controls: Controls): Car => {
  const movedCar = moveCar(car, controls);

  return movedCar;
};

export type {Car};
export {drawCar, updateCar, createCar};
